$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload: Harry Potter and the Order of the Phoenix (2007)"
Clear-Host
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD STREAM: Harry Potter and the Order of the Phoenix (2007)" -ForegroundColor Green
Write-Host " Target Key: Harry_Potter_And_The_Order_Of_The_Phoenix_2007_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host " Total Size: 15.56 GB | Target: Cloudflare R2 cinewatch" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\harry_potter_5_upload.log"

if (-not (Test-Path $logPath)) {
    Write-Host "Waiting for upload log to initialize at $logPath..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Milliseconds 500
    }
}

Get-Content -Path $logPath -Wait -Tail 30
