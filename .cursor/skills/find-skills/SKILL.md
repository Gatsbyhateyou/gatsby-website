---
name: find-skills
description: 在开放 Agent 技能生态（skills.sh）中搜索、推荐并安装技能。Use when the user says 找技能、有没有做X的技能、skills.sh 怎么用、想扩展 Agent 能力、搜技能、安装一个做XX的技能、npx skills.
---

# Find Skills（技能发现与安装）

在 [skills.sh](https://skills.sh/) 开放技能生态中帮用户**搜索、推荐并安装**技能（Skills）。技能是扩展 Agent 能力的模块化包（知识、工作流、工具）。

## 何时使用本技能

用户出现以下任一情况时使用：

- 问「有没有做 X 的技能」「找一下做 X 的技能」
- 问「怎么做 X」且 X 可能是已有技能能完成的常见任务
- 问「你能做 X 吗」且 X 是某种专门能力
- 想扩展 Agent 能力、搜模板/工作流/工具
- 提到在某一领域需要帮助（设计、测试、部署、文档等）
- 提到 skills.sh、npx skills、想安装某个技能

## 前置条件

- 依赖 **Skills CLI**：`npx skills`（无需用户提前安装，直接使用 `npx skills` 即可）。
- 浏览与搜索技能：<https://skills.sh/>

## 工作流（按顺序执行）

### 第一步：理解需求

确认：
1. **领域**：如 React、测试、部署、文档、设计等
2. **具体任务**：如写测试、做 PR 审查、写 changelog、优化性能
3. 是否「找一个现成技能」为主，还是「直接帮做」为主；若为前者则继续本技能。

### 第二步：搜索技能

在项目根或用户指定目录执行：

```bash
npx skills find [查询词]
```

**查询示例**（根据用户需求替换）：

| 用户需求示例           | 建议查询                    |
|------------------------|-----------------------------|
| React 应用更快/性能优化 | `react performance`         |
| 帮我做 PR 审查          | `pr review`                |
| 写 changelog            | `changelog`                |
| 写测试 / E2E            | `testing` / `playwright`   |
| 部署 / CI               | `deploy` / `ci-cd`         |
| 文档 / README           | `docs` / `readme`          |
| 代码审查 / 最佳实践     | `review` / `best-practices`|
| UI / 无障碍             | `ui` / `accessibility`     |

**搜索技巧**：用具体关键词（如 "react testing"）；若无结果可换近义词（如 deployment、ci-cd）。

### 第三步：把结果给用户

对搜索到的技能，给出：
1. **技能名称** + **一句话说明**（做什么）
2. **安装命令**（来自搜索结果，形如 `npx skills add <owner/repo@skill>`）
3. **详情链接**：`https://skills.sh/<owner>/<repo>/<skill>`（若有）

示例回复格式：

```
找到可能符合的技能：「xxx」，用于 xxx。

安装命令：
npx skills add <owner/repo@skill>

更多说明：https://skills.sh/...
```

### 第四步：可选代用户安装

若用户明确说「装上」「安装」「帮我装」：

```bash
npx skills add <owner/repo@skill> -g -y
```

- `-g`：用户级（全局）安装  
- `-y`：跳过确认

在**用户未明确要求安装**时，只给出安装命令，不自动执行安装。

## 常见技能分类（便于选查询词）

| 类别       | 示例查询词                              |
|------------|-----------------------------------------|
| Web 开发   | react, nextjs, typescript, css, tailwind|
| 测试       | testing, jest, playwright, e2e         |
| DevOps     | deploy, docker, kubernetes, ci-cd      |
| 文档       | docs, readme, changelog, api-docs      |
| 代码质量   | review, lint, refactor, best-practices  |
| 设计       | ui, ux, design-system, accessibility   |
| 效率       | workflow, automation, git              |

## 未找到技能时

1. 明确告知：未找到与「xxx」相关的技能。
2. 说明仍可直接用当前能力帮用户完成该任务，询问是否继续。
3. 若用户常做同类事，可提示可自建技能：`npx skills init my-xyz-skill`。
