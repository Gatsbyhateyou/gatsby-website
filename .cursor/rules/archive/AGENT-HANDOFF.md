# Agent 接手背景 · 长期记忆

你（新 Agent）将接手以下背景，请在此上下文中延续任务。

---

## 核心项目事实 (Core Facts)

- **项目实质**：静态多页站，Vite 构建（`vite build`），非 Gatsby。根目录 `index.html` / `gallery.html` / `diary.html` / `Galaxy.html` 为入口；`public/` 为静态资源目录，构建时整体拷贝到 `dist/` 根。
- **技术栈**：HTML + 原生 JS（无框架）、Vite 7、Supabase（仅 Data API + 表，Auth 未接）。
- **站点身份**：刘锦麟个人主页；页：首页、胶片集、AI 日记、星尘遗落（Galaxy，镜像星海）。
- **已实现模块**：
  - **灵感垃圾桶**：多页右下角入口，输入文字后「吞噬」或 Enter 写入；数据存 `localStorage.LOST_INSPIRATIONS` 或 Supabase 表 `inspirations`（优先 Supabase，失败回退 localStorage）。
  - **Supabase 集成**：表 `inspirations`（id uuid, content text, user_id uuid nullable, created_at）；RLS 开放匿名 insert/select。前端通过 `window.ideaBinApi`（`supabase-idea-bin.js`）调用 `save(content)` / `load()`；未配置或加载失败时 `ideaBinApi === null`，逻辑回退 localStorage。
  - **配置与构建**：本地用 `supabase-config.js`（gitignore，含 `__SUPABASE_URL__` / `__SUPABASE_ANON_KEY__`）；线上由 Vercel 环境变量 `SUPABASE_URL`、`SUPABASE_ANON_KEY` 在构建时经 `scripts/generate-supabase-config.js` 生成 `public/supabase-config.js`。
  - **星尘遗落**：Galaxy 页从 `ideaBinApi.load()` 或 localStorage 读列表，渲染为粒子；StarDust 需 `content`、`timestamp`、`id`（x/y 可随机生成）。
  - **SEO**：各页已加 description、keywords、robots、canonical、og、twitter；基础 URL 为 `https://gatsby-website-nine.vercel.app`。
  - **Favicon**：`public/favicon.svg`，各页 `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`。
- **部署**：GitHub 仓库推送到 main → Vercel 自动构建部署；生产域名 `gatsby-website-nine.vercel.app`。

---

## 技术推导脉络 (Logic Evolution)

- **灵感存储**：从纯 localStorage 演进为「Supabase 优先 + localStorage 回退」，以便多设备/多用户（user_id 已预留，Auth 未做）。
- **线上 Supabase**：因 `supabase-config.js` 不提交，采用构建时根据 env 生成 `public/supabase-config.js`，保证部署产物内含配置。
- **发布流程**：用户无 Git/无部署经验 → 选用 GitHub + Vercel 免费子域名；文档写清「先加 env 再 Redeploy」。
- **Favicon**：先做几何标签 SVG → 用户希望用手绘图标；按描述手写 SVG 效果差 → 建议用户用图片转 SVG 工具，图标形态暂保留现状、延后替换。

---

## 负面约束与避坑指南 (Negative Constraints)

| 事项 | 禁止/避免 | 原因 |
|------|-----------|------|
| Supabase Key | 前端使用 `service_role` 或 Secret key | 仅 Publishable key（或 Legacy anon）可暴露于浏览器。 |
| 环境变量名 | 使用 `VITE_*` 或拼写错误 | 构建脚本只读 `SUPABASE_URL`、`SUPABASE_ANON_KEY`；错名会导致「未设置」且不生成配置。 |
| 部署后改 env | 只改 Vercel env 不重新部署 | 新 env 仅在下一次构建生效，必须 Redeploy（或推新 commit）后线上才用新配置。 |
| Favicon 只提交图 | 只 push `public/favicon.svg` 不提交 HTML | 线上 HTML 无 `<link rel="icon">` 时，即使 `/favicon.svg` 可访问，标签页仍显示默认图标。需同时提交引用 favicon 的 HTML。 |
| 灵感逻辑入口 | 在 diary 页依赖根目录 `script.js` 的 灵感垃圾桶 | `script.js` 内对 `page-diary` 跳过 initIdeaBin；diary 使用自身内联脚本，需单独接 ideaBinApi。 |
| 文档用语 | 写「Project Settings → API」 | 当前 Supabase 控制台为「API Keys」；Publishable key 即原 anon 用途。 |
| 手绘图标实现 | 仅凭文字描述重画复杂一笔画 SVG | 已证明还原度不足；应让用户用 vectorizer.io / convertio 等转 SVG，再由 Agent 做 viewBox/描边等适配。 |

**Bug 修复路径摘要**：  
- 线上 Supabase 不生效 → 查 `/supabase-config.js` 是否 404；若 404 则 env 未注入或未 Redeploy；构建日志可见 `SUPABASE_URL=已设置/未设置` 调试输出。  
- 环境变量含换行 → 脚本内已对 URL/Key 做 `.trim()`。

---

## 待办与现状 (Status & Todo)

- **当前状态**：站已部署；灵感垃圾桶与星尘遗落逻辑已接 Supabase；SEO、favicon 已做；用户曾遇 Vercel env 未生效（「未设置」），已加调试日志与排查步骤。
- **未决/可选**：① 若用户反馈线上仍「未设置」，需在其 Vercel 项目内确认 Environment Variables 已勾选 Production 且 Redeploy；② 自定义 favicon（手绘）已搁置，后续可让用户提供 tracer 导出的 SVG 再替换 `public/favicon.svg`；③ 绑定自定义域名后需全局替换 `gatsby-website-nine.vercel.app`（SEO、canonical、og 等）。
- **下一步逻辑起点**：任何新需求前，先确认 main 分支与本地未提交改动是否一致（曾有大量未 push 的 HTML/脚本/文档），避免在过期基线上升级。
