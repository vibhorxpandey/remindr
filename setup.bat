@echo off
echo ============================================================
echo   REMINDR - Setup
echo   Your AI Friend That Never Lets You Forget
echo ============================================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

:: Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Generating PWA icons...
python generate_icons.py
if errorlevel 1 (
    echo [WARN] Icon generation failed, using defaults.
)

echo.
echo [2/5] Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install --pre -r requirements.txt --quiet
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b 1
)
deactivate
cd ..

echo.
echo [3/5] Installing frontend dependencies...
cd frontend
call npm install --silent
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b 1
)
cd ..

echo.
echo [4/5] Building frontend for production...
cd frontend
call npm run build --silent
cd ..

echo.
echo [5/5] Creating desktop shortcut...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%USERPROFILE%\Desktop\Remindr.lnk'); $s.TargetPath = '%~dp0start.bat'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = '%~dp0frontend\public\icons\icon-192.png'; $s.Description = 'Remindr - Your AI Friend'; $s.Save()"

echo.
echo ============================================================
echo   Setup complete!
echo   Run start.bat (or double-click the desktop shortcut)
echo   to launch Remindr.
echo ============================================================
pause
