@echo off
title CineWatch App - Localhost Server
cls
echo ====================================================
echo   CineWatch Standalone App Localhost Server
echo ====================================================
echo.
echo Starting CineWatch App on http://localhost:3500 ...
echo.
timeout /t 1 >nul
start "" "http://localhost:3500"
node serve-app.js
pause
