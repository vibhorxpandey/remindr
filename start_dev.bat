@echo off
echo Starting Remindr in development mode...
echo.

:: Backend
start "Remindr-Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload && pause"

timeout /t 2 /nobreak >nul

:: Frontend (dev with HMR)
start "Remindr-Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev && pause"

timeout /t 3 /nobreak >nul
start http://localhost:3000

echo Remindr dev servers started!
echo   App:  http://localhost:3000
echo   API:  http://localhost:8000/docs
