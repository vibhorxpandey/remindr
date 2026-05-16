from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import and_
from datetime import datetime, timedelta
import asyncio
import logging

from database import engine, SessionLocal
import models
from routers import users, tasks, ai as ai_router
from ml.pattern_learner import PatternLearner
from ml import ai_friend

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("remindr")

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Remindr API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(ai_router.router)


async def run_reminder_engine():
    """
    Runs every 30 minutes. For each user with pending tasks:
    - Predict completion probability for each task at the current time
    - Send reminder for tasks that score high urgency (near due) or are likely to be done now
    - Cross-check tasks past their due date and nudge the user
    """
    db = SessionLocal()
    try:
        now = datetime.now()
        users_list = db.query(models.User).all()

        for user in users_list:
            learner = PatternLearner(user.nn_weights)
            pending_tasks = db.query(models.Task).filter(
                and_(
                    models.Task.owner_id == user.id,
                    models.Task.completed == False,
                    models.Task.snoozed_until == None,
                )
            ).all()

            tasks_with_snoozed = db.query(models.Task).filter(
                and_(
                    models.Task.owner_id == user.id,
                    models.Task.completed == False,
                    models.Task.snoozed_until <= now,
                )
            ).all()
            pending_tasks.extend(tasks_with_snoozed)

            for task in pending_tasks:
                # Don't spam — wait at least 2 hours between reminders
                if task.last_reminded_at:
                    hours_since = (now - task.last_reminded_at).total_seconds() / 3600
                    if hours_since < 2:
                        continue

                days_until_due = None
                if task.due_date:
                    days_until_due = (task.due_date.replace(tzinfo=None) - now).days

                prob = learner.predict(
                    hour=now.hour, dow=now.weekday(), priority=task.priority,
                    category=task.category, days_until_due=days_until_due,
                    reminders_sent=task.reminders_sent,
                )

                should_remind = False
                # High urgency: due within 24 hours
                if days_until_due is not None and days_until_due <= 1:
                    should_remind = True
                # Overdue
                elif days_until_due is not None and days_until_due < 0:
                    should_remind = True
                # Good time based on pattern (probability > 0.6)
                elif prob > 0.6:
                    should_remind = True
                # High priority that's been waiting > 24h
                elif task.priority == 3 and (now - task.created_at).total_seconds() > 86400:
                    should_remind = True

                if should_remind:
                    message = ai_friend.reminder_message(
                        name=user.username,
                        task_title=task.title,
                        days_until_due=days_until_due,
                    )

                    reminder = models.Reminder(
                        user_id=user.id, task_id=task.id, message=message
                    )
                    db.add(reminder)
                    task.reminders_sent += 1
                    task.last_reminded_at = now

                    # Push via WebSocket
                    await ai_router.notify_user(user.id, message)
                    logger.info(f"Reminder sent to {user.username} for task '{task.title}'")

            db.commit()
    except Exception as e:
        logger.error(f"Reminder engine error: {e}")
    finally:
        db.close()


async def retrain_models():
    """
    Runs every 6 hours. Batch-retrain each user's neural network on all their interaction history.
    This allows the model to pick up on longer-term patterns.
    """
    db = SessionLocal()
    try:
        users_list = db.query(models.User).all()
        for user in users_list:
            interactions = db.query(models.Interaction).filter(
                models.Interaction.user_id == user.id
            ).all()

            tasks_map = {}
            completed_tasks = db.query(models.Task).filter(
                and_(models.Task.owner_id == user.id, models.Task.completed == True)
            ).all()
            for t in completed_tasks:
                tasks_map[t.id] = t

            samples = []
            for i in interactions:
                if i.event_type in ("task_completed", "task_created") and i.task_id:
                    task = tasks_map.get(i.task_id)
                    if not task:
                        continue
                    days = None
                    if task.due_date and task.created_at:
                        days = (task.due_date.replace(tzinfo=None) - task.created_at.replace(tzinfo=None)).days
                    samples.append({
                        "hour": i.hour_of_day or 12,
                        "dow": i.day_of_week or 0,
                        "priority": i.priority or 2,
                        "category": i.category or "other",
                        "days_until_due": days,
                        "reminders_sent": 0,
                        "completed": i.event_type == "task_completed",
                    })

            if len(samples) >= 5:
                learner = PatternLearner(user.nn_weights)
                learner.batch_update(samples, epochs=200)
                user.nn_weights = learner.to_json()
                user.nn_version = (user.nn_version or 0) + 1
                logger.info(f"Retrained model for {user.username} on {len(samples)} samples")

        db.commit()
    except Exception as e:
        logger.error(f"Retrain error: {e}")
    finally:
        db.close()


async def _loop_reminders():
    while True:
        await asyncio.sleep(30 * 60)  # every 30 minutes
        await run_reminder_engine()


async def _loop_retrain():
    await asyncio.sleep(60 * 60 * 6)  # first run after 6 hours
    while True:
        await retrain_models()
        await asyncio.sleep(60 * 60 * 6)


@app.on_event("startup")
async def startup():
    asyncio.create_task(_loop_reminders())
    asyncio.create_task(_loop_retrain())
    logger.info("Remindr API started. Reminder engine active.")


@app.on_event("shutdown")
async def shutdown():
    pass


@app.get("/")
def root():
    return {"name": "Remindr API", "status": "running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
