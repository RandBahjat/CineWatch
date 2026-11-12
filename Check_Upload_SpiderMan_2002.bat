@echo off
title CineWatch 4K Upload - Spider-Man (2002)
color 0c
echo =========================================================================================
echo                   CINEWATCH 4K UPLOAD MONITOR: SPIDER-MAN (2002)
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\spider_man_2002_upload.log' -Wait -Tail 30"
pause

