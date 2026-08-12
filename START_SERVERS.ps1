# Start Both Servers Script
# This script starts the API and Web servers in separate windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting SRM Bats Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend API Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\new-project\apps\api; Write-Host 'Backend API Server' -ForegroundColor Green; Write-Host 'Port: 3001' -ForegroundColor Gray; Write-Host ''; pnpm dev"

Write-Host "Waiting 3 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Web Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\new-project\apps\web; Write-Host 'Frontend Web Server' -ForegroundColor Green; Write-Host 'Port: 3000' -ForegroundColor Gray; Write-Host ''; pnpm dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Servers Starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 10-15 seconds for servers to fully start" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then test:" -ForegroundColor White
Write-Host "  1. Visit http://localhost:3000/register" -ForegroundColor Gray
Write-Host "  2. Create an account" -ForegroundColor Gray
Write-Host "  3. Login at http://localhost:3000/login" -ForegroundColor Gray
Write-Host "  4. Visit http://localhost:3000/profile" -ForegroundColor Gray
Write-Host ""
Write-Host "Login Credentials (from seed data):" -ForegroundColor White
Write-Host "  Admin: admin@srmbats.com / admin123" -ForegroundColor Gray
Write-Host "  Customer: customer@test.com / customer123" -ForegroundColor Gray
Write-Host ""
