@echo off
title CineWatch Auto-Sync & Cache Service
cls
echo ==========================================================
echo   CineWatch Live Auto-Sync ^& Cache Busting Service
echo ==========================================================
echo.
echo  - Watches both root and cinewatch-app folders
echo  - Automatically syncs edits across both folders
echo  - Bumps browser cache version (?v=...) on every save
echo  - Pushes live updates directly to GitHub
echo.
echo Press Ctrl+C anytime to stop.
echo ==========================================================
echo.
node auto_sync.js
pause
