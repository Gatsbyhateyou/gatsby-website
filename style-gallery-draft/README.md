# 草稿 · 待整理 Skill

本文件夹用来存放**按关键词搜索并自动下载的、安装量最高的 skill**（原始格式）。

## 流程

1. **PowerShell 脚本**按你给的关键词执行 `npx skills find <关键词>`，解析结果后下载**安装量最高**的那一个，放到本文件夹（草稿）。
2. **我（Agent）**再读取草稿里的 skill，按「我能用的格式」整理成标准 SKILL.md，写入 **style-gallery-skills/**，供生成风格展示页时使用。

## 使用

在项目根目录执行：

```powershell
.\scripts\fetch-top-skill-to-draft.ps1 <英文关键词>
```

示例：

```powershell
.\scripts\fetch-top-skill-to-draft.ps1 glassmorphism
.\scripts\fetch-top-skill-to-draft.ps1 minimal design
```

下载完成后，跟我说：「把 style-gallery-draft 里的 skill 整理到 style-gallery-skills」，我会读取并转换成可用格式写入 style-gallery-skills。
