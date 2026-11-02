$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload: Harry Potter and the Half-Blood Prince (2009)"
Clear-Host
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD STREAM: Harry Potter and the Half-Blood Prince (2009)" -ForegroundColor Green
Write-Host " Target Key: Harry_Potter_And_The_Half_Blood_Prince_2009_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host " Total Size: 18.53 GB | Target: Cloudflare R2 cinewatch" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\harry_potter_6_upload.log"

if (-not (Test-Path $logPath)) {
    Write-Host "Waiting for upload log to initialize at $logPath..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Milliseconds 500
    }
}

Get-Content -Path $logPath -Wait -Tail 30
