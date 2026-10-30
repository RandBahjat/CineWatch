$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload: The Amazing Spider-Man (2012)"
Clear-Host

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD STREAM: The Amazing Spider-Man (2012)" -ForegroundColor Green
Write-Host " Target Key: The_Amazing_Spider_Man_2012_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host " Total Size: 16.70 GB | Target: Cloudflare R2 cinewatch" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\spider_man_upload.log"

if (-not (Test-Path $logPath)) {
    Write-Host "Waiting for upload process to initialize log file..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Milliseconds 500
    }
}

Get-Content -Path $logPath -Wait -Tail 30

