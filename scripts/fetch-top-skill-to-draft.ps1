# Usage: .\scripts\fetch-top-skill-to-draft.ps1 <keyword>
# Example: .\scripts\fetch-top-skill-to-draft.ps1 glassmorphism
#
# 1. Runs "npx skills find <keyword>" and parses output
# 2. Picks the skill with the highest install count
# 3. Runs "npx skills add <source> -y"
# 4. Copies installed skill to style-gallery-draft/<keyword>/ and removes original

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Keyword
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path $ProjectRoot)) { $ProjectRoot = Get-Location }
$DraftDir = Join-Path $ProjectRoot "style-gallery-draft"
$DotSkills = Join-Path $ProjectRoot ".skills"
$NodeModules = Join-Path $ProjectRoot "node_modules"

# Sanitize keyword for folder name
$DraftSubdir = $Keyword -replace '[^\w\s\-]', '' -replace '\s+', '-'
$TargetDir = Join-Path $DraftDir $DraftSubdir

Write-Host "Searching for: $Keyword"
Write-Host ""

# Run find and capture output (strip ANSI codes for parsing)
Set-Location $ProjectRoot
$raw = & npx skills find $Keyword 2>&1 | Out-String
$lines = $raw -split "`n"

# Parse: strip ANSI then find "owner/repo@skill" or "owner/repo" and "N installs" or "N.NK installs"
$results = @()
foreach ($line in $lines) {
    $clean = $line -replace '\x1b\[[0-9;]*[a-zA-Z]?', '' -replace '\[[0-9;]+m', ''
    if ($clean -match '([a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+(?:@[a-zA-Z0-9_.-]+)?)\s+(\d+(?:\.\d+)?)\s*([KkMm])?\s*installs?') {
        $source = $Matches[1].Trim()
        $num = [double]$Matches[2]
        $unit = if ($Matches[3]) { $Matches[3] } else { '' }
        if ($unit -eq 'K' -or $unit -eq 'k') { $num = $num * 1000 }
        elseif ($unit -eq 'M' -or $unit -eq 'm') { $num = $num * 1000000 }
        $results += [PSCustomObject]@{ Source = $source; Installs = $num }
    }
}

if ($results.Count -eq 0) {
    Write-Host "No skills found for '$Keyword'. Try another English keyword."
    exit 1
}

$top = $results | Sort-Object -Property Installs -Descending | Select-Object -First 1
$Source = $top.Source
Write-Host "Top result ($([int]$top.Installs) installs): $Source"
Write-Host ""

# Install
& npx skills add $Source -y 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
    Write-Host "Install failed."
    exit $LASTEXITCODE
}

# Find installed skill folder (.agents/skills, .skills, or node_modules)
$SkillName = if ($Source -match '@(.+)$') { $Matches[1] } else { ($Source -split '/')[-1] }
$SourceDir = $null
$AgentsSkills = Join-Path $ProjectRoot ".agents\skills"

if (Test-Path (Join-Path $AgentsSkills $SkillName)) {
    $SourceDir = Join-Path $AgentsSkills $SkillName
}
if (-not $SourceDir -and (Test-Path $DotSkills)) {
    $sk = Get-ChildItem -Path $DotSkills -Recurse -Filter "SKILL.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($sk) { $SourceDir = $sk.Directory.FullName }
}
if (-not $SourceDir -and (Test-Path $NodeModules)) {
    $sk = Get-ChildItem -Path $NodeModules -Recurse -Depth 5 -Filter "SKILL.md" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -like "*$SkillName*" } | Select-Object -First 1
    if ($sk) { $SourceDir = $sk.Directory.FullName }
}

if (-not (Test-Path $DraftDir)) { New-Item -ItemType Directory -Path $DraftDir -Force | Out-Null }
if (Test-Path $TargetDir) { Remove-Item -Recurse -Force $TargetDir }

if ($SourceDir -and (Test-Path $SourceDir)) {
    Copy-Item -Path $SourceDir -Destination $TargetDir -Recurse -Force
    Write-Host ""
    Write-Host "Copied to draft: style-gallery-draft\$DraftSubdir"

    # Remove original
    & npx skills remove $SkillName -y 2>&1 | Out-Null
    if (Test-Path $SourceDir) { Remove-Item -Recurse -Force $SourceDir -ErrorAction SilentlyContinue }
    Write-Host "Removed original from default location."
    Write-Host ""
    Write-Host "Done. Tell the agent to read style-gallery-draft and convert to style-gallery-skills."
} else {
    Write-Host "Installed but could not find skill folder. Check .skills or node_modules. Run: npx skills list"
    exit 1
}
