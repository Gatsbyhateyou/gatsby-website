# 数据采集配置（GA4 + PostHog）

网站已接入 **Google Analytics 4（GA4）** 与 **PostHog**：GA 负责流量/概览，PostHog 负责行为类数据。

---

## 第一步：复制并填写配置

1. 在 **`public`** 目录下，将 `analytics-config.example.js` 复制为 **`analytics-config.js`**（开发与部署都会从该路径加载）。
2. 打开 `public/analytics-config.js`，填入你在 GA 和 PostHog 后台获取的值：

| 变量 | 说明 | 从哪里获取 |
|------|------|------------|
| `__GA_MEASUREMENT_ID__` | GA4 测量 ID | GA 管理后台 → 数据流 → 网站 → 测量 ID（形如 `G-XXXXXXXXXX`） |
| `__POSTHOG_KEY__` | PostHog 项目 API Key | PostHog → Project Settings → Project API Key（形如 `phc_xxx...`） |
| `__POSTHOG_HOST__` | PostHog 服务地址 | 一般为 `https://eu.posthog.com` 或 `https://us.i.posthog.com` |

`analytics-config.js` 已加入 `.gitignore`，不会被提交，避免泄露密钥。

---

## 第二步：本地 vs 线上（Vercel）

- **本地开发**：在 `public/` 下创建并填写 `analytics-config.js` 后，执行 `npm run dev` 即可。
- **Vercel 线上站**：用环境变量在**构建时**自动生成 `analytics-config.js`，无需把密钥提交到 Git：
  1. 打开 Vercel 项目 → **Settings** → **Environment Variables**。
  2. 添加以下变量（Value 填你在 GA / PostHog 拿到的真实值）：

  | Name | Value | 说明 |
  |------|--------|------|
  | `GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | GA4 测量 ID |
  | `POSTHOG_KEY` | `phc_xxx...` | PostHog 项目 API Key |
  | `POSTHOG_HOST` | `https://eu.posthog.com` 或 `https://us.i.posthog.com` | PostHog 服务地址（按你注册区域选） |

  3. 保存后**重新部署**（Deployments → 某次部署右侧 ⋮ → Redeploy）。构建脚本会读取这些变量并生成 `public/analytics-config.js`，你的 **Vercel 网址** 上就会正常上报 GA 和 PostHog 数据。

---

## 第三步：检查 GA 与 PostHog 是否已连上

按下面顺序检查，确认网站和 GA、PostHog 的链接正常。

### 1. 在浏览器里看脚本是否加载

打开你的**线上站**（Vercel 地址）或本地 `http://localhost:5173`：

1. 按 **F12** 打开开发者工具，切到 **Console（控制台）**。
2. 输入下面两行并回车，看是否有值（不是 `undefined`）：
   - `window.__GA_MEASUREMENT_ID__` → 应显示你的 GA 测量 ID（如 `"G-XXXXXXXXXX"`）。
   - `window.__POSTHOG_KEY__` → 应显示你的 PostHog Key（如 `"phc_xxx..."`）。
3. 再输入：
   - `typeof window.gtag` → 若已配置 GA，应为 `"function"`。
   - `typeof window.posthog` → 若已配置 PostHog，应为 `"object"`（PostHog 加载稍晚，可多等 1～2 秒再试）。

若第 2 步是空字符串或 `undefined`，说明 **analytics-config.js 没加载或没填**（本地检查 `public/analytics-config.js`，线上检查 Vercel 环境变量是否填好并重新部署过）。

---

### 2. 看网络请求是否发出

在开发者工具里切到 **Network（网络）**：

1. 勾选 **Preserve log**（保留日志），刷新页面。
2. 在筛选框输入 **google** 或 **gtag**：应能看到对 `googletagmanager.com` 的请求（说明 GA 在发数据）。
3. 再输入 **posthog** 或 **i.posthog**：应能看到对 PostHog 域名的请求（说明 PostHog 在发数据）。

有请求且状态码为 200 或 204，即表示前端已成功连上。

---

### 3. 在 GA 后台看实时数据

1. 打开 [Google Analytics](https://analytics.google.com) → 选你的媒体资源 → 左侧 **报告** → **实时**。
2. 保持网站在一个标签页里打开并多点点页面。
3. 实时报告里应出现 **1 位（或更多）用户**、有**页面浏览**。有数据即表示 GA 与网站已连上。

---

### 4. 在 PostHog 后台看事件

1. 打开 [PostHog](https://eu.posthog.com 或 https://us.posthog.com) → 进入你的项目。
2. 左侧进 **Activity** 或 **Events**，时间选 **Last hour**。
3. 在网站里：打开灵感垃圾桶点一次「吞噬」、在胶片集点一张图。
4. PostHog 里应出现 **`idea_bin_used`**、**`image_clicked`** 以及自动采集的 **`$pageview`** 等事件。

有这些事件即表示 PostHog 与网站已连上。

---

## 采集的数据说明

### GA4（流量/概览）

- **页面浏览**：每个页面的 `page_view` 由 GA 的 gtag 自动上报，无需额外埋点。

### PostHog（行为）

| 事件名 | 含义 | 属性 |
|--------|------|------|
| `idea_bin_used` | 用户使用灵感垃圾桶（点击「吞噬」） | `page`：当前页面路径；`timestamp`：使用时刻（ISO 时间）；`duration_seconds`：从打开垃圾桶到点击吞噬的时长（秒） |
| `image_clicked` | 用户在胶片集点击某张图片 | `image_id`：图片文件名（如 `1.jpg`）；`page`：当前页面路径（通常为 `/gallery.html`） |

在 PostHog 中可按 `page` 看各页灵感垃圾桶使用次数，按 `image_id` 看哪张图被点击最多，按 `timestamp` / `duration_seconds` 分析使用时间与时长。
