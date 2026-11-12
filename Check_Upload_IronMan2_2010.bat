@echo off
title CineWatch 4K Upload - Iron Man 2 (2010)
color 0c
echo =========================================================================================
echo                   CINEWATCH 4K UPLOAD MONITOR: IRON MAN 2 (2010)
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\iron_man_2_2010_upload.log' -Wait -Tail 30"
pause

