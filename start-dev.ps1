# ELI5 AI Simplifier - Development Startup Script
# This script starts both the Python backend and Next.js frontend

Write-Host "🚀 Starting ELI5 AI Simplifier Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Please install Python 3.8+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install Python dependencies
Write-Host "Installing Python backend dependencies..." -ForegroundColor Cyan
Set-Location backend
if (!(Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt --quiet
Set-Location ..

# Install Node.js dependencies
Write-Host "Installing Node.js frontend dependencies..." -ForegroundColor Cyan
if (!(Test-Path "node_modules")) {
    npm install --silent
}

Write-Host ""
Write-Host "✅ All dependencies installed!" -ForegroundColor Green
Write-Host ""

# Check for .env file
if (!(Test-Path "backend\.env")) {
    Write-Host "⚠️  WARNING: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env and add your GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "Get your API key from: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

Write-Host "🎯 Starting servers..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will run on: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in background
Write-Host "Starting Python FastAPI backend..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    .\venv\Scripts\Activate.ps1
    python main.py
}

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting Next.js frontend..." -ForegroundColor Cyan
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Magenta
Write-Host "🎉 ELI5 AI Simplifier is running!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Magenta
Write-Host ""
Write-Host "Open your browser and visit: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

try {
    npm run dev
} finally {
    # Clean up background job when frontend stops
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob
    Remove-Job -Job $backendJob
    Write-Host "✅ All servers stopped" -ForegroundColor Green
}
