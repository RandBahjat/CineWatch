Write-Host "=========================================================================================" -ForegroundColor Cyan
Write-Host "                CINEWATCH 4K UPLOAD MONITOR: BATMAN BEGINS (2005)" -ForegroundColor Yellow
Write-Host "=========================================================================================" -ForegroundColor Cyan
Get-Content -Path "E:\batman_begins_2005_upload.log" -Wait -Tail 30
