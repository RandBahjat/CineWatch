$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload Progress: Spider-Man 3"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " LIVE CLOUDFLARE R2 UPLOAD STREAM (Spider-Man 3 4K UHD)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\spiderman3_upload.log"

if (Test-Path $logPath) {
    Get-Content -Path $logPath -Wait -Tail 30
} else {
    Write-Host "Waiting for upload log to start..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Seconds 2
    }
    Get-Content -Path $logPath -Wait -Tail 30
}
