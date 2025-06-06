# Stop any running development server
Write-Host "Stopping development server..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force

# Backup original file
Write-Host "Backing up original Exercises.tsx..." -ForegroundColor Yellow
Copy-Item "src\pages\Exercises.tsx" "src\pages\Exercises_original_backup.tsx" -Force

# Replace with corrected version
Write-Host "Replacing with corrected version..." -ForegroundColor Green
Copy-Item "src\pages\Exercises_backup.tsx" "src\pages\Exercises.tsx" -Force

# Clean up backup file
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item "src\pages\Exercises_backup.tsx" -Force

Write-Host "Exercises.tsx has been fixed! You can now restart the development server." -ForegroundColor Green