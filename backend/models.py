from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Neural network weights stored as JSON
    nn_weights = Column(Text, nullable=True)
    nn_version = Column(Integer, default=0)

    # User pattern stats
    most_productive_hour = Column(Integer, nullable=True)
    preferred_categories = Column(Text, nullable=True)
    avg_completion_rate = Column(Float, default=0.0)
    total_tasks = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)

    tasks = relationship("Task", back_populates="owner")
    reminders = relationship("Reminder", back_populates="user")
    interactions = relationship("Interaction", back_populates="user")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, default="other")  # work, personal, health, finance, social, other
    priority = Column(Integer, default=2)  # 1=low, 2=medium, 3=high
    due_date = Column(DateTime(timezone=True), nullable=True)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    snoozed_until = Column(DateTime(timezone=True), nullable=True)

    # ML features
    predicted_completion_prob = Column(Float, nullable=True)
    reminders_sent = Column(Integer, default=0)
    last_reminded_at = Column(DateTime(timezone=True), nullable=True)

    owner = relationship("User", back_populates="tasks")
    reminders = relationship("Reminder", back_populates="task")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="reminders")
    task = relationship("Task", back_populates="reminders")


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    event_type = Column(String, nullable=False)  # task_created, task_completed, reminder_sent, reminder_ack, chat
    hour_of_day = Column(Integer)
    day_of_week = Column(Integer)
    category = Column(String, nullable=True)
    priority = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    extra = Column(Text, nullable=True)

    user = relationship("User", back_populates="interactions")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)  # user or assistant
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
