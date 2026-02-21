# PRD 第一版与当前版并列对比

**说明**：在仓库与 Git 历史中**未找到**单独命名的「第一版 PRD」文件。本对比中的「第一版」由 **AGENT_HANDOFF.md** 与 **.cursor/rules/archive/project-memory.md** 中的内容整理而成（早期交接说明与项目长期记忆，可视为当时的需求/事实基线）。「当前版」即 **prd/PRD-001.md**（基于当前线上站点的完整产品需求文档）。

---

## 1. 文档定位与用途

| 维度 | 第一版（早期交接/记忆摘要） | 当前版（PRD-001） |
|------|-----------------------------|-------------------|
| **文档性质** | Agent 交接说明 + 项目记忆，偏「事实与约束」 | 正式产品需求文档，偏「产品定位 + 用户故事 + 验收」 |
| **目标读者** | 接手任务的 Agent | 产品/开发/协作方 |
| **是否含用户故事** | 否 | 是（按页面/功能拆故事 + 验收标准） |
| **是否含线框图/流程图** | 否 | 是（ASCII 布局 + Mermaid 站点地图/时序图） |

---

## 2. 项目与构建

| 维度 | 第一版 | 当前版 |
|------|--------|--------|
| **项目名** | 个人站「刘锦麟」，workspace `gatsby-website` | Lin's lab（刘锦麟个人站） |
| **技术实质** | Vite 静态站（非 Gatsby） | 同上 |
| **入口页** | index、diary、gallery 等；未列 Galaxy/skills | index、gallery、diary、Galaxy、**skills** 五入口 |
| **构建顺序** | generate-supabase-config → generate-analytics-config → vite build | **copy-styles** → generate-supabase-config → generate-analytics-config → vite build |
| **产出目录** | 写「部署产物在 public/」 | 明确「产出在 dist/，public/ 在构建时拷贝到 dist/ 根」 |

---

## 3. 页面与功能范围

| 维度 | 第一版 | 当前版 |
|------|--------|--------|
| **首页** | 未单独描述 | 标题 + 副标题 + 四张入口卡片（胶片集、AI 日记、星尘遗落、Skill 手册）+ 灵感垃圾桶 |
| **胶片集** | 未在 AGENT_HANDOFF 中展开；project-memory 有 GALLERY_PHOTOS、小写 .jpg、PostHog image_clicked | 瀑布流、灯箱、返回、埋点、约束小写 1.jpg…10.jpg |
| **AI 日记** | 手写 HTML 列表、格言（一言）、主题、灵感垃圾桶；**重点在日记顺序约定** | 时间正序、展开/收起、格言按北京时间日缓存、灵感垃圾桶内联实现、返回与主题 |
| **星尘遗落** | project-memory 提了 Galaxy 入口，未展开需求 | 独立一节：数据来源、Canvas 星尘、搜索、查看/删除、返回 |
| **Skill 手册** | 未出现 | 新页：Skills 列表与调用路径、返回首页 |

---

## 4. 日记约定（两版一致）

| 约定 | 第一版 | 当前版 |
|------|--------|--------|
| **顺序** | 最早在上，越往下越晚（02-14 → 02-15 → 02-16） | 同上，时间正序 |
| **新增位置** | 插在 `diary-section` 内**最下面**（最后一个 .diary-entry 之后） | 同上 |
| **禁止** | 禁止新日记插在列表顶部；禁止假设「最新置顶」 | 同上，并在验收标准中写明 |

---

## 5. 灵感垃圾桶与数据

| 维度 | 第一版 | 当前版 |
|------|--------|--------|
| **实现位置** | script.js 的 initIdeaBin()；diary 页内联一套 | 同上，并说明 diary 因 script.js 对 page-diary 跳过故单独接 ideaBinApi |
| **存储** | Supabase 可选集成（交接文档）；project-memory 明确 Supabase 持久化 + localStorage 回退 | Supabase 优先、失败回退 localStorage；表 inspirations(id, content, user_id, created_at) |
| **埋点** | PostHog idea_bin_used（page、timestamp、duration_seconds） | 同上，并补充「打开时记 ideaBinOpenTime」 |
| **与星尘关系** | 未在交接中写清 | 明确：星尘遗落页从 ideaBinApi.load() / localStorage 读同一数据源 |

---

## 6. 技术栈与集成

| 维度 | 第一版 | 当前版 |
|------|--------|--------|
| **前端** | 原生 HTML/CSS/JS，Vite 7 | 同上 |
| **Supabase** | 灵感持久化；配置为构建时生成 | 同上；并写表结构、RLS、仅用 anon key、环境变量名 |
| **Analytics** | GA4 + PostHog；analytics-config 构建时生成；PostHog 必须官方 stub 内联 | 同上；并区分 GA 做流量、PostHog 做行为（idea_bin_used、image_clicked） |
| **构建命令** | 两段式（supabase + analytics + vite） | 四段式（copy-styles + supabase + analytics + vite） |

---

## 7. 负面约束与避坑

| 第一版（AGENT_HANDOFF + project-memory） | 当前版（PRD 中的约束） |
|------------------------------------------|-------------------------|
| 禁止新日记插顶部；禁止假设最新置顶 | 同日记约定，并在验收中体现 |
| （project-memory）PostHog 必须 stub 内联；胶片小写 .jpg；git mv 两步改大小写；不改 build 不提交 generate-analytics-config；PowerShell 中文乱码；analytics-config 不提交；untracked 时注意当前目录 | 构建顺序、Supabase 仅 anon、胶片小写约束、部署后改 env 需 Redeploy 等写在「技术约束与构建」与「非功能性」中；详细避坑仍在 website-memory.mdc |

---

## 8. 当前版 PRD 多出的内容（相对第一版）

- **产品概述**：产品定位、目标用户、核心价值
- **站点地图**：Mermaid 图 + 页面清单表
- **全局能力**：主题、灵感垃圾桶、分析埋点的统一描述
- **按页面的用户故事 + 验收标准**：首页、胶片集、AI 日记、星尘遗落、Skill 手册、灵感垃圾桶（跨页）
- **ASCII 线框图**：首页布局、日记条目结构
- **灵感数据流**：Mermaid 时序图（用户 → 页面 → ideaBinApi → Supabase/localStorage）
- **数据与集成**：Supabase 表结构、Analytics 分工、本地回退 key
- **非功能性需求**：SEO/分享、无障碍、兼容与性能
- **Skill 手册**：整页与入口的完整描述
- **明确产出目录**：dist/ 与 public/ 关系

---

## 9. 文件引用

| 版本 | 来源文件 |
|------|----------|
| **第一版（整理自）** | `AGENT_HANDOFF.md`、`.cursor/rules/archive/project-memory.md` |
| **当前版** | `prd/PRD-001.md` |

若你之后找到真正命名的「第一版 PRD」文件（例如在其他文件夹或备份里），可以把其路径或内容发给我，我可以把本对比中的「第一版」列替换为那份文档的逐段对照。
