# Stop any running development server
Write-Host "Stopping development server..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Backup the original file
Write-Host "Backing up original AIAnalysis.tsx..."
Copy-Item "src\pages\AIAnalysis.tsx" "src\pages\AIAnalysis_original.tsx" -Force

# Replace with the corrected version
Write-Host "Replacing with corrected version..."
Copy-Item "src\pages\AIAnalysis_backup.tsx" "src\pages\AIAnalysis.tsx" -Force

# Clean up backup file
Remove-Item "src\pages\AIAnalysis_backup.tsx" -Force

Write-Host "AIAnalysis.tsx has been fixed successfully!"
Write-Host "You can now restart the development server with 'npm run dev'"