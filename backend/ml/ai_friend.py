"""
Rem — the AI friend that learns your patterns and reminds you in a personalized way.
Rule-based response generation with pattern-aware context.
"""
import random
from datetime import datetime, timedelta
from typing import Optional, List


GREETINGS_MORNING = [
    "Good morning, {name}! ☀️ Ready to crush your day?",
    "Morning, {name}! I've been looking at your tasks — let's make today count!",
    "Rise and shine, {name}! 🌅 I have a few things I want to remind you about.",
    "Hey {name}, good morning! What are we tackling first today?",
]

GREETINGS_AFTERNOON = [
    "Hey {name}! How's the afternoon treating you?",
    "Afternoon check-in, {name}! Making progress? 💪",
    "Hi {name}! Just popping by to see how things are going.",
    "Hey {name}! It's me, Rem — just checking in on you! 😊",
]

GREETINGS_EVENING = [
    "Evening, {name}! 🌙 How did your day go?",
    "Hey {name}, wrapping up the day? Let's see what's still pending.",
    "Good evening, {name}! Almost time to wind down — but first, let's check your tasks.",
    "Hi {name}! Rem here — how much did you get done today?",
]

REMINDER_TEMPLATES = [
    "Hey {name}, just a friendly nudge — '{task}' is still waiting for you! 🎯",
    "Psst! Don't forget about '{task}', {name}! You've got this! 💪",
    "{name}, I noticed '{task}' hasn't been ticked off yet. Need a hand thinking through it?",
    "Quick reminder, {name}: '{task}' is on your list! 📌",
    "Hey! '{task}' is still pending, {name}. Based on your patterns, now seems like a great time! ⏰",
]

URGENT_REMINDERS = [
    "🚨 {name}, '{task}' is due soon! Time to make it happen!",
    "Hey {name} — '{task}' deadline is approaching fast! Don't let this one slip by!",
    "IMPORTANT: '{task}' needs your attention, {name}. You can do it! 🔥",
]

COMPLETION_REACTIONS = [
    "🎉 Yes!! You completed '{task}'! I knew you'd get it done, {name}!",
    "Boom! '{task}' is done! You're on a roll, {name}! ⭐",
    "Amazing work, {name}! '{task}' → ✅. Proud of you!",
    "That's what I'm talking about, {name}! '{task}' done! Keep going! 🚀",
    "High five! '{task}' is officially crushed, {name}! 🙌",
]

INSIGHT_TEMPLATES = [
    "I've noticed you're most productive around {hour}:00. I'll schedule important reminders then! 🧠",
    "Fun fact, {name}: you complete {category} tasks really consistently. You're a natural at it!",
    "Your completion rate this week: {rate}%! {'Great job!' if rate >= 70 else 'Let\\'s push for more!'}",
    "You've completed {count} tasks total — that's fantastic progress, {name}! 🏆",
]

CHECKIN_QUESTIONS = [
    "Hey {name}, did you manage to finish '{task}' yet?",
    "Quick check: '{task}' — done yet? Just let me know! ✅",
    "{name}, just circling back on '{task}'. Any updates?",
    "How's '{task}' coming along, {name}? Almost done?",
]

ENCOURAGE_PENDING = [
    "You have {count} task(s) pending, {name}. One at a time — you've got this!",
    "I see {count} things still on your list, {name}. Which one feels most doable right now?",
    "Hey {name}, {count} task(s) are waiting for you. Want to tackle the easiest one first?",
]

