# 把网站发布到公网（免费子域名）

用 **GitHub** 存代码，用 **Vercel** 免费托管，最后会得到一个类似 `gatsby-website-xxx.vercel.app` 的地址，任何人都能访问。

---

## 第一步：把项目推到 GitHub

1. **打开终端**（PowerShell 或 CMD），进入项目目录：
   ```bash
   cd c:\手搓应用\gatsby-website
   ```

2. **初始化 Git 并做第一次提交**（若当前还不是 Git 仓库）：
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   ```
   （`supabase-config.js` 已在 `.gitignore` 里，不会被提交，不会泄露你的 key。）

3. **在 GitHub 上新建仓库**
   - 打开 [github.com](https://github.com) 并登录。
   - 右上角 **+** → **New repository**。
   - 仓库名随便起（例如 `gatsby-website`），**不要**勾选 “Add a README”，然后点 **Create repository**。

4. **把本地代码推上去**（把下面的 `你的用户名` 和 `仓库名` 换成你自己的）：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```
   按提示用 GitHub 账号登录或输入密码/Token。

---

## 第二步：用 Vercel 发布

1. **打开 Vercel**  
   浏览器访问 [vercel.com](https://vercel.com)，点击 **Sign Up**，选择 **Continue with GitHub**，按提示授权。

2. **导入你的仓库**
   - 登录后点 **Add New…** → **Project**。
   - 在列表里找到你刚推送的仓库（例如 `gatsby-website`），点 **Import**。

3. **配置项目（一般不用改）**
   - **Framework Preset**：选 **Vite**（若 Vercel 自动识别了可不管）。
   - **Build Command**：保持 `npm run build` 或留空（会用 `package.json` 里的 `build`）。
   - **Output Directory**：保持 `dist`（Vite 默认输出到 `dist`）。
   - 直接点 **Deploy** 也可以，先发布一版。

4. **等部署完成**  
   部署结束后会给你一个地址，例如 `https://gatsby-website-xxx.vercel.app`，点进去就是你的网站。

---

## 第三步：让线上的「灵感垃圾桶」连上 Supabase

线上环境没有你本地的 `supabase-config.js`，需要把 Supabase 的配置交给 Vercel，在**构建时**自动生成。

1. 在 Vercel 里打开你的项目，顶部点 **Settings** → 左侧 **Environment Variables**。

2. 新增两个变量（Production、Preview 都可勾选）：
   - **Name**: `SUPABASE_URL`  
     **Value**: 你的 Project URL（例如 `https://xxxxx.supabase.co`）。
   - **Name**: `SUPABASE_ANON_KEY`  
     **Value**: 你的 Publishable key（或 anon key，整串复制）。

3. 保存后，到 **Deployments** 里对最近一次部署点右侧 **⋯** → **Redeploy**，或再推一次代码触发重新部署。

重新部署完成后，线上网站的「灵感垃圾桶」会写入 Supabase，「星尘遗落」也会从 Supabase 读数据。

---

## 之后更新网站

改完代码后，在项目目录执行：

```bash
git add .
git commit -m "更新说明"
git push
```

Vercel 会自动检测到推送并重新部署，几分钟后线上就是最新版。

---

## 小结

| 步骤 | 做什么 |
|------|--------|
| 1 | 本地 `git init` → `git add .` → `git commit`，GitHub 新建仓库，`git remote add` + `git push` |
| 2 | Vercel 用 GitHub 登录 → Import 该仓库 → Deploy，得到 `xxx.vercel.app` 链接 |
| 3 | Vercel 项目里 Settings → Environment Variables 添加 `SUPABASE_URL`、`SUPABASE_ANON_KEY`，再 Redeploy 一次 |

遇到某一步报错，把终端或页面的报错信息复制下来，可以继续排查。
