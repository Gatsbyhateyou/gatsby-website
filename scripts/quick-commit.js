#!/usr/bin/env node
/**
 * 一键提交：git add -A && git commit -m "<message>"
 * 用法：node scripts/quick-commit.js [提交说明]
 * 或：  npm run commit -- [提交说明]
 * 无参数时使用默认说明 "chore: update"
 */
const { execSync } = require('child_process');
const message = process.argv.slice(2).join(' ').trim() || 'chore: update';

try {
  execSync('git add -A', { stdio: 'inherit' });
  execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  console.log('Done: add + commit');
} catch (e) {
  process.exit(e.status || 1);
}
