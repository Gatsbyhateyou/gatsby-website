# 项目长期记忆 · 交接摘要

你（新 Agent）将接手以下背景，请在此基础上继续任务，勿重复已踩坑方案。

---

## 核心项目事实 (Core Facts)

- **项目形态**：静态站，**非** Gatsby。Vite 构建，多入口 HTML（`index.html`、`gallery.html`、`diary.html`、`Galaxy.html`），根目录 + `public/` 双轨（构建时 `public/` 拷贝到 `dist/`）。
- **技术栈**：原生 HTML/CSS/JS，Vite 7，Supabase（灵感垃圾桶持久化），GA4 + PostHog（数据采集）。
- **已实现模块**：
  - **灵感垃圾桶**：`script.js` 中 `initIdeaBin()`，`diary.html` 内联一套；打开记 `ideaBinOpenTime`，吞噬时 PostHog `idea_bin_used`（page、timestamp、duration_seconds）。
  - **胶片集**：`GALLERY_PHOTOS` 数组 + `GALLERY_PHOTO_DIR = '/photo'`，图片必须为 **小写** `1.jpg`…`10.jpg`；点击灯箱时 PostHog `image_clicked`（image_id、page）。
  - **Analytics**：`public/analytics-config.js`（gitignore，本地手填或 Vercel 构建时由 `scripts/generate-analytics-config.js` 从环境变量生成）→ `public/analytics-loader.js` 加载 GA gtag + PostHog。**PostHog 必须用官方 snippet（stub + `posthog.init`）**，保证 `window.posthog` 立即可用。
- **构建命令**：`node scripts/generate-supabase-config.js && node scripts/generate-analytics-config.js && vite build`；三者缺一不可且顺序固定。

---

## 技术推导脉络 (Logic Evolution)

1. **数据分工**：GA 只做流量/概览（page_view）；PostHog 做行为（灵感垃圾桶次数·时刻·时长、图片点击）。一次只问一题确认需求后定案。
2. **PostHog 加载**：先用 jsdelivr 的 `posthog.min.js` + `onload` 里 `posthog.init` → 异步导致 `typeof window.posthog` 为 `undefined`、PostHog 一直 "Waiting for events"。改为 **官方 stub 内联 + `posthog.init(key, { api_host })`**，由 PostHog 自家拉取 `/static/array.js`，问题解决。
3. **胶片集裂图**：代码请求 `/photo/1.jpg`，仓库仅有 README；且用户本地为 `1.JPG`，Git 未跟踪/Windows 大小写不敏感，部署后 Linux 下 404。结论：文件名统一小写 `.jpg`；图片必须 `git add public/photo/` 并 push；仅改扩展名时用 **两步 `git mv`**（如 `1.JPG`→`1x.jpg`→`1.jpg`）才能让 GitHub 记录小写。
4. **Vercel 配置未加载**：构建日志只有 `generate-supabase-config.js`，无 `generate-analytics-config.js` → 当时仓库里 `package.json` 的 build 未包含 analytics 步骤；且 `scripts/generate-analytics-config.js` 未提交。解决：提交完整 `package.json` 与 `scripts/`，Vercel 环境变量填 `GA_MEASUREMENT_ID`、`POSTHOG_KEY`、`POSTHOG_HOST`（Environment 勾选 Production），必要时 "Clear cache and redeploy"。

---

## 负面约束与避坑指南 (Negative Constraints)

| 禁止/避免 | 原因 |
|-----------|------|
| 用 jsdelivr 等 CDN 异步加载 PostHog 再在 onload 里 init | `window.posthog` 在脚本加载前为 undefined，事件不发送，PostHog 一直 "Waiting for events"。必须用官方 stub 内联，使 posthog 立即可用。 |
| 在代码里写死 `.JPG` 或混合大小写图片名 | 部署环境（Vercel/Linux）区分大小写，`/photo/1.JPG` 与 `1.jpg` 不同，会导致 404 裂图。统一小写 `.jpg`。 |
| 仅靠资源管理器重命名扩展名（JPG→jpg）就 commit | Windows 下 Git 常不把"仅大小写变更"视为修改，推上去仍是 .JPG。必须用两步 `git mv` 或项目内 `scripts/rename-photo-to-lowercase.ps1`。 |
| 只改 `package.json` 的 build 不提交 `scripts/generate-analytics-config.js` | Vercel 执行 `node scripts/generate-analytics-config.js` 会因文件不存在而 build 失败（exit 1）。 |
| 在 PowerShell 脚本里用中文输出 | 易产生 UTF-8/GBK 乱码（如 "瀹屾垚銆傝鎵ц"）。已改为英文提示。 |
| 将 `public/analytics-config.js` 加入 Git | 含密钥，已在 .gitignore；线上由构建时环境变量生成。 |
| 假设 "未跟踪文件" 在项目根时还去改父级目录 | 若 `git status` 出现 `gatsby-website/` 为 untracked，说明当前在父目录，应先 `cd gatsby-website` 再操作。 |

---

## 待办与现状 (Status & Todo)

- **当前状态**：GA 线上已有数据；PostHog 已改为官方 snippet 加载（`public/analytics-loader.js`），需确认该修改已 **commit 并 push**，且 Vercel 完成部署。
- **下一步逻辑起点**：  
  1）确认 `public/analytics-loader.js` 的"官方 snippet"版本已部署到线上；  
  2）在线上站打开控制台执行 `typeof window.posthog` 应为 `"object"`；  
  3）在站内产生行为（翻页、灵感垃圾桶吞噬、胶片集点击）后，在 PostHog 的 Activity/Events 中应出现 `$pageview`、`idea_bin_used`、`image_clicked`；若仍 "Waiting for events"，再查 Network 是否有对 PostHog 域名的请求及响应状态。

---

*文档生成自对话总结，供下一 Agent 作为 System Prompt / 长期记忆使用。*
