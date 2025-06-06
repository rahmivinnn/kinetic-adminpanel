# PowerShell script to fix the Notifications.tsx file

# Stop the development server if it's running
Write-Host "Stopping any running development servers..."
$processesToKill = @("node", "npm")
foreach ($process in $processesToKill) {
    Get-Process -Name $process -ErrorAction SilentlyContinue | Stop-Process -Force
}

# Backup the original file (if not already backed up)
$originalFile = "src\pages\Notifications.tsx"
$backupFile = "src\pages\Notifications.original.tsx"

if (-not (Test-Path $backupFile)) {
    Write-Host "Backing up original file..."
    Copy-Item $originalFile $backupFile
}

# Replace the problematic file with the fixed version
Write-Host "Replacing with fixed version..."
Copy-Item "src\pages\Notifications_backup.tsx" $originalFile

Write-Host "Fix applied successfully!"
Write-Host "You can now restart the development server with 'npm run dev'"