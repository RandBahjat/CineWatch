@echo off
title Cloudflare R2 4K Movie Upload Progress
color 0A

:loop
cls
node "scratch\check_progress.js"
timeout /t 3 /nobreak >nul
goto loop

