---
description: 风格画廊：新建风格、优化已有风格的完整流程与质量标准
---

# 风格画廊工作流

本规则指导 Agent 完成「新建风格」与「优化已有风格」两类任务，保证预览页、提示词、画廊小框三处一致且层次丰富。

---

## 〇、关键词驱动的新建流程（前置）

用户提供关键词时，或 **Agent 自行从 `style-gallery-skills/KEYWORDS.md` 选取关键词** 时，按以下顺序执行：

1. **搜索**
   - 用 `npx skills find <英文关键词>` 在 skills.sh 生态中搜索
   - 或查阅 `style-gallery.html` 的 `styles` 数组，看是否已有该风格
   - 关键词来源：用户提供，或 Agent 读取 KEYWORDS.md 中的「可搜关键词示例」

2. **若无匹配**：确定风格 id，执行「一、新建风格的完整流程」

3. **若有匹配**：可引用现有 SKILL；若该风格尚未进画廊，则执行「一、新建风格的完整流程」

---

## 一、新建风格的完整流程

执行顺序固定：**先检查 SKILL（无则调用 skill-creator）→ web search（必须）→ 预览页 → 提示词 → 画廊小框**。

### 0a. 检查并创建 SKILL（必须执行）

新建任何风格时，先检查 `style-gallery-skills/<风格id>/` 下是否已有对应 SKILL。

- **若无**：调用 **skill-creator** 技能（`.cursor/skills/skill-creator/SKILL.md`）创建该风格的 SKILL，放入 `style-gallery-skills/<风格id>/`
- **若有**：可引用现有 SKILL 作为参考，跳过此步

**适用场景**：无论用户直接说「新建 xxx 风格」，还是经关键词搜索后新建，都执行此检查。

### 0b. Web Search（必须执行）

新建任何风格前，**一律必须先进行 web search**，再动手。不依赖自认熟悉程度。

- **搜索词**：`<风格名> design`、`<风格名> UI`、`<风格名> CSS`、`<风格名> best practices`
- **目的**：获取该风格的视觉特征、参考范例、实现技巧，避免首版就「平平无奇」

**搜索产出（必须做到，否则禁止进入下一步）**：

1. **必须执行 1～2 次 web_search**，用上述搜索词或合理变体（如加 `color`、`font`、`inspiration`）。
2. **必须把查到的要点按以下五类列出**（按该风格适用性取舍，至少覆盖其中 3 类；能落地的写色号/字体名/具体描述）：
   - **1. 色彩体系**：主色（品牌/核心情绪）、辅助色与点缀色（如 CTA 按钮）、中性色（背景/边框/文字，对比度与呼吸感）。
   - **2. 字体排版**：字体族（衬线/无衬线/等宽/像素等）、层级结构（字号、字重、行距，阅读路径）。
   - **3. 布局与空间**：栅格系统、留白程度（密集 vs 高级感）、对齐方式（居中/左对齐等）。
   - **4. 视觉元素与图像学**：摄影 vs 插画倾向、图标风格（线性/面性）、UI 组件形态（圆角/直角、阴影深浅/扁平）。
   - **5. 动效与交互反馈**：转场动画、微交互（hover 反馈、加载态如 Skeleton 等）。
3. **未列出上述「查到的要点」之前，禁止进入「1. 创建预览页」**。
4. **创建预览页、编写 prompt、做画廊小框时，必须依据上述要点**：在总结或注释中显式写出「根据搜索得到的 X，在预览页做了 Y」或等价说明，避免敷衍了事。

### 1. 创建预览页

- **路径**：`public/style-previews/N-{id}.html`（N 为 1-based 序号，id 与 style-gallery 中 `id` 一致）
- **结构**：完整 HTML，含 `<title>`、字体、内联 `<style>`、语义化结构
- **必须包含**：
  - 返回链接：`href="../../style-gallery.html"`
  - 标题、副标题、按钮、卡片等示例元素
  - 至少 3 张 `.preview__card`
- **质量标准**：层次丰富（见下文「优化：预览页」）；**须含鼠标悬停（hover）交互**，见「二、优化已有风格」之 **1b. 鼠标悬停（hover）必做**。

