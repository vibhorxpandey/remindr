from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    avg_completion_rate: float
    total_tasks: int
    completed_tasks: int
    most_productive_hour: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "other"
    priority: int = 2
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[int] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None
    snoozed_until: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    priority: int
    due_date: Optional[datetime]
    completed: bool
    completed_at: Optional[datetime]
    created_at: datetime
    reminders_sent: int
    predicted_completion_prob: Optional[float]
    snoozed_until: Optional[datetime]

    class Config:
        from_attributes = True


class ReminderResponse(BaseModel):
    id: int
    task_id: int
    message: str
    sent_at: datetime
    acknowledged: bool

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    content: str


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class PatternInsight(BaseModel):
    most_productive_hour: Optional[int]
    best_category: Optional[str]
    completion_rate: float
    total_tasks: int
    completed_tasks: int
    weekly_pattern: List[float]
    hourly_pattern: List[float]
    category_stats: dict
