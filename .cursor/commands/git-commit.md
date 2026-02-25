# Git 提交（本仓库工作流）

按本项目的提交约定执行一次 commit。

## 步骤

1. **仅提交（不推送）**
   - 若我未写提交说明：在项目根目录执行 `npm run commit`（默认 message：`chore: update`）
   - 若我写了提交说明：执行 `npm run commit -- <我提供的说明>`（说明中不要以 `--` 开头）

2. **若我要求「提交并推送」**
   - 先按上一步完成 commit，再执行 `git push`

## 约定

- 本仓库用 `scripts/quick-commit.js`：`git add -A` + `git commit -m "..."`，无需单独 stage。
- 不要替我自己编造 commit message，除非我明确给出或同意用默认。