### 2. 编写提示词

- **位置**：`style-gallery.html` 中 `styles` 数组，对应 `prompt` 字段
- **要求**：描述该风格的实际视觉与实现，便于 AI 按提示复现
- **格式**：一段话，包含：背景、配色、字体、关键元素（边框、阴影、装饰）、可选项（动效、发光等）

### 3. 添加画廊小框

- **位置**：`style-gallery.html` 的 `<style>` 内
- **选择器**：`.style-card__preview--{preview}`（preview 来自 `styles[i].preview`）
- **实现**：仅用 `.style-card__preview-inner` 及其 `::before`、`::after` 两个伪元素
- **要求**：小框是预览页的「浓缩版」，体现该风格 2–3 个核心元素

### 4. 登记到 styles 数组

在 `styles` 中追加一项：

```js
{ id: 'xxx', name: '展示名', preview: 'xxx', prompt: '...' }
```

- `id`：文件名中的 id，如 `glassmorphism`、`8bit-pixel`
- `preview`：用于 `.style-card__preview--{preview}` 的类名；**禁止复用**，每个风格必须有自己独一无二的小框样式

---

## 二、优化已有风格的流程

顺序：**先 web search（必须）→ 预览页 → 提示词 → 画廊小框**。三者顺序不可颠倒：先优化预览页，再按预览页内容优化 prompt 和小框；prompt 与小框均以预览页为唯一参照。

### 0. Web Search（必须执行）

优化任何风格前，**一律必须先进行 web search**，再动手改。不依赖自认熟悉程度。

- **搜索词**：`<风格名> design`、`<风格名> UI`、`<风格名> CSS`、`<风格名> best practices`
- **示例**：`game UI HUD design`、`glassmorphism CSS`、`8-bit pixel UI`、`neumorphism web design`、`Dead Space HUD`
- **目的**：获取视觉灵感、参考范例、实现技巧，避免「自认为懂实则不够好」

**搜索产出（必须做到，否则禁止进入下一步）**：

1. **必须执行 1～2 次 web_search**，用上述搜索词或合理变体（如加 `color`、`font`、`inspiration`、`best practices`）。
2. **必须把查到的要点按以下五类列出**（按该风格适用性取舍，至少覆盖其中 3 类；能落地的写色号/字体名/具体描述）：
   - **1. 色彩体系**：主色（品牌/核心情绪）、辅助色与点缀色（如 CTA 按钮）、中性色（背景/边框/文字，对比度与呼吸感）。
   - **2. 字体排版**：字体族（衬线/无衬线/等宽/像素等）、层级结构（字号、字重、行距，阅读路径）。
   - **3. 布局与空间**：栅格系统、留白程度（密集 vs 高级感）、对齐方式（居中/左对齐等）。
   - **4. 视觉元素与图像学**：摄影 vs 插画倾向、图标风格（线性/面性）、UI 组件形态（圆角/直角、阴影深浅/扁平）。
   - **5. 动效与交互反馈**：转场动画、微交互（hover 反馈、加载态如 Skeleton 等）。
3. **未列出上述「查到的要点」之前，禁止进入「1. 优化预览页」**。
4. **优化预览页、提示词、画廊小框时，必须依据上述要点**：在总结或回复中显式写出「根据搜索得到的 X，在预览页/小框做了 Y」或等价说明，确保优化是「用查到的资料去改」，而不是敷衍了事。

### 1. 优化预览页

**目标**：层次更丰富，避免「平平无奇」。

| 手段 | 示例 |
|------|------|
| 背景分层 | 渐变 + 光晕/径向渐变 + 网格/纹理 |
| 前景装饰 | 散落色块、角标、边框、分隔线 |
| 面板化 | 主内容放在带边框/描边/阴影的「框」内 |
| 动效 | 呼吸脉动、扫描线、雷达旋转、hover 反馈 |
| 氛围层 | 扫描线、噪点、暗角、光晕 |
| 字体 | 风格化字体（Orbitron、Press Start 2P 等） |

