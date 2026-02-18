# Agent 长期记忆 / 交接说明

你（新 Agent）将接手以下背景，请在此基础上继续任务。

---

## 核心项目事实 (Core Facts)

- **项目**：个人站「刘锦麟」，workspace 名 `gatsby-website`，实际为 **Vite 静态站点**（非 Gatsby）。构建：`npm run build`（会先跑 `generate-supabase-config.js`、`generate-analytics-config.js`，再 `vite build`）。
- **入口**：根目录 `index.html`、`diary.html`、`gallery.html` 等；样式与脚本为全局 `styles.css`、`script.js`；部署产物在 `public/`。
- **日记模块**：`diary.html` 内为手写 HTML 日记列表。单条结构：`.diary-entry.diary-entry--expandable` → `.diary-entry__row`（含 `.diary-entry__date`、`.diary-entry__title.diary-entry__title--toggle`）→ `.diary-entry__body`（若干 `<p>`）。点击标题展开/收起由内联脚本绑定。另有格言（一言 API）、主题切换、灵感垃圾桶（与 Supabase 可选集成）。
- **日记顺序约定**：**第一篇（最上方）为最早日期，越往下日期越晚**。当前顺序：2025-02-14 → 2025-02-15 → 2025-02-16。新增日记**必须插在 `<section class="diary-section">` 内最下面**（即最后一个 `.diary-entry` 之后）。该约定已在 `diary-section` 开头以 HTML 注释写明。

---

## 技术推导脉络 (Logic Evolution)

- 用户要求「补充一篇日记」并「扩写约两百字，风格与以往一样」。先通过一问一答确认：日记位置 = `diary.html`（与之前一致）；标题 = 由 Agent 拟。据此在列表**顶部**新增了 2025-02-16 条目。
- 用户随后要求「把今天的日记放到 2 月 15 号下面，以后一直保持这样」。初次理解被纠正：用户澄清** 2 月 14 在最上面，越往下越晚，2 月 14 是第一篇**。因此最终规则定为：**时间正序，最早在上，新日记插在最下面**；并完成一次重排 + 注释固化约定。

---

## 负面约束与避坑指南 (Negative Constraints)

- **禁止把新日记插在列表顶部**。用户已明确要求「第一篇是 2 月 14，越往下日期越晚」，新条目插在顶部会破坏时间正序。
- **禁止在未确认的情况下假设「最新日记置顶」**。本项目的约定是**最早在上、最晚在下**，与常见「最新在前」的博客顺序相反，新 Agent 勿凭习惯改顺序。
- 本轮对话中**没有**记录到失败方案或 Bug 修复路径；仅有一次顺序约定的澄清与修正。

---

## 待办与现状 (Status & Todo)

- **当前状态**：日记顺序已按 02-14 → 02-15 → 02-16 固定；新增日记的插入位置与顺序约定已写入 `diary.html` 注释。日记相关需求已闭环。
- **下一步逻辑起点**：若用户提出「再写一篇日记」，则：在 `diary-section` 内**最下方**追加一条 `.diary-entry`，日期、标题、正文按用户或约定生成，版式复制现有任一条即可。若为其他需求（如改版、新页面、脚本/样式），则从用户当次指令与上述核心事实出发，勿改动既有日记顺序约定，除非用户明确要求。
