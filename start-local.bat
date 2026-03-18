@echo off
echo Starting LAMS Local Development Environment...

echo.
echo Starting Laravel Server...
start "Laravel Server" cmd /k "php artisan serve"

echo.
echo Starting Vite (CSS/JS Watcher)...
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo Starting Python Fingerprint API...
start "Python API" cmd /k "cd python-scanner && python index.py"

echo.
echo All services started!
echo.
echo Laravel App: http://localhost:8000
echo Python API: http://localhost:7000
echo.
echo Press any key to close this window...
pause > nul