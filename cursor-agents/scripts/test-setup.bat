@echo off
REM Cursor Agents - Initial Setup and Test Script for Windows

echo 🚀 Starting Cursor Agents setup and test...

REM Check Node.js version
echo 📋 Checking prerequisites...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the cursor-agents directory.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
where yarn >nul 2>&1
if %errorlevel% equ 0 (
    yarn install
) else (
    npm install
)

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create environment file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file and add your API keys:
    echo    - OPENAI_API_KEY
    echo    - ANTHROPIC_API_KEY
)

REM Type check
echo 🔍 Running TypeScript type check...
npm run type-check
if %errorlevel% neq 0 (
    echo ⚠️  TypeScript type check found issues, but continuing...
)

REM Build the application
echo 🏗️  Building application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed.
    exit /b 1
)

echo ✅ Build completed successfully

REM Create test project directory
echo 📁 Setting up test project...
if not exist "test-project" mkdir test-project
cd test-project

REM Create sample files for testing
echo // Sample JavaScript file for testing Cursor Agents > sample.js
echo function fibonacci(n) { >> sample.js
echo     if (n ^<= 1) return n; >> sample.js
echo     return fibonacci(n - 1) + fibonacci(n - 2); >> sample.js
echo } >> sample.js
echo. >> sample.js
echo console.log("Fibonacci of 10:", fibonacci(10)); >> sample.js

echo # Sample Python file for testing Cursor Agents > sample.py
echo def factorial(n): >> sample.py
echo     if n ^<= 1: >> sample.py
echo         return 1 >> sample.py
echo     return n * factorial(n - 1) >> sample.py
echo. >> sample.py
echo print("Factorial of 5:", factorial(5)) >> sample.py

echo # Test Project for Cursor Agents > README.md
echo. >> README.md
echo This is a test project to demonstrate the capabilities of Cursor Agents. >> README.md

echo { > package.json
echo   "name": "cursor-agents-test-project", >> package.json
echo   "version": "1.0.0", >> package.json
echo   "description": "Test project for Cursor Agents", >> package.json
echo   "main": "sample.js", >> package.json
echo   "scripts": { >> package.json
echo     "start": "node sample.js" >> package.json
echo   }, >> package.json
echo   "license": "MIT" >> package.json
echo } >> package.json

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 🚀 To start Cursor Agents:
echo    npm run start
echo.
echo 🧪 To run in development mode:
echo    npm run dev
echo.
echo 📁 Test project created at: ./test-project
echo.
echo 💡 Next steps:
echo    1. Edit .env file with your API keys
echo    2. Start the application
echo    3. Open the test-project folder
echo    4. Try the AI assistant features
echo.
echo ✨ Happy coding with Cursor Agents!

pause