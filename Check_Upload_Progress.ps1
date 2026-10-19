$host.UI.RawUI.WindowTitle = "Cloudflare R2 4K Movie Upload Progress"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " LIVE CLOUDFLARE R2 UPLOAD STREAM (Amazing Spider-Man 2)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$logPath = "C:\Users\Click IT\.gemini\antigravity-ide\brain\e5a602bb-7a06-49b6-a986-392cf1ae8e7c\.system_generated\tasks\task-5964.log"

if (Test-Path $logPath) {
    Get-Content -Path $logPath -Wait -Tail 20
} else {
    Write-Host "Log file not found at: $logPath" -ForegroundColor Red
    pause
}
