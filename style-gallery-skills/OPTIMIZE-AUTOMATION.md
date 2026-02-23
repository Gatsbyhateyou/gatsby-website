# 风格优化自动化方案

目标：按顺序、严格按 workflow 优化每个风格，且**每次只做一个**，避免「任务一多就敷衍」。可选「全程不再发指令」的全自动方式。

---

## 方案 B：脚本输出下一项任务（推荐，无需 API）

**你每次只需：运行一次脚本 → 复制一句指令 → 新开对话粘贴发送。** 不用自己想、不用打字。

### 使用步骤

1. **运行脚本**（在项目根目录）：
   ```bash
   npm run next-style
   ```
   或：
   ```bash
   node scripts/next-style-to-optimize.js
   ```

2. **复制终端里输出的整段指令**（或打开 `style-gallery-skills/next-task.txt` 复制）。

3. **新开一个 Cursor 对话**，粘贴该指令并发送。Agent 会只收到「优化第 N 个」这一条任务，按 workflow 认真做完。

4. 做完后，要优化下一个时**重复 1～3**。脚本会自动前进到下一个序号，无需改任何配置。

### 进度与重置

- 进度保存在 `style-gallery-skills/optimize-progress.json`，字段 `nextToDoIndex` 为下一次要做的**序号**（1-based）。
- 当前默认从 **13** 开始（1～12 已优化）。
- 要从头重做：把 `optimize-progress.json` 改为 `{ "nextToDoIndex": 1 }`。
- 要从某序号开始：改为 `{ "nextToDoIndex": 14 }` 即从第 14 个开始。

### 小结

- **你不会再「想指令」**：指令由脚本生成。
- **每次对话只做一个风格**：质量更稳。
- **你仍需要**：每做完一个，运行一次脚本并把新指令贴到新对话（约 10 秒）。

---

## 方案 A：全程不发指令（需 API，真正「跑一次就连续做」）

若要**完全**不用再发指令（跑一次就自动把 13～26 全部做完），需要由**程序**代替你调用 AI 并改文件，即使用**外部 AI API + 本地脚本**。

### 思路

1. 脚本循环：N = 13 到 26（或从 `optimize-progress.json` 读到 13）。
2. 每一轮：用 **Claude API** 或 **OpenAI API**，把「当前要优化第 N 个风格」+ workflow 全文 + 当前预览页内容等塞进请求；API 返回「要改哪些文件、怎么改」。
3. 脚本解析 API 返回，执行改文件、跑截图命令，再 N+1，直到全部做完。

### 前置条件

- 有 **Anthropic API Key** 或 **OpenAI API Key**（需能调「可改文件」的 Agent/Composer 类接口，或自己解析模型输出并执行写文件）。
- 若 API 支持 **tool use**（read_file / write_file / run_command），可由模型主动要读哪个文件、改哪几处，脚本只负责执行 tool 并回传结果，实现最稳。

### 可选实现方式

- **方式 1**：用 Cursor 的「从命令行传入 prompt 并执行」能力（若存在）。写一个循环脚本，每次传入「优化第 N 个」的指令；你只运行一次脚本，脚本内部多次调用 Cursor。
- **方式 2**：用 Node 写 `scripts/auto-optimize-styles-api.js`，内部用 `@anthropic-ai/sdk` 或 `openai`，按上面 2～3 步循环，每轮传 workflow + 风格信息，根据返回改文件、跑截图。需要你在项目里装 SDK 并配置环境变量 `ANTHROPIC_API_KEY` 或 `OPENAI_API_KEY`。

若你提供 API Key 的配置方式（例如只接受环境变量），我可以按你当前项目结构写出 `auto-optimize-styles-api.js` 的完整骨架（含读 workflow、读进度、调用 API、解析并应用改动的约定）。

---

## 建议

- **先采用方案 B**：`npm run next-style` → 复制 → 新对话粘贴。几乎零配置，立刻可用，且能保证「每次只做一个、按 workflow 做」。
- 若你确实需要「完全不用再点」：再上方案 A，用 API + 脚本做全自动；需要你提供 API 与可执行改文件的权限。
