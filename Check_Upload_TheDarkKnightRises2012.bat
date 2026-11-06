@echo off
title CineWatch 4K Upload - The Dark Knight Rises (2012)
color 0b
echo =========================================================================================
echo             CINEWATCH 4K UPLOAD MONITOR: THE DARK KNIGHT RISES (2012)
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\the_dark_knight_rises_2012_upload.log' -Wait -Tail 30"
pause

