# PRD-002：UI 风格提示词画廊（MVP）

**目标**：一页展示多种 UI 风格，每块一张风格预览图 + 一键复制「生成该风格的 prompt」。

---

## 风格清单（共 8 种）

### 来自 skills.sh 的 5 种

| # | 风格名称 | 来源 | 安装命令 | 说明 |
|---|----------|------|----------|------|
| 1 | 有辨识度前端 | anthropics/skills@frontend-design | `npx skills add anthropics/skills@frontend-design` | 有辨识度、可上线的前端界面，避免通用 AI 审美 |
| 2 | Vercel / 现代 Web | vercel-labs/agent-skills@web-design-guidelines | `npx skills add vercel-labs/agent-skills@web-design-guidelines` | 干净、规范的现代 Web 风 |
| 3 | macOS 系统感 | ehmo/platform-design-skills@macos-design-guidelines | `npx skills add ehmo/platform-design-skills@macos-design-guidelines` | macOS 设计规范、系统感控件 |
| 4 | Tailwind 设计系统 | wshobson/agents@tailwind-design-system | `npx skills add wshobson/agents@tailwind-design-system` | 基于 Tailwind 的组件与风格规范 |
| 5 | UI 设计系统 | samhvw8/dot-claude@ui-design-system | `npx skills add samhvw8/dot-claude@ui-design-system` | 设计系统、组件与视觉规范 |

### 你提供的 3 种（本地 / .agents/skills）

| # | 风格名称 | 预期路径 | 说明 |
|---|----------|----------|------|
| 6 | 8-bit 像素风 | `.agents/skills/8-bit-pixel-art-patterns/SKILL.md` | 8-bit 像素艺术图案与风格（待补充 SKILL 内容后转 prompt） |
| 7 | 游戏 UI | `.agents/skills/game-ui-design/SKILL.md` | 游戏界面设计风格（待补充 SKILL 内容后转 prompt） |
| 8 | 复古 CSS 架构 | `.agents/skills/retro-css-architecture/SKILL.md` | 复古 CSS 架构与视觉风格（待补充 SKILL 内容后转 prompt） |

**说明**：当前仓库内未找到 `.agents/skills/` 下上述三个文件。请你把这三份 SKILL 的路径或内容发来后，可再为每种风格写出对应的「可复制 prompt」文案。

---

## 不纳入的风格类型（已排除）

- 与「实现设计 / 规范」相关的技能（如 implement-design、create-design-system-rules 等）
- 与「无障碍 / 质量」相关的技能（如 accessibility、fixing-accessibility 等）

---

## MVP 产出物

1. **同一套内容的展示页**：有标题、按钮、若干区块，用于套用不同风格并截图。（待你按风格套用后截图）
2. **8 种风格**：已全部纳入；3 份本地 skill 已从 `personal-AI-tools/.agents/skills/` 读取并转成 prompt。
3. **每风格一张预览图**：当前为占位（「预览图占位」），待你截好图后替换为真实图片即可。
4. **每风格一条 prompt**：已写入 `style-gallery.html`，可一键复制。
5. **画廊页**：已实现 `style-gallery.html`，一页 8 块，每块 = 预览占位 + 风格名 + [复制 prompt] 按钮；首页已添加入口「UI 风格提示词」。

---

## 实现说明

- **入口**：首页新增卡片「UI 风格提示词」→ `/style-gallery.html`；构建入口已加入 `vite.config.js`（styleGallery）。
- **替换预览图**：后续可将每块中的 `.style-card__preview` 内改为 `<img src="..." alt="...">` 或保留占位直至你提供截图路径。
