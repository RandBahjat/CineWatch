$logPath = "C:\Users\Click IT\.gemini\antigravity-ide\brain\6cfee286-4395-4a60-863e-66a9d4afacd0\.system_generated\tasks\task-2765.log"
$filePath = "E:\Spider-Man_2_2004_1080p.mp4"
$host.UI.RawUI.WindowTitle = "Spider-Man 2 - Live Processing Dashboard"

while ($true) {
    Clear-Host
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "          CINEWATCH: SPIDER-MAN 2 LIVE PROCESSING MONITOR        " -ForegroundColor Yellow
    Write-Host "=================================================================" -ForegroundColor Cyan
    
    # Check 1080p output file size
    if (Test-Path $filePath) {
        $fileObj = Get-Item $filePath
        $sizeMB = [Math]::Round($fileObj.Length / 1MB, 2)
        $sizeGB = [Math]::Round($fileObj.Length / 1GB, 2)
        Write-Host "  Destination: $filePath" -ForegroundColor DarkGray
        Write-Host "  Output File: $sizeMB MB ($sizeGB GB generated so far)" -ForegroundColor Green
    }
    Write-Host "-----------------------------------------------------------------" -ForegroundColor DarkGray

    # Read log file safely with FileShare.ReadWrite
    if (Test-Path $logPath) {
        try {
            $stream = [System.IO.File]::Open($logPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
            $reader = New-Object System.IO.StreamReader($stream)
            $content = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()

            $lines = $content -split "`r?`n" | Where-Object { $_.Trim().Length -gt 0 }
            
            # Print last 12 lines
            $startIndex = [Math]::Max(0, $lines.Count - 12)
            Write-Host "  Recent Pipeline Activity:" -ForegroundColor White
            for ($i = $startIndex; $i -lt $lines.Count; $i++) {
                $line = $lines[$i]
                if ($line -match "STARTING|COMPLETED|UPLOAD|SUCCESS") {
                    Write-Host "    $line" -ForegroundColor Yellow
                } elseif ($line -match "frame=") {
                    Write-Host "    $line" -ForegroundColor Cyan
                } else {
                    Write-Host "    $line" -ForegroundColor Gray
                }
            }
        } catch {
            Write-Host "  [Syncing activity...]" -ForegroundColor DarkGray
        }
    }

    Write-Host "-----------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  Auto-refreshing every 2 seconds. Press Ctrl+C in this window to close." -ForegroundColor DarkGray
    Start-Sleep -Seconds 2
}
