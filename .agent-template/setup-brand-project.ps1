# Brand Website Agent Setup Script
# Run this script to set up the agent structure for a new brand website project
# Usage: .\setup-brand-project.ps1 -ProjectName "Brand Website"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

$templatePath = "c:\Users\User\Desktop\Projects\.agent-template"
$projectPath = "c:\Users\User\Desktop\Projects\$ProjectName"

Write-Host "Setting up agent structure for: $ProjectName" -ForegroundColor Cyan

# Create project directory if it doesn't exist
if (-not (Test-Path $projectPath)) {
    New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
    Write-Host "Created project directory" -ForegroundColor Green
}

# Create subdirectories
$dirs = @(".agent\workflows", "directives", "execution", ".tmp")
foreach ($dir in $dirs) {
    $fullPath = Join-Path $projectPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
}

# Copy skills from master template
Write-Host "Copying shared skills from master template..." -ForegroundColor Yellow
Copy-Item "$templatePath\.agent\workflows\*" -Destination "$projectPath\.agent\workflows" -Recurse -Force

# Copy .env.example
Copy-Item "$templatePath\.env.example" -Destination "$projectPath\.env.example" -Force

# Create brand-specific AGENTS.md that references master
$agentsContent = @"
# Agent Instructions - $ProjectName

> This project inherits from the master agent template at `..\.agent-template\AGENTS.md`

## Brand-Specific Configuration

This is the agent configuration for **$ProjectName**. 

### Inherited Architecture
- 3-Layer Architecture (Directive → Orchestration → Execution)
- Shared Skills (brand-extractor, brand-guidelines, frontend-design, skill-creator)
- Self-annealing error recovery

### Brand-Specific Customizations

Add brand-specific directives in `directives/` folder:
- Design preferences
- Color schemes
- Content requirements
- Deployment targets

### Directory Structure

``````
$ProjectName/
├── AGENTS.md              # This file
├── .agent/workflows/      # Inherited skills + brand-specific
├── directives/            # Brand-specific SOPs
├── execution/             # Brand-specific scripts
├── .tmp/                  # Temporary files
└── .env                   # API keys (copy from .env.example)
``````

---

*See master template for full architecture documentation.*
"@

Set-Content -Path "$projectPath\AGENTS.md" -Value $agentsContent -Force

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Copy .env.example to .env and add your API keys"
Write-Host "  2. Create brand-specific directives in directives/"
Write-Host "  3. Add execution scripts in execution/ as needed"
