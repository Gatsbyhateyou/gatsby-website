# 刘锦麟个人站（gatsby-website）

仓库名虽为 `gatsby-website`，本站为 **Vite 7 多入口静态站点**：根目录 HTML + 原生 JS + 全局样式，构建产物输出到 `dist/`。生产环境部署在 **Vercel**（示例域名：`https://gatsby-website-nine.vercel.app`）。

---

## 功能概览

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` · `index.html` | 个人主页入口 |
| 胶片集 | `/gallery.html` | 图片灯箱，`/photo` 下为小写 `*.jpg` |
| AI 日记 | `/diary.html` | 可展开条目；灵感垃圾桶；格言等 |
| 星尘遗落 | `/Galaxy.html` | 灵感以粒子展示，数据来自垃圾桶 API / localStorage |
| Skill 手册 | `/skills.html` | 技能说明与导航 |
| 风格画廊 | `/style-gallery.html` | UI 风格预览与可复制提示词；子页在 `public/style-previews/` |

**已实现能力（摘要）**

- **灵感垃圾桶**：多页右下角入口；优先 **Supabase** 表 `inspirations`，失败回退 **localStorage**。
- **统计分析**：构建时由环境变量生成 `public/analytics-config.js`（本地勿提交），加载 **GA4 + PostHog**（`public/analytics-loader.js`）。
- **SEO**：各页含 description、canonical、Open Graph 等基础元数据。

---

## 技术栈

- **构建**：Vite 7  
- **语言**：HTML、CSS、原生 JavaScript（无 React/Vue）  
- **依赖**：`lucide`（图标）；开发依赖含 **Playwright**（风格预览截图）、**ESLint 9**  
- **后端/数据**：Supabase（仅 Data API，匿名 RLS）；无服务端业务代码  

---

## 环境要求

- **Node.js**：建议当前 LTS（与 Vite 7 兼容的版本）  
- **npm**：用于安装依赖与脚本  

---

## 本地开发

```bash
npm install
npm run dev
```

默认由 Vite 起本地开发服务器，按终端提示访问（常见为 `http://localhost:5173`）。

---

## 构建与预览

```bash
npm run build
npm run preview
```

`build` 会依次执行：

1. `scripts/copy-styles.js`  
2. `scripts/generate-supabase-config.js`（从环境变量写入 `public/supabase-config.js`，未配置则跳过或占位）  
3. `scripts/generate-analytics-config.js`（同上，生成 `public/analytics-config.js`）  
4. `vite build`  

产物在 **`dist/`**；`public/` 会在构建时拷贝到输出根目录。

---

## 环境变量（CI / Vercel）

在 **Vercel → Project → Settings → Environment Variables** 中配置（**Production** 需勾选），修改后需 **Redeploy** 才会进下一次构建。

| 变量名 | 用途 |
|--------|------|
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | 浏览器可用的 Publishable（原 anon）密钥，勿使用 service_role |
| `GA_MEASUREMENT_ID` | Google Analytics 4 衡量 ID |
| `POSTHOG_KEY` | PostHog 项目 Key |
| `POSTHOG_HOST` | PostHog API 主机（如 `https://us.i.posthog.com`） |

本地开发若需同上行为，可在仓库根自行设置环境变量后执行 `npm run build`，或按脚本逻辑放置**不入库**的本地配置文件（见 `.gitignore`）。

**注意**：不要使用 `VITE_*` 代替上述名称——当前构建脚本只读取上表中的变量名。

---

## 常用 npm 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 本地预览构建结果 |
| `npm run lint` | ESLint 检查 |
| `npm run screenshot -- <预览页名>` | 对 `public/style-previews/` 单页截图（需 Playwright Chromium） |
| `npm run commit -- "说明"` | 快捷 `git add -A` + `commit`（见 `scripts/quick-commit.js`） |

---

## 仓库结构（精简）

```
├── index.html, gallery.html, diary.html, Galaxy.html, skills.html, style-gallery.html
├── styles.css, script.js
├── vite.config.js          # 多页入口
├── public/                 # 静态资源，构建时拷入 dist 根目录
│   ├── photo/              # 胶片集图片（线上需小写 .jpg）
│   ├── style-previews/     # 风格画廊子页
│   └── …
├── scripts/                # 构建与工具脚本
├── prd/                    # 产品说明文档
├── .cursor/                # Cursor 规则与技能（可选）
└── style-gallery-skills/   # 风格相关技能与工作流说明
```

---

## 部署（GitHub → Vercel）

1. 将本仓库推送到 GitHub **`main`** 分支。  
2. Vercel 关联该仓库并配置上文环境变量。  
3. 每次 push 触发自动构建；若仅改环境变量，需在 Vercel 手动 **Redeploy**。  

---

## 日记与内容约定（给协作者）

- `diary.html` 中日记为 **时间正序**：**最早在上，越往下越晚**；**新增条目插在 `diary-section` 最底部**。  
- 当前日记纪年以页面内日期为准（**2026**）。  

---

## 许可证

见 `package.json` 中 `license` 字段（当前为 `ISC`）；若需改为其他许可证请自行更新并与仓库声明一致。

---

## 作者

刘锦麟 · 个人实验与作品入口站点。