**参考范例**：以当前项目中层次最丰富的预览页为参考，可打开以下文件对照：

- `public/style-previews/1-glassmorphism.html`
- `public/style-previews/2-8bit-pixel.html`
- `public/style-previews/3-game-ui-design.html`
- `public/style-previews/18-cute.html`
- `public/style-previews/21-cyberpunk.html`

若项目内预览页有更新，优先参考效果最佳的那几页，而不是死记固定描述。

**注意**：优化时 web search 为必须步骤，无论自认是否熟悉。

### 1b. 鼠标悬停（hover）必做

**要求**：每个预览页必须为可交互元素添加明确的鼠标悬停（hover）反馈，与 1～7、18、21 等参考页一致。新建或优化预览页时均须执行，不可遗漏。

| 元素 | 必做 hover 效果 | 示例 |
|------|-----------------|------|
| 返回链接 | 颜色变化 + 轻微位移 | `color` 加深；`transform: translateX(-4px)` |
| 按钮 | 抬升或视觉强调 | `transform: translateY(-1px)` ~ `translateY(-2px)` 或 背景/边框/阴影变化 |
| 卡片 | 抬升 + 阴影/边框变化 | `transform: translateY(-2px)` ~ `translateY(-4px)`；`box-shadow` 加深、`border-color` 变亮 |

**实现**：为对应选择器添加 `transition`（如 `transition: transform 0.2s, box-shadow 0.2s`），再写 `:hover` 规则。无按钮的页面可为 pull quote、scale 行等可感知块添加 hover（如边框/颜色微变）。

**禁止**：优化或新建预览页后，仅改静态样式而无任何 hover 反馈。

### 2. 优化提示词

**目标**：让 AI 能按提示复现该风格，避免抽象、空洞、无法落地的描述。

| 手段 | 示例 |
|------|------|
| 背景具体化 | 深色渐变（#0a0e14→#0d1117）、径向光晕（radial-gradient at 50% 0%）、网格（repeating-linear-gradient 2px）、暗角、扫描线 |
| 配色指名 | 主色系（蓝紫/绿青/霓虹黄粉）、语义色（HP 红/MP 蓝）、边框色（rgba 透明度） |
| 字体指名 | Orbitron、Press Start 2P、SF Pro 气质、等宽、圆润款 |
| 关键元素枚举 | 毛玻璃（backdrop-blur 12–16px）、厚边框（border-top/bottom 6px）、硬阴影（box-shadow 5px 5px 0 #000）、发光（box-shadow 0 0 12px） |
| 可落地实现 | rgba(0,0,0,0.2)、border-radius 10–14px、hover 时 translateY(-4px)、active 时阴影缩小 |
| 可选项 | 动效（脉动、扫描线旋转）、发光、可选 CRT/噪点层 |

**参考范例**：以 `style-gallery.html` 中效果好的 `prompt` 为参考，如 glassmorphism、8bit-pixel、game-ui-design、cyberpunk、retro-css、cute、editorial、minimal、skeuomorphic 等。

**风格覆盖**：科技/游戏/赛博类侧重背景、发光、边框；极简/杂志类侧重留白、字体、单一强调色；可爱/拟物类侧重质感、圆角、Pastel/暖色、材质隐喻。

**禁止**：禁止只写「科技感」「高级感」等抽象词而不写实现；禁止漏掉配色或字体；禁止过长（超过 2–3 句）或过短（少于关键要素）。

**自检**：优化完成后逐项确认——背景、配色、字体、关键元素、可落地实现 是否都提到；对照预览页，prompt 能否引导 AI 复现该视觉。

**注意**：优化提示词时，先打开预览页对照，逐项检查背景、配色、字体、关键元素是否已写进 prompt；避免「看起来像」而写不出实现细节。

### 3. 优化画廊小框

**目标**：小框是预览页的「浓缩版」，让人一眼看出风格；而非通用卡片或纯色块。

