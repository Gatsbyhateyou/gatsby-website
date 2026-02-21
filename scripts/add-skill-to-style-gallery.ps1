# Usage: .\scripts\add-skill-to-style-gallery.ps1 <skill-source>
# Example: .\scripts\add-skill-to-style-gallery.ps1 erichowens/some_claude_skills@vaporwave-glassomorphic-ui-designer
#
# 1. Runs "npx skills add <source> -y" (installs to project .skills or global)
# 2. Copies the installed skill into style-gallery-skills/<skill-name>
# 3. Removes the original installation so only the copy in style-gallery-skills remains.

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Source
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path $ProjectRoot)) { $ProjectRoot = Get-Location }
$TargetDir = Join-Path $ProjectRoot "style-gallery-skills"

# Extract skill name: "owner/repo@skillname" -> "skillname"; "owner/repo" -> "repo"
$SkillName = $Source
if ($Source -match '@(.+)$') {
    $SkillName = $Matches[1]
} else {
    $SkillName = ($Source -split '/')[-1]
}
$SkillName = $SkillName -replace '[^\w\-]', '-'

Write-Host "Adding skill: $Source"
Write-Host "Target folder name: $SkillName"
Write-Host ""

# Install (project scope so it goes to ./.skills/ when available)
Set-Location $ProjectRoot
& npx skills add $Source -y 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
    Write-Host "Install failed. You can still install manually: npx skills add $Source -y"
    exit $LASTEXITCODE
}

# Find installed skill: .skills or node_modules
$SourceDir = $null
$DotSkills = Join-Path $ProjectRoot ".skills"
$NodeModules = Join-Path $ProjectRoot "node_modules"

if (Test-Path $DotSkills) {
    $sk = Get-ChildItem -Path $DotSkills -Recurse -Filter "SKILL.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($sk) { $SourceDir = $sk.Directory.FullName }
}
if (-not $SourceDir -and (Test-Path $NodeModules)) {
    $sk = Get-ChildItem -Path $NodeModules -Recurse -Depth 4 -Filter "SKILL.md" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -like "*$SkillName*" -or $_.FullName -like "*$($Source.Replace('/','*').Replace('@','*'))*" } | Select-Object -First 1
    if ($sk) { $SourceDir = $sk.Directory.FullName }
}

$DestDir = Join-Path $TargetDir $SkillName
if (-not (Test-Path $TargetDir)) { New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null }

if ($SourceDir -and (Test-Path $SourceDir)) {
    if (Test-Path $DestDir) { Remove-Item -Recurse -Force $DestDir }
    Copy-Item -Path $SourceDir -Destination $DestDir -Recurse -Force
    Write-Host ""
    Write-Host "Copied to: style-gallery-skills\$SkillName"

    # Remove original installation so only the copy in style-gallery-skills remains
    & npx skills remove $SkillName -y 2>&1 | Out-Null
    if (Test-Path $SourceDir) {
        Remove-Item -Recurse -Force $SourceDir -ErrorAction SilentlyContinue
        Write-Host "Removed original skill from default install location."
    }
    Write-Host "Done. Only copy is in style-gallery-skills\$SkillName"
} else {
    Write-Host ""
    Write-Host "Skill was installed by 'npx skills add' but could not find its folder under .skills or node_modules."
    Write-Host "Check project root for .skills or run: npx skills list"
    Write-Host "You can manually copy the skill into: style-gallery-skills\$SkillName"
}
