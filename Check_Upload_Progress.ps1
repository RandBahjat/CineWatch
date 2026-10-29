$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload Progress: Harry Potter 3"
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " LIVE RESUMABLE R2 UPLOAD STREAM (Harry Potter and the Prisoner of Azkaban 4K)" -ForegroundColor Green
Write-Host " Target Key: Harry_Potter_And_The_Prisoner_Of_Azkaban_2004_4K_UHD.mp4" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "E:\azkaban_upload.log"

if (Test-Path $logPath) {
    Get-Content -Path $logPath -Wait -Tail 20
} else {
    Write-Host "Waiting for upload log to start..." -ForegroundColor Yellow
    while (-not (Test-Path $logPath)) {
        Start-Sleep -Seconds 2
    }
    Get-Content -Path $logPath -Wait -Tail 20
}
