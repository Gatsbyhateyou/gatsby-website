# PRD-002：UI 风格提示词画廊

**目标**：一页展示多种 UI 风格，每块为一张可点击的「风格小样」卡片，点击跳转预览页；每块提供一键复制「生成该风格的 prompt」。

---

## 当前风格清单（共 17 种）

| # | 画廊 id | 展示名称 | 预览类型 | 来源说明 |
|---|--------|----------|----------|----------|
| 1 | glassmorphism | 玻璃拟态 Glassmorphism | glass | skills.sh |
| 2 | 8bit-pixel | 8-bit 像素风 | pixel | skills.sh |
| 3 | game-ui-design | 游戏 UI | game | skills.sh |
| 4 | retro-css | 复古 CSS 架构 | pixel | skills.sh |
| 5 | brutalist | 新粗野主义 Neobrutalism | brutalist | skills.sh |
| 6 | flat-design | 界面设计 Interface Design | clean | skills.sh |
| 7 | dashboard | KPI 仪表盘 | dashboard | skills.sh |
| 8 | editorial | 杂志/编辑风 Editorial | editorial | skills.sh |
| 9 | typography | 网页排版 Web Typography | type | skills.sh |
| 10 | dark-mode | 暗黑 / 深色主题 Dark Mode | dark | skills.sh（tailwindcss-responsive-darkmode） |
| 11 | tailwind-design-system | Tailwind 设计系统 | clean | skills.sh |
| 12 | web-design-guidelines | Vercel / 现代 Web 规范 | clean | skills.sh |
| 13 | minimal | 极简 Minimal | minimal | 手写 |
| 14 | terminal | 终端 / CLI 风 Terminal | terminal | 手写 |
| 15 | skeuomorphic | 拟物化 Skeuomorphic | skeuomorphic | skill-creator 本地新建（关键词无结果） |
| 16 | neumorphism | 新拟态 Neumorphism | neumorphism | skill-creator 本地新建 |
| 17 | organic | 有机 / 自然视觉 Organic | organic | skill-creator 本地新建（原关键词命中非 UI 风格） |

**预览类型**：每张卡片用纯 CSS 画出该风格的「小样」（如玻璃块、像素按钮、双阴影等），不依赖截图。点击卡片在新标签页打开对应预览页 `public/style-previews/N-<id>.html`，预览页内「返回画廊」回到画廊页。

---

## 流程与约定

### 1. 从关键词拉取到画廊

- **拉取**：在项目根执行 `.\scripts\fetch-top-skill-to-draft.ps1 <英文关键词>`，将安装量最高的 skill 下载到 `style-gallery-draft/<关键词>/`。
- **整理**：由 Agent 将草稿整理成标准 SKILL.md 写入 `style-gallery-skills/<id>/`，并提取/撰写「供画廊复制的 prompt」。
- **接入**：用脚本 `node scripts/add-style-to-gallery.js --id <id> --name "<展示名>" --preview <类型> --prompt "<prompt>" [--keyword <关键词>]` 或 `--prompt-file style-gallery-skills/<id>/SKILL.md` 一次性追加画廊、生成预览页、更新 `style-previews/index.html` 与 `style-gallery-draft/KEYWORDS.md`。
- **关键词进度**：在 `style-gallery-draft/KEYWORDS.md` 中维护「已做 / 草稿拉过但未采用 / 拉过但无结果 / 后续可尝试」，避免重复。

### 2. 搜不到或命中非 UI 风格时：用 skill-creator 新建

- **先问再建**：当关键词无结果或命中的 skill 不是 UI 风格时，Agent 先问「是否用 skill-creator 新建该风格」，用户确认后再执行。
- **多给需求**：新建时提供关键词 + 风格意图（一句话或更多），必要时补充场景、与现有风格的区别等。
- **产出**：按 `.cursor/skills/skill-creator/SKILL.md` 的流程写出 `style-gallery-skills/<id>/SKILL.md`（含「## Prompt（供画廊复制）」），再按「接入」步骤跑脚本并视需要新增预览类型 CSS。

### 3. 不纳入的风格类型（已排除）

- 与「实现设计 / 规范」相关的技能（如 implement-design、create-design-system-rules 等）
- 与「搜技能」等非 UI 风格（如 find-skills、organic-search-features 等）——若用户确需该「关键词」对应的视觉风格，则用 skill-creator 新建

---

## 产出物与实现说明

| 产出 | 说明 |
|------|------|
| **画廊页** | `style-gallery.html`，根目录入口；构建已加入 `vite.config.js`（styleGallery）。首页有入口「UI 风格提示词」。 |
| **每风格** | 一张卡片：CSS 小样预览区（可点击→预览页）+ 风格名 +「复制 prompt」按钮。 |
| **预览页** | `public/style-previews/N-<id>.html`，通用模板可后续按风格改写；内链「返回画廊」指向 `../../style-gallery.html`。 |
| **预览索引** | `public/style-previews/index.html` 列出全部预览页链接，顶部有「返回画廊」。 |
| **SKILL 库** | `style-gallery-skills/<id>/SKILL.md`，每风格一份；可选 `references/`、`scripts/`，本仓库内风格以单文件 SKILL 为主。 |
| **草稿与进度** | `style-gallery-draft/` 存按关键词拉取的原始 skill；`KEYWORDS.md` 记录已做/未采用/无结果/可尝试。 |
| **接入脚本** | `scripts/add-style-to-gallery.js`：校验 id 格式、防重复、必填与文件存在性检查；写入画廊、预览页、index、KEYWORDS。 |

---

## 修订说明

- 风格数量由 8 种更新为 17 种，来源补充「手写」与「skill-creator 本地新建」。
- 预览由「截图占位」改为「CSS 小样 + 点击跳转预览页」，不再依赖截图。
- 补充关键词拉取→整理→脚本接入的流程，以及搜不到时用 skill-creator 新建的约定。
- 补充 KEYWORDS.md、add-style-to-gallery.js、返回画廊等实现细节。
