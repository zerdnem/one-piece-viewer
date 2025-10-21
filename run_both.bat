@echo off
setlocal

echo.
echo ===============================================
echo   One Piece Viewer - Full Application Launcher
echo ===============================================
echo.
echo This will start both:
echo   1. Backend API (FastAPI)
echo   2. Frontend UI (React + Vite)
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

REM Start Backend in new window
echo [INFO] Starting Backend Server...
start "One Piece Viewer - Backend" cmd /k "cd /d "%~dp0backend" && run_backend.bat"

REM Wait a few seconds for backend to start
echo [INFO] Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start Frontend in new window
echo [INFO] Starting Frontend...
start "One Piece Viewer - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===============================================
echo [SUCCESS] Application Starting!
echo ===============================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Two new windows have opened:
echo   - Backend Server (FastAPI)
echo   - Frontend Server (Vite)
echo.
echo Close those windows to stop the servers.
echo.
echo Opening frontend in browser in 8 seconds...
timeout /t 8 /nobreak >nul

REM Open browser
start http://localhost:5173

echo.
echo [INFO] Application is running!
echo [INFO] Press any key to exit this window (servers will keep running)
pause >nul

