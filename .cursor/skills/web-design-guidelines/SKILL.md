---
name: web-design-guidelines
description: 按 Vercel Web Interface Guidelines 审查网页 UI 代码合规性。Use when the user says 检查UI、审查设计、检查无障碍、web design guidelines、按最佳实践审查页面、review my UI、check accessibility、audit design.
---

# Web Interface Guidelines（网页界面规范审查）

按 [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) 审查指定文件，输出合规性问题（`file:line` 格式）。

## 何时使用

用户说以下任一内容时使用：

- 检查 UI、审查设计、检查无障碍、审查 UX
- web design guidelines、按最佳实践审查我的页面
- review my UI、check accessibility、audit design、check my site against best practices

## 工作流（按顺序执行）

### 第一步：确认审查范围

- 若用户已指定文件（如 index.html、styles.css）→ 直接使用。
- 若未指定 → 询问「要审查哪些文件？」或推荐项目内主要 UI 文件（如 index.html、styles.css、script.js）。

### 第二步：获取最新规范

在每次审查前拉取最新规则：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

使用 WebFetch / HTTP 工具获取该 URL 内容，其中包含完整规则与输出格式说明。

### 第三步：读取文件并逐条对照

- 读取用户指定的文件内容。
- 按 command.md 中的规则逐条检查（Accessibility、Focus States、Forms、Animation、Typography、Content Handling、Images、Performance、Navigation & State、Touch & Interaction、Safe Areas、Dark Mode、Locale & i18n、Hydration Safety、Hover States、Content & Copy、Anti-patterns 等）。

### 第四步：输出结果

按规范要求的格式输出：

- **按文件分组**。
- **格式**：`file:line - 问题描述`（VS Code 可点击跳转）。
- **简洁**：只写问题 + 位置，无冗长解释，除非修复方式不直观。

示例：

```text
## index.html

index.html:23 - icon button missing aria-label
index.html:18 - image missing alt

## styles.css

styles.css:42 - outline-none without focus-visible replacement
styles.css:55 - transition: all → list properties

## script.js

✓ pass
```

## 规则类别速览（完整规则以 command.md 为准）

- **Accessibility**：aria-label、alt、aria-hidden、aria-live、语义 HTML、标题层级、skip link
- **Focus States**：可见 focus、不用 outline-none 且无替代、:focus-visible
- **Forms**：autocomplete、name、label、不阻止 paste、错误内联
- **Animation**：prefers-reduced-motion、transform/opacity、不 transition: all
- **Typography**：`…` 非 `...`、弯引号、tabular-nums
- **Anti-patterns**：user-scalable=no、onPaste preventDefault、transition: all、无 aria-label 的图标按钮、图片无尺寸

## 输出原则

- 高信噪比：只写问题与位置。
- 无前言：直接输出 `## 文件名` + 条目。
- 无解释：除非修复方式非显而易见。