| 手段 | 示例 |
|------|------|
| 背景分层 | 渐变 + 光晕 + 网格（与预览页一致）；`linear-gradient` + `radial-gradient` + `repeating-linear-gradient` |
| 主面板（::before） | 居中大块、带边框/描边/阴影；模拟预览页的主内容区 |
| 装饰块（::after） | 角标、雷达圆框、色条、散落方块、发光条；用 `box-shadow` 可生成多块 |
| 伪元素分工 | `::before` 做主面板，`::after` 做 1–2 个装饰；或反之 |
| 风格特征强化 | 8-bit 用硬边框+散落彩色方块；glass 用半透明+描边；game 用雷达+左侧色条；retro 用 border-y-6 厚边框 |

**参考范例**：以 `style-gallery.html` 中层次丰富的小框为参考，可对照以下选择器：

- `.style-card__preview--glass`（毛玻璃 + 半透明面板）
- `.style-card__preview--pixel`（网格背景 + 主面板 + 散落方块 box-shadow）
- `.style-card__preview--game`（渐变 + 雷达圆 + 左侧色条面板）
- `.style-card__preview--retro-css`（扫描线背景 + border-y-6 主框 + 按钮条）
- `.style-card__preview--cute`（渐变 + 圆角块 + 心形装饰）
- `.style-card__preview--cyberpunk`（霓虹发光条）

**box-shadow 技巧**：用 `box-shadow` 可生成多块装饰，格式 `box-shadow: 2px 2px 0 #4a6a9a, 24px -16px 0 #8a4a6a, -22px 18px 0 #4a8a6a, ...`，每段为「x y blur color」。

**禁止**：禁止纯色块（单色无层次）；禁止只用单伪元素（至少体现 2 个核心元素）；禁止与预览页配色、主元素明显不一致。

**极简风格**：minimal、clean 等风格可适当简化，不必强行凑满两个伪元素；主面板 + 一条细线或小色块即可。

**自检**：对照预览页截图，小框的 2–3 个核心元素（背景、主面板、装饰）是否清晰可见；配色与预览页是否对应。

**注意**：仅用 `::before`、`::after` 两个伪元素；可用 `box-shadow` 生成多块装饰（如 8-bit 的散落方块）；小框配色与预览页一致。

### 4. 用户反馈「不够好」时的回退

若用户反馈「层次不够」「平平无奇」「没有那种感觉」等，**先再执行一轮 web search**，再针对性增强。

- 不要在原基础上小修小补，应基于新的搜索结果重新审视
- 可换搜索词或加限定词（如「best」「inspiration」「CSS implementation」）

---

## 三、技术约束

| 项目 | 约束 |
|------|------|
| 预览页链接 | Live Server 5500 时用 `../../style-gallery.html`；部署后通常为 `/style-gallery.html` |
| preview 类名 | **禁止复用**，每个风格必须有自己的 `.style-card__preview--{xxx}`，小框样式独一无二 |
| 小框伪元素 | 仅 `::before`、`::after`，可用 `box-shadow` 生成多块（如 8-bit 散落方块） |
| 多背景 | `background` 可叠多层 `linear-gradient`、`radial-gradient`、`repeating-linear-gradient` |
| 画廊编号 | `previewPage = (i + 1) + '-' + s.id + '.html'`，i 为 styles 数组下标 |
| N 的计算 | 新建时 N = 当前 `styles` 数组长度 + 1（即新风格在数组中的下标 + 1） |
| id 命名 | 小写 kebab-case，如 `glassmorphism`、`8bit-pixel`、`game-ui-design`，与文件名 `N-{id}.html` 的 id 一致 |
| preview 命名 | 每个风格必须有唯一的 preview 类；可与 id 对应，如 `glass`→glassmorphism、`8bit-pixel`→8bit-pixel |

---

## 四、截图视觉检查（自动执行，无需用户操作）

完成预览页/提示词/画廊小框的优化后，**执行三轮截图 → 视觉检查 → 迭代优化**。全程由 Agent 自动完成，无需用户手动操作。

### 4.1 执行方式

1. **运行截图脚本**：`node scripts/screenshot-preview.js <预览页文件名>` 或 `npm run screenshot -- 4-retro-css`  
   - 例：`node scripts/screenshot-preview.js 4-retro-css`  
   - 文件名格式：`N-{id}`（不含 .html），如 `1-glassmorphism`、`4-retro-css`

