$ErrorActionPreference = "Stop"

# Find the project file in the same folder as this script
$project = Get-ChildItem -Path $PSScriptRoot -Filter "*.csproj" |
    Select-Object -First 1

if (-not $project) {
    Write-Host "Error: No .csproj file found!" -ForegroundColor Red
    exit 1
}

Write-Host "Project found: $($project.Name)" -ForegroundColor Cyan

$packages = @(
    "Microsoft.EntityFrameworkCore.SqlServer",
    "Microsoft.EntityFrameworkCore.Tools",
    "Microsoft.Extensions.Configuration",
    "Microsoft.Extensions.Configuration.Json"
)

foreach ($package in $packages) {
    Write-Host "`nInstalling $package ..." -ForegroundColor Yellow

    dotnet add $project.FullName package $package

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install $package" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nRestoring packages..." -ForegroundColor Cyan

dotnet restore $project.FullName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Restore failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nAll packages installed successfully!" -ForegroundColor Green