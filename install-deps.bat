@echo off
echo Installing dependencies for user-service...
cd /d f:\micro-services\micro-services-practice\user-service
call npm install
if %errorlevel% neq 0 (
    echo Failed to install user-service dependencies
    pause
    exit /b 1
)

echo.
echo Installing dependencies for job-service...
cd /d f:\micro-services\micro-services-practice\job-service
call npm install
if %errorlevel% neq 0 (
    echo Failed to install job-service dependencies
    pause
    exit /b 1
)

echo.
echo All dependencies installed successfully!
echo You can now run: npm run dev (from the root directory)
pause
