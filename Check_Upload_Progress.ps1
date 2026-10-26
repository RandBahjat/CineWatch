$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload Progress: Spider-Man: Far From Home"
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD STREAM (Spider-Man: Far From Home 4K)" -ForegroundColor Green
Write-Host " Target Key: Spider-Man_Far_From_Home_2019_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\far_from_home_upload.log"

if (Test-Path $logPath) {
    Get-Content -Path $logPath -Wait -Tail 20
} else {
    Write-Host "Waiting for upload log to start..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Seconds 2
    }
    Get-Content -Path $logPath -Wait -Tail 20
}
