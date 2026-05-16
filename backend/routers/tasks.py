from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timezone
from typing import List, Optional
from database import get_db
import models, schemas, auth
from ml.pattern_learner import PatternLearner
from ml import ai_friend

router = APIRouter(prefix="/tasks", tags=["tasks"])


def _get_learner(user: models.User) -> PatternLearner:
    return PatternLearner(user.nn_weights)


def _save_learner(user: models.User, learner: PatternLearner, db: Session):
    user.nn_weights = learner.to_json()
    user.nn_version = (user.nn_version or 0) + 1
    db.commit()


def _update_user_stats(user: models.User, db: Session):
    total = db.query(models.Task).filter(models.Task.owner_id == user.id).count()
    done = db.query(models.Task).filter(
        and_(models.Task.owner_id == user.id, models.Task.completed == True)
    ).count()
    user.total_tasks = total
    user.completed_tasks = done
    user.avg_completion_rate = done / total if total > 0 else 0.0
    db.commit()


@router.get("", response_model=List[schemas.TaskResponse])
def list_tasks(
    completed: Optional[bool] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    q = db.query(models.Task).filter(models.Task.owner_id == current_user.id)
    if completed is not None:
        q = q.filter(models.Task.completed == completed)
    if category:
        q = q.filter(models.Task.category == category)
    tasks = q.order_by(models.Task.created_at.desc()).all()

    # Annotate with live completion probability from the user's model
    learner = _get_learner(current_user)
    now = datetime.now()
    for task in tasks:
        if not task.completed:
            days = None
            if task.due_date:
                days = (task.due_date.replace(tzinfo=None) - now).days
            task.predicted_completion_prob = learner.predict(
                hour=now.hour, dow=now.weekday(), priority=task.priority,
                category=task.category, days_until_due=days,
                reminders_sent=task.reminders_sent,
            )
    return tasks


@router.post("", response_model=schemas.TaskResponse)
def create_task(
    task_data: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    task = models.Task(owner_id=current_user.id, **task_data.model_dump())
    db.add(task)

    # Log interaction for pattern learning
    now = datetime.now()
    interaction = models.Interaction(
        user_id=current_user.id, task_id=None, event_type="task_created",
        hour_of_day=now.hour, day_of_week=now.weekday(),
        category=task_data.category, priority=task_data.priority,
    )
    db.add(interaction)
    db.commit()
    db.refresh(task)
    _update_user_stats(current_user, db)
    return task


@router.patch("/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    updates: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    task = db.query(models.Task).filter(
        and_(models.Task.id == task_id, models.Task.owner_id == current_user.id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    was_completed = task.completed
    update_data = updates.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(task, field, value)

    now = datetime.now()

    # If task just got completed, train the neural network
    if not was_completed and updates.completed:
        task.completed_at = now
        learner = _get_learner(current_user)
        days = None
        if task.due_date:
            days = (task.due_date.replace(tzinfo=None) - now).days

        learner.update(
            hour=now.hour, dow=now.weekday(), priority=task.priority,
            category=task.category, days_until_due=days,
            completed=True, reminders_sent=task.reminders_sent,
        )
        _save_learner(current_user, learner, db)

        interaction = models.Interaction(
            user_id=current_user.id, task_id=task.id, event_type="task_completed",
            hour_of_day=now.hour, day_of_week=now.weekday(),
            category=task.category, priority=task.priority,
        )
        db.add(interaction)

        # Update most productive hour heuristic
        hours = db.query(models.Interaction).filter(
            and_(models.Interaction.user_id == current_user.id,
                 models.Interaction.event_type == "task_completed")
        ).all()
        if hours:
            hour_counts = [0] * 24
            for h in hours:
                if h.hour_of_day is not None:
                    hour_counts[h.hour_of_day] += 1
            current_user.most_productive_hour = hour_counts.index(max(hour_counts))

    db.commit()
    db.refresh(task)
    _update_user_stats(current_user, db)
    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    task = db.query(models.Task).filter(
        and_(models.Task.id == task_id, models.Task.owner_id == current_user.id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Train on non-completion if task was pending too long
    if not task.completed:
        learner = _get_learner(current_user)
        now = datetime.now()
        days = None
        if task.due_date:
            days = (task.due_date.replace(tzinfo=None) - now).days
        learner.update(
            hour=now.hour, dow=now.weekday(), priority=task.priority,
            category=task.category, days_until_due=days,
            completed=False, reminders_sent=task.reminders_sent,
        )
        _save_learner(current_user, learner, db)

    db.delete(task)
    db.commit()
    return {"ok": True}


@router.get("/stats/insights", response_model=schemas.PatternInsight)
def get_insights(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    interactions = db.query(models.Interaction).filter(
        and_(models.Interaction.user_id == current_user.id,
             models.Interaction.event_type == "task_completed")
    ).all()

    weekly_pattern = [0.0] * 7
    hourly_pattern = [0.0] * 24
    category_counts: dict = {}

    for i in interactions:
        if i.day_of_week is not None:
            weekly_pattern[i.day_of_week] += 1
        if i.hour_of_day is not None:
            hourly_pattern[i.hour_of_day] += 1
        if i.category:
            category_counts[i.category] = category_counts.get(i.category, 0) + 1

    # Normalize
    max_w = max(weekly_pattern) or 1
    max_h = max(hourly_pattern) or 1
    weekly_pattern = [x / max_w for x in weekly_pattern]
    hourly_pattern = [x / max_h for x in hourly_pattern]

    best_category = max(category_counts, key=category_counts.get) if category_counts else None

    return schemas.PatternInsight(
        most_productive_hour=current_user.most_productive_hour,
        best_category=best_category,
        completion_rate=current_user.avg_completion_rate,
        total_tasks=current_user.total_tasks,
        completed_tasks=current_user.completed_tasks,
        weekly_pattern=weekly_pattern,
        hourly_pattern=hourly_pattern,
        category_stats=category_counts,
    )
