# 🧠 Remindr — Your AI Friend That Never Lets You Forget

A full-stack PWA with a **per-user adaptive neural network** that learns your task habits and reminds you at the right time.

## Features

| Feature | Details |
|---|---|
| **AI Friend "Rem"** | Personalized chat companion that greets you, cheers completions, and nudges you about overdue tasks |
| **Adaptive Neural Network** | Custom MLP (13→32→16→1) trained exclusively on your behavior — different weights per user |
| **Pattern Learning** | Learns your peak hours, preferred categories, completion patterns via online + batch training |
| **Smart Reminders** | Runs every 30 min; sends reminders when completion probability is high OR deadline is near |
| **Cross-check** | Rem asks "did you finish X?" based on your historical pattern for that task type |
| **PWA Install** | Install to desktop/taskbar from Chrome or Edge (works offline) |
| **Push Notifications** | Real-time toast + browser notifications via WebSocket |
| **Analytics Dashboard** | Weekly/hourly patterns, category breakdown, neural network training status |

## Neural Network Architecture

```
Input (13 features):
  ├─ hour_sin, hour_cos       — cyclical time encoding
  ├─ dow_sin, dow_cos         — cyclical day-of-week encoding
  ├─ priority_norm            — task priority (normalized)
  ├─ cat_work..cat_other      — one-hot category (6 dims)
  ├─ days_until_due_norm      — urgency signal
  └─ reminders_sent_norm      — how many reminders given

Hidden Layer 1: 32 neurons (ReLU)
Hidden Layer 2: 16 neurons (ReLU)
Output: 1 neuron (Sigmoid) → completion probability
```

Each user has **separate weights** stored in the database. Training happens:
- **Online**: immediately after each task completion/deletion (30 epochs)
- **Batch**: every 6 hours, retrain on full interaction history (200 epochs)

## Quick Start

### 1. First-time setup
```bat
setup.bat
```

### 2. Launch (every time)
```bat
start.bat
```
Or double-click the **Remindr** shortcut on your desktop.

Then visit `http://localhost:3000` and click **Install** in Chrome/Edge address bar to add it as a desktop app.

## Manual Start

```bash
# Terminal 1 — Backend
cd backend
venv\Scripts\python -m uvicorn main:app --port 8000 --reload

# Terminal 2 — Frontend  
cd frontend
npm run dev
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Recharts + Vite (PWA)
- **Backend**: FastAPI (Python) + SQLAlchemy + SQLite
- **ML**: Custom numpy MLP with backpropagation — zero ML frameworks
- **Auth**: JWT (python-jose) + bcrypt
- **Realtime**: WebSocket for instant reminder delivery

## API Docs

Visit `http://localhost:8000/docs` for the full interactive API documentation.

## Project Structure

```
remindr/
├── backend/
│   ├── main.py              # FastAPI app + background scheduler
│   ├── models.py            # SQLAlchemy DB models
│   ├── auth.py              # JWT authentication
│   ├── routers/
│   │   ├── users.py         # Register/login endpoints
│   │   ├── tasks.py         # Task CRUD + insights
│   │   └── ai.py            # Chat, reminders, WebSocket
│   └── ml/
│       ├── neural_network.py  # Custom MLP from scratch
│       ├── pattern_learner.py # Per-user feature extraction + training
│       └── ai_friend.py       # Rem's personality + message generation
└── frontend/
    └── src/
        ├── pages/            # Dashboard, Tasks, Chat, Analytics
        ├── components/       # Layout, TaskCard, TaskForm
        └── hooks/            # WebSocket + notifications
```
