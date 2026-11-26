Write-Host "=========================================================================================" -ForegroundColor Cyan
Write-Host "            CINEWATCH 4K UPLOAD MONITOR: THE ODYSSEY (2026) IMAX 4K" -ForegroundColor Yellow
Write-Host "=========================================================================================" -ForegroundColor Cyan
Get-Content -Path "E:\the_odyssey_2026_upload.log" -Wait -Tail 30
