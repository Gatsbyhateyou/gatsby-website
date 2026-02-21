# 当前站（gatsby-website）清理范围

本 skill 当前仅服务此静态站。Agent 执行「扫出候选」时以此为准。

---

## 引用标准（唯一准则）

**只有「入口」能定义「谁算被引用」；非入口页面里的引用一律不算。**

- **入口** = 下面「入口列表」里的那些 HTML（根目录 6 个 + style-previews 下的）。
- **收集引用时**：只从入口、以及入口能链到的页面（仅 style-previews）里收集 `href`、`src`、`url()`、`content=`（如 og:image 的站内路径）等；再从这些页面引用的 JS/CSS 里再收集一层。
- **不算引用**：`public/index.html`、`public/diary.html`、`public/gallery.html` 等**不是入口**，它们里面写的图片/链接**不参与**「被引用」判断。版本迭代后若只有这些旧页在用某资源，该资源算**未引用**。
- **扫描范围**：只检查 **public/** 和根目录**源码**里有没有未引用文件；**dist/** 不扫描（构建产物，下次 `vite build` 会重新生成；删掉 public 里未引用文件后，dist 里自然不会再出现）。

这样像 `me1.jpg` / `me2.jpg` / `me3.jpg` 若只被 public 旧首页用、而根目录入口没用，就会被扫成「未引用」；若某张被根目录某页的 og:image 等引用，则仍算被引用。

---

## 入口（Entry Points）

根目录 HTML，来自 vite.config.js 的 build.input：

| 入口文件 | 说明 |
|----------|------|
| index.html | 首页 |
| gallery.html | 胶片集 |
| diary.html | 日记 |
| Galaxy.html | 星尘遗落 |
| skills.html | 技能页 |
| style-gallery.html | UI 风格提示词画廊 |

由入口可到达的次级页面（只有这些算「入口能到达」）：

- public/style-previews/index.html（风格预览索引）
- public/style-previews/*.html（各风格预览页，由 index 与 style-gallery 链接）

**不是入口**：public/index.html、public/diary.html、public/gallery.html（旧版副本，其引用不参与「被引用」判断）。

## 视为「被引用」的规则

1. **仅从入口收集**：只在上述入口 HTML、以及 style-previews 下的 HTML 中查找 `href=`、`src=`、`content=`（og:image 等）、`url()` 等指向的站内路径；再从这些页面引用的 JS/CSS 中收集一层。
2. **全局资源**：被入口或上述页面引用的根目录/public 文件（如 `/styles.css`、`/script.js`、`/favicon.svg`、`/me1.jpg`）算被引用。
3. **构建/配置**：vite.config.js、package.json 等构建与脚本直接使用的文件不算「用不到」，除非用户明确要删。

## 排除（不参与「未引用」判断）

- node_modules/
- .git/
- dist/（构建产物，不扫描；删除 public 未引用文件后，下次构建 dist 即更新）
- .cursor/、.agents/（工具与技能，除非用户要求清理）
- *.log、.env*（按需由用户决定）

## 死代码 / 注释块

- **死代码**：JS 中未被任何入口或已引用脚本调用的函数、变量；CSS 中未被任何已引用 HTML/组件使用的选择器。需静态分析或人工抽查。
- **注释块**：连续多行（如 ≥5 行）被注释掉的 HTML/JS/CSS，可列为「疑似可删」，由用户确认后删除。

## 后续扩展

若本 skill 改为通用版，入口与引用规则改为由用户或项目配置提供，本文件可改为「示例」或从 references 中移除。
