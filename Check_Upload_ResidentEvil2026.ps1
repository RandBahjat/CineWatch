$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload: Resident Evil (2026)"
Clear-Host
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD STREAM: Resident Evil (2026) 4K" -ForegroundColor Green
Write-Host " Target Key: Resident_Evil_2026_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host " Total Size: 9.01 GB | Target: Cloudflare R2 cinewatch" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\resident_evil_2026_upload.log"

if (-not (Test-Path $logPath)) {
    Write-Host "Waiting for upload log to initialize at $logPath..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Milliseconds 500
    }
}

Get-Content -Path $logPath -Wait -Tail 30

