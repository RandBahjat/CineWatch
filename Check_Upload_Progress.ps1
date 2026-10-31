$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload: The Amazing Spider-Man 2 (2014)"
Clear-Host

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD: The Amazing Spider-Man 2 (2014) 4K UHD" -ForegroundColor Green
Write-Host " Target Key: The_Amazing_Spider_Man_2_2014_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host " Total Size: 19.43 GB | Target: Cloudflare R2 cinewatch" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\spider_man_2_upload.log"

if (-not (Test-Path $logPath)) {
    Write-Host "Waiting for upload process to initialize log file..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Milliseconds 500
    }
}

Get-Content -Path $logPath -Wait -Tail 30
