@echo off
title Disable PowerShell Startup Task
:: Elevate with UAC if not already running as administrator
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo Requesting Administrator privileges to disable the startup task...
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

echo ========================================================
echo Disabling 'cua-driver-serve' scheduled task...
echo ========================================================

schtasks /Change /TN "cua-driver-serve" /DISABLE

if %errorLevel% EQU 0 (
    echo.
    echo [SUCCESS] 'cua-driver-serve' has been disabled!
    echo PowerShell will NO LONGER open when your laptop starts up.
    echo.
    echo Stopping running cua-driver process...
    taskkill /F /IM cua-driver.exe >nul 2>&1
) else (
    echo.
    echo [ERROR] Failed to disable task.
)

echo.
pause
