@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo Node.js and npm are required but npm was not found.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Project dependencies are missing. Run npm install first.
  pause
  exit /b 1
)

set "HYPERVERSE_LAN_ONLY=1"
echo Starting Hyperverse TCG on port 4173...
echo Access is restricted to this computer and private local-network IP addresses.
echo Use one of the Network URLs printed below on another local device.
echo.

call npm run dev
set "LAUNCH_EXIT_CODE=%ERRORLEVEL%"
endlocal & exit /b %LAUNCH_EXIT_CODE%
