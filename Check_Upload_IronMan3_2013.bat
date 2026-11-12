@echo off
title CineWatch 4K Upload - Iron Man 3 (2013)
color 0c
echo =========================================================================================
echo                   CINEWATCH 4K UPLOAD MONITOR: IRON MAN 3 (2013)
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\iron_man_3_2013_upload.log' -Wait -Tail 30"
pause

