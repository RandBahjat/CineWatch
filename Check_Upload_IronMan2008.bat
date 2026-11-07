@echo off
title CineWatch 4K Upload - Iron Man (2008)
color 0c
echo =========================================================================================
echo                   CINEWATCH 4K UPLOAD MONITOR: IRON MAN (2008)
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\iron_man_2008_upload.log' -Wait -Tail 30"
pause

