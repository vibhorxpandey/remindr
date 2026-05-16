@echo off
echo ============================================================
echo   REMINDR - Starting...
echo ============================================================
echo.

:: Start backend in background
echo [Backend] Starting FastAPI server on http://localhost:8000
start "Remindr-Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: Wait for backend to be ready
echo [Backend] Waiting for API to be ready...
timeout /t 3 /nobreak >nul

:: Start frontend dev server
echo [Frontend] Starting React app on http://localhost:5000
start "Remindr-Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Wait then open browser
echo [Browser] Opening Remindr in browser...
timeout /t 4 /nobreak >nul
start http://localhost:5000

echo.
echo ============================================================
echo   Remindr is running!
echo   - App:  http://localhost:5000
echo   - API:  http://localhost:8000
echo   - Docs: http://localhost:8000/docs
echo.
echo   To INSTALL as desktop app:
echo   In Chrome/Edge, click the install icon in the address bar.
echo   Remindr will appear in your Start Menu and taskbar!
echo ============================================================
echo.
echo Press any key to stop all servers...
pause >nul

:: Kill servers
taskkill /f /fi "WindowTitle eq Remindr-Backend*" >nul 2>&1
taskkill /f /fi "WindowTitle eq Remindr-Frontend*" >nul 2>&1
echo Remindr stopped.
