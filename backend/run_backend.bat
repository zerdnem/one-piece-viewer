@echo off
setlocal enabledelayedexpansion

echo.
echo ===============================================
echo      One Piece Viewer - Backend Server
echo ===============================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo [INFO] Virtual environment not found, creating...
    
    REM Try different Python commands
    python --version >nul 2>&1
    if !errorlevel! == 0 (
        set PYTHON_CMD=python
        goto :create_venv
    )
    
    py --version >nul 2>&1
    if !errorlevel! == 0 (
        set PYTHON_CMD=py
        goto :create_venv
    )
    
    REM Try Scoop Python installation
    if exist "%USERPROFILE%\scoop\apps\python\current\python.exe" (
        set PYTHON_CMD=%USERPROFILE%\scoop\apps\python\current\python.exe
        goto :create_venv
    )
    
    echo [ERROR] Python not found! Please install Python 3.8+
    echo.
    echo Options:
    echo   1. Install from python.org
    echo   2. Use Scoop: scoop install python
    pause
    exit /b 1
    
    :create_venv
    echo [INFO] Creating virtual environment with !PYTHON_CMD!...
    !PYTHON_CMD! -m venv venv
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
    echo [SUCCESS] Virtual environment created
)

REM Check if virtual environment is valid
if not exist "venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment is corrupted. Deleting and recreating...
    rmdir /s /q venv
    echo [INFO] Please run this script again
    pause
    exit /b 1
)

REM Install/update requirements if requirements.txt exists
if exist "requirements.txt" (
    echo [INFO] Installing/updating requirements...
    venv\Scripts\pip.exe install -r requirements.txt
    if !errorlevel! neq 0 (
        echo [WARNING] Some requirements may have failed to install
        pause
    ) else (
        echo [SUCCESS] Requirements installed successfully
    )
)

REM Check if Redis is available (optional)
echo.
echo [INFO] Checking for Redis (optional for caching)...
redis-cli --version >nul 2>&1
if !errorlevel! == 0 (
    echo [SUCCESS] Redis found - caching will be enabled
) else (
    echo [INFO] Redis not found - app will work without caching
    echo [INFO] To enable caching, install Redis:
    echo   - Windows: Download from GitHub or use WSL
    echo   - Or use: scoop install redis
)

REM Run the FastAPI backend
echo.
echo ===============================================
echo [INFO] Starting One Piece Viewer Backend API
echo ===============================================
echo.
echo [INFO] Backend will run on: http://localhost:8000
echo [INFO] API Documentation: http://localhost:8000/docs
echo [INFO] Press Ctrl+C to stop the server
echo.

venv\Scripts\python.exe main.py

if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Backend exited with error code !errorlevel!
    echo.
    echo Common issues:
    echo   - Port 8000 already in use
    echo   - Missing dependencies
    echo   - Python version too old (need 3.8+)
    echo.
    pause
)

