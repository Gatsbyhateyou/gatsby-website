# 用 git mv 两步改名，让 GitHub 上的扩展名变成小写 .jpg
# 必须在项目根目录执行: powershell -ExecutionPolicy Bypass -File scripts/rename-photo-to-lowercase.ps1

$root = Join-Path $PSScriptRoot ".."
Set-Location $root

$prefix = "public/photo"

# 第一步：1.JPG -> 1x.jpg（临时名），让 Git 认为删除了 .JPG、新增了临时文件
foreach ($i in 1..10) {
    $old = "$prefix/$i.JPG"
    $tmp = "$prefix/${i}x.jpg"
    if (Test-Path $old) {
        git mv $old $tmp
        Write-Host "  $i.JPG -> ${i}x.jpg"
    }
}

# 第二步：1x.jpg -> 1.jpg，得到最终小写扩展名
foreach ($i in 1..10) {
    $tmp = "$prefix/${i}x.jpg"
    $new = "$prefix/$i.jpg"
    if (Test-Path $tmp) {
        git mv $tmp $new
        Write-Host "  ${i}x.jpg -> $i.jpg"
    }
}

Write-Host "`nDone. Run:"
Write-Host "  git commit -m `"photo: extension to lowercase jpg`""
Write-Host "  git push"
