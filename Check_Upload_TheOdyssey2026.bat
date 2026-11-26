@echo off
title CineWatch 4K Upload - The Odyssey (2026)
color 0e
echo =========================================================================================
echo             CINEWATCH 4K UPLOAD MONITOR: THE ODYSSEY (2026) IMAX 4K
echo =========================================================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path 'E:\the_odyssey_2026_upload.log' -Wait -Tail 30"
pause
