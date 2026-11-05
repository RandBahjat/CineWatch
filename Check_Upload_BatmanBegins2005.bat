@echo off
title CineWatch 4K Upload - Batman Begins (2005)
color 0B
mode con: cols=110 lines=35
echo =========================================================================================
echo                 CINEWATCH 4K UPLOAD MONITOR: BATMAN BEGINS (2005)
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\batman_begins_2005_upload.log' -Wait -Tail 30"
pause
