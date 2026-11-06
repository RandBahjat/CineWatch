@echo off
title CineWatch 4K Upload - The Dark Knight (2008)
color 0B
mode con: cols=110 lines=35
echo =========================================================================================
echo                CINEWATCH 4K UPLOAD MONITOR: THE DARK KNIGHT (2008)
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\the_dark_knight_2008_upload.log' -Wait -Tail 30"
pause