2. **输出**：截图保存到 `screenshots/<文件名>.png`（如 `screenshots/4-retro-css.png`）

3. **截图范围**：整页预览（`fullPage: true`），视口宽度 1200px，保证布局一致

### 4.2 三轮迭代流程

每一轮**必须**执行完整闭环：**截图 → 读取图片 → 看图反思 → 查资料（可选）→ 修改 → 下一轮**。三轮都要真正参与修改，而非只看不改。

| 轮次 | Agent 执行 |
|------|------------|
| 第 1 轮 | 完成初版优化（预览页/提示词/小框）→ 运行 `node scripts/screenshot-preview.js <id>` → **读取 `screenshots/<id>.png` 图片** → 看图做视觉检查 → **反思/自省：哪些不够好？** → 必要时 web search 找参考 → **根据反思修改预览页/提示词/小框** |
| 第 2 轮 | 修改后 → 再次运行截图脚本 → **再次读取截图** → 看图 → **再次反思：还有哪些可改进？** → 必要时查资料 → **再次修改** |
| 第 3 轮 | 修改后 → 最后一次截图 → **读取截图** → 看图 → **最终反思** → 若仍有明显问题则再改一次；若无则确认完成 |

**关键**：Agent 必须**亲自读取截图文件**（`read_file` 或 `read` 打开 PNG），根据真实画面反思、查资料、修改；不能「假设没问题」而跳过修改。

**覆盖范围**：视觉检查发现问题时，需同时排查并修改 **预览页、提示词、画廊小框** 三处，而非只改预览页。

### 4.3 视觉检查要点

- 字号是否足够大、可读
- 背景层次是否丰富（是否纯色/单调）
- 预览页与画廊小框是否视觉一致；小框配色、主元素（面板/装饰）与预览页是否对应
- 提示词与预览页是否一致；能否引导 AI 按 prompt 复现该视觉
- 整体是否「平平无奇」、缺层次感

### 4.4 前置条件

- 项目内已存在 `scripts/screenshot-preview.js`
- 已安装 Playwright 及 Chromium：`npm install` 后执行 `npx playwright install chromium`
- 首次运行若报错「Executable doesn't exist」，执行 `npx playwright install` 完成浏览器下载

---

## 五、验收与验证

**完成后**：Agent 已通过三轮截图视觉检查；用户可本地打开 `style-gallery.html` 及对应预览页做最终确认。

---

## 六、检查清单

**新建风格**：

- [ ] 若 `style-gallery-skills/<id>/` 无对应 SKILL，已调用 skill-creator 创建
- [ ] 已执行 web search 并**按五类列出查到的要点**（色彩体系/字体排版/布局与空间/视觉元素与图像学/动效与交互，至少 3 类）；预览页与 prompt、小框**显式依据该要点**
- [ ] `public/style-previews/N-{id}.html` 已创建且层次丰富（N = styles.length + 1，id 为 kebab-case）
- [ ] `styles` 数组已新增一项
- [ ] `.style-card__preview--{preview}` 已添加且能体现风格
- [ ] 提示词与预览页一致

**优化风格**：

- [ ] 已执行 web search 并**按五类列出查到的要点**（色彩体系/字体排版/布局与空间/视觉元素与图像学/动效与交互，至少 3 类）；**未列出要点前未进入优化步骤**；预览页/提示词/小框**显式依据该要点**修改
- [ ] 预览页已增强（背景/装饰/动效/氛围）
- [ ] 提示词已按预览页重写（背景/配色/字体/关键元素/可落地 均已包含）
- [ ] 画廊小框已更新，2–3 个核心元素清晰可见，配色与预览页一致
- [ ] 已执行三轮截图视觉检查（每轮：截图 → 读取 PNG → 看图反思 → 必要时查资料 → 修改预览页/提示词/小框）；三轮均有实际修改或明确「无问题」结论
- [ ] 若用户反馈不够好：已再搜一轮 web search 并针对性增强