CHAT_RESPONSES = {
    "hello": ["Hey {name}! Great to hear from you! 😊", "Hi there, {name}! What's up?", "Hello, {name}! How can I help?"],
    "how are you": ["I'm doing great, thanks for asking {name}! I'm here tracking your goals! 🎯", "Fantastic, {name}! I'm always happy when you check in!"],
    "thanks": ["Anytime, {name}! That's what I'm here for! 💙", "Of course! I've got your back, {name}! 🙌", "My pleasure, {name}! Always here for you!"],
    "help": ["Sure! I can remind you about tasks, track your patterns, and cheer you on. Just add a task and I'll do the rest! 🎯"],
    "pattern": ["Based on your data, {insight}. Pretty cool, right?"],
    "busy": ["No worries, {name}! I'll keep things organized while you focus. I'll remind you at the right time! ⏰"],
    "forgot": ["Hey, that's exactly why I'm here, {name}! Let me check what's pending for you... 🔍"],
    "tired": ["Take a breather, {name}! You deserve it. I'll keep watch over your tasks. 💤", "Rest is important too, {name}! I'll remind you later when you're refreshed. 🌟"],
    "done": ["Awesome, {name}! Mark it complete in your task list and I'll celebrate with you! 🎉"],
    "stress": ["Hey, breathe, {name}. Let's break it down — one task at a time. Which one feels most urgent? 💙"],
    "default": [
        "I'm listening, {name}! 👂 Tell me more, or check your tasks and I'll help you prioritize.",
        "Got it, {name}! Is there a specific task you need help with?",
        "Interesting, {name}! By the way, you have {pending} task(s) pending — want to knock one out?",
    ],
}


def _pick(templates: list, **kwargs) -> str:
    template = random.choice(templates)
    try:
        return template.format(**kwargs)
    except KeyError:
        return template


def greeting(name: str) -> str:
    hour = datetime.now().hour
    if 5 <= hour < 12:
        return _pick(GREETINGS_MORNING, name=name)
    elif 12 <= hour < 18:
        return _pick(GREETINGS_AFTERNOON, name=name)
    else:
        return _pick(GREETINGS_EVENING, name=name)


def reminder_message(name: str, task_title: str, days_until_due: Optional[float] = None) -> str:
    if days_until_due is not None and days_until_due <= 1:
        return _pick(URGENT_REMINDERS, name=name, task=task_title)
    return _pick(REMINDER_TEMPLATES, name=name, task=task_title)


def completion_message(name: str, task_title: str) -> str:
    return _pick(COMPLETION_REACTIONS, name=name, task=task_title)


def checkin_message(name: str, task_title: str) -> str:
    return _pick(CHECKIN_QUESTIONS, name=name, task=task_title)


def pending_summary(name: str, count: int) -> str:
    return _pick(ENCOURAGE_PENDING, name=name, count=count)


def insight_message(name: str, most_productive_hour: Optional[int] = None,
                    best_category: Optional[str] = None, completion_rate: float = 0) -> str:
    if most_productive_hour is not None:
        return f"I've noticed you tend to be most productive around {most_productive_hour}:00, {name}! I'll schedule important reminders then. 🧠"
    if best_category:
        return f"You're great at completing {best_category} tasks, {name}! Your consistency there is impressive. 💪"
    rate_pct = int(completion_rate * 100)
    emoji = "🔥" if rate_pct >= 70 else "💪"
    closing = "Amazing!" if rate_pct >= 70 else "Let's push for more!"
    return f"Your overall completion rate is {rate_pct}%, {name}! {emoji} {closing}"


def chat_response(name: str, user_message: str, pending_count: int = 0,
                  insight: str = "", completion_rate: float = 0) -> str:
    msg_lower = user_message.lower()

    for keyword, responses in CHAT_RESPONSES.items():
        if keyword == "default":
            continue
        if keyword in msg_lower:
            resp = _pick(responses, name=name, insight=insight or "you're doing well!")
            return resp

    # Default response
    return _pick(CHAT_RESPONSES["default"], name=name, pending=pending_count)


def daily_summary(name: str, completed_today: int, pending_count: int,
                  overdue_count: int, completion_rate: float) -> str:
    rate_pct = int(completion_rate * 100)
    parts = [f"Hey {name}! Here's your daily summary: "]
    if completed_today > 0:
        parts.append(f"✅ {completed_today} task(s) completed today — well done!")
    if pending_count > 0:
        parts.append(f"📋 {pending_count} task(s) still pending.")
    if overdue_count > 0:
        parts.append(f"⚠️ {overdue_count} task(s) are overdue — let's get to them!")
    parts.append(f"Your completion rate: {rate_pct}%. {'Keep it up! 🚀' if rate_pct >= 60 else 'We can do better together! 💪'}")
    return " ".join(parts)
