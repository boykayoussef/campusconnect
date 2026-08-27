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

rem Detect the computer's LAN IPv4 address so a physical phone can reach Express.
set "LAN_IP="
for /f "delims=" %%I in ('powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' -and $_.PrefixOrigin -ne 'WellKnown'} | Select-Object -First 1 -ExpandProperty IPAddress"') do set "LAN_IP=%%I"
if not defined LAN_IP set "LAN_IP=127.0.0.1"
>"mobile\.env" echo EXPO_PUBLIC_API_URL=http://%LAN_IP%:5000/api

echo.
echo Using mobile API URL: http://%LAN_IP%:5000/api
echo Starting Express backend...
start "CampusConnect Backend" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 3 /nobreak >nul

echo Starting Expo mobile app...
start "CampusConnect Expo" cmd /k "cd /d "%~dp0mobile" && npx expo start -c"
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
