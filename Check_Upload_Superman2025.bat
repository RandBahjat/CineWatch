@echo off
title CineWatch 4K Upload - Superman (2025)
color 0B
mode con: cols=110 lines=35
echo =========================================================================================
echo                    CINEWATCH 4K UPLOAD MONITOR: SUPERMAN (2025) IMAX
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\superman_2025_upload.log' -Wait -Tail 30"
pause
