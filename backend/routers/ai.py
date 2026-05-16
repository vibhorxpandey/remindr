from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from typing import List
from database import get_db
import models, schemas, auth
from ml import ai_friend

router = APIRouter(prefix="/ai", tags=["ai"])

# Active WebSocket connections: user_id → WebSocket
_connections: dict[int, WebSocket] = {}


async def notify_user(user_id: int, message: str):
    """Push a reminder message to connected user via WebSocket."""
    ws = _connections.get(user_id)
    if ws:
        try:
            await ws.send_json({"type": "reminder", "message": message})
        except Exception:
            _connections.pop(user_id, None)


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await websocket.accept()
    _connections[user_id] = websocket
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            await websocket.send_json({
                "type": "greeting",
                "message": ai_friend.greeting(user.username),
            })
        while True:
            await websocket.receive_text()  # Keep alive ping
    except WebSocketDisconnect:
        _connections.pop(user_id, None)


@router.get("/greeting")
def get_greeting(current_user: models.User = Depends(auth.get_current_user)):
    return {"message": ai_friend.greeting(current_user.username)}


@router.post("/chat", response_model=schemas.ChatMessageResponse)
def chat(
    msg: schemas.ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # Save user message
    user_msg = models.ChatMessage(
        user_id=current_user.id, role="user", content=msg.content
    )
    db.add(user_msg)

    # Count pending tasks
    pending = db.query(models.Task).filter(
        and_(models.Task.owner_id == current_user.id, models.Task.completed == False)
    ).count()

    # Build insight string
    insight = ""
    if current_user.most_productive_hour is not None:
        insight = f"you're most productive around {current_user.most_productive_hour}:00"

    # Generate response
    response_text = ai_friend.chat_response(
        name=current_user.username,
        user_message=msg.content,
        pending_count=pending,
        insight=insight,
        completion_rate=current_user.avg_completion_rate,
    )

    # Save assistant message
    assistant_msg = models.ChatMessage(
        user_id=current_user.id, role="assistant", content=response_text
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg


@router.get("/chat/history", response_model=List[schemas.ChatMessageResponse])
def chat_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.user_id == current_user.id)
        .order_by(models.ChatMessage.created_at.desc())
        .limit(limit)
        .all()[::-1]
    )


@router.get("/daily-summary")
def daily_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = db.query(models.Task).filter(
        and_(
            models.Task.owner_id == current_user.id,
            models.Task.completed == True,
            models.Task.completed_at >= today_start,
        )
    ).count()

    pending = db.query(models.Task).filter(
        and_(models.Task.owner_id == current_user.id, models.Task.completed == False)
    ).count()

    now = datetime.now()
    overdue = db.query(models.Task).filter(
        and_(
            models.Task.owner_id == current_user.id,
            models.Task.completed == False,
            models.Task.due_date < now,
        )
    ).count()

    message = ai_friend.daily_summary(
        name=current_user.username,
        completed_today=completed_today,
        pending_count=pending,
        overdue_count=overdue,
        completion_rate=current_user.avg_completion_rate,
    )
    return {"message": message, "completed_today": completed_today, "pending": pending, "overdue": overdue}


@router.get("/reminders/pending", response_model=List[schemas.ReminderResponse])
def pending_reminders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Reminder)
        .filter(
            and_(
                models.Reminder.user_id == current_user.id,
                models.Reminder.acknowledged == False,
            )
        )
        .order_by(models.Reminder.sent_at.desc())
        .all()
    )


@router.post("/reminders/{reminder_id}/ack")
def acknowledge_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    reminder = db.query(models.Reminder).filter(
        and_(models.Reminder.id == reminder_id, models.Reminder.user_id == current_user.id)
    ).first()
    if reminder:
        reminder.acknowledged = True
        reminder.acknowledged_at = datetime.now()

        # Log interaction
        interaction = models.Interaction(
            user_id=current_user.id, task_id=reminder.task_id,
            event_type="reminder_ack", hour_of_day=datetime.now().hour,
            day_of_week=datetime.now().weekday(),
        )
        db.add(interaction)
        db.commit()
    return {"ok": True}
