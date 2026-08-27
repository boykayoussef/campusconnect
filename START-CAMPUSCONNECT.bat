@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo       CampusConnect - Local Starter
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install the Node.js LTS version from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "backend\.env" (
  echo ERROR: backend\.env was not found.
  echo Create backend\.env using backend\.env.example and add your private Supabase database password.
  pause
  exit /b 1
)

if not exist "backend\node_modules" (
  echo Installing backend dependencies...
  cd backend
  call npm install
  if errorlevel 1 goto :error
  cd ..
)

if not exist "mobile\node_modules" (
  echo Installing mobile dependencies...
  cd mobile
  call npm install
  if errorlevel 1 goto :error
  cd ..
)

echo.
echo Starting Express backend...
start "CampusConnect Backend" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 3 /nobreak >nul

echo Starting Expo mobile app...
start "CampusConnect Expo" cmd /k "cd /d "%~dp0mobile" && npx expo start"

echo.
echo Both services have been started.
echo Keep both terminal windows open.
echo Scan the Expo QR code with Expo Go, or press W in the Expo window for web when supported.
echo.
pause
exit /b 0

:error
echo.
echo Something went wrong while installing dependencies.
pause
exit /b 1
