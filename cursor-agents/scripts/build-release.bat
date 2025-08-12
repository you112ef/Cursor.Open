@echo off
rem Cursor Agents - Windows Build and Distribution Script

echo Starting Cursor Agents build process...

rem Check if Node.js is installed
node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

rem Get Node.js version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

rem Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

rem Run type check
echo Running type check...
call npm run type-check
if %ERRORLEVEL% NEQ 0 (
    echo Error: Type check failed
    pause
    exit /b 1
)

rem Build the application
echo Building application...
call npm run build:main
if %ERRORLEVEL% NEQ 0 (
    echo Error: Main process build failed
    pause
    exit /b 1
)

call npm run build:renderer
if %ERRORLEVEL% NEQ 0 (
    echo Error: Renderer process build failed
    pause
    exit /b 1
)

rem Package for distribution
echo Packaging for Windows...
if "%1"=="--all" (
    call npm run dist
) else (
    call npm run dist:win
)

if %ERRORLEVEL% NEQ 0 (
    echo Error: Packaging failed
    pause
    exit /b 1
)

echo Build process completed successfully!
echo Check the 'release' directory for the built packages.

rem List generated files
if exist "release" (
    echo Generated files:
    dir release
)

pause