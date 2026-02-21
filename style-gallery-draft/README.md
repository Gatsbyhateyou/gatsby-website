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

## 搜不到或命中非 UI 风格时：用 skill-creator 新建

当**关键词无结果**（如 skeuomorphic）或**命中的 skill 不是 UI 风格**（如 organic → SEO）时，不放弃该关键词，而是用 **skill-creator** 新建一个风格 skill。约定如下：

- **先问再建**：Agent 先说明「关键词 X 无结果/不合适，是否用 skill-creator 新建一个「X」风格 skill？」，等你确认后再执行。
- **多给需求**：新建时尽量把需求说清楚：关键词 + 风格意图（一句话或更多），必要时补充目标场景、与现有风格的区别、是否需要中/英 prompt 等。
- **用 skill-creator 新建风格**：阅读并遵循 `.cursor/skills/skill-creator/SKILL.md` 的流程（理解需求 → 规划内容 → 写 SKILL.md）；产出写到 **style-gallery-skills/\<id\>/SKILL.md**，格式与现有风格一致（frontmatter + 正文 +「Prompt（供画廊复制）」）；再按现有流程加卡片、预览页、更新 KEYWORDS.md。

## 用脚本把新风格接入画廊

当 **style-gallery-skills/\<id\>/SKILL.md** 已写好（或从草稿整理完）后，可用脚本一次性完成：追加画廊卡片、生成预览页、更新 style-previews/index、更新 KEYWORDS.md。

在项目根目录执行：

```bash
node scripts/add-style-to-gallery.js --id <id> --name "<展示名>" --preview <预览类型> --prompt "<整段 prompt>" [--keyword <关键词>]
```

或从 SKILL.md 自动抽取 prompt（需 SKILL 内有「## Prompt（供画廊复制）」段落）：

```bash
node scripts/add-style-to-gallery.js --id <id> --name "<展示名>" --preview <预览类型> --prompt-file style-gallery-skills/<id>/SKILL.md [--keyword <关键词>]
```

- **预览类型** 必须是画廊里已有的（如 glass、pixel、clean、minimal、dark、terminal、skeuomorphic、neumorphism、organic 等）。若为新类型，需先在 style-gallery.html 里手加对应 CSS，再跑脚本。
- 脚本会生成一个**通用模板**预览页，如需贴合风格可事后改 `public/style-previews/N-<id>.html`。
