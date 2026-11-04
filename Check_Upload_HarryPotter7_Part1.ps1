$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload: Harry Potter and the Deathly Hallows - Part 1 (2010)"
Clear-Host
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD STREAM: Harry Potter & Deathly Hallows Part 1" -ForegroundColor Green
Write-Host " Target Key: Harry_Potter_And_The_Deathly_Hallows_Part_1_2010_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host " Total Size: 16.79 GB | Target: Cloudflare R2 cinewatch" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\harry_potter_7_part1_upload.log"

if (-not (Test-Path $logPath)) {
    Write-Host "Waiting for upload log to initialize at $logPath..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Milliseconds 500
    }
}

Get-Content -Path $logPath -Wait -Tail 30

