Write-Host "=========================================================================================" -ForegroundColor Cyan
Write-Host "               CINEWATCH 4K UPLOAD MONITOR: THE DARK KNIGHT (2008)" -ForegroundColor Yellow
Write-Host "=========================================================================================" -ForegroundColor Cyan
Get-Content -Path "E:\the_dark_knight_2008_upload.log" -Wait -Tail 30
