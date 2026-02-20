/**
 * 构建前：将根目录 styles.css 同步到 public/styles.css，保证部署用最新样式。
 * 若根目录无 styles.css 则跳过（仅用 public 内已有文件）。
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'styles.css');
const dest = path.join(root, 'public', 'styles.css');

if (!fs.existsSync(src)) {
  console.log('scripts/copy-styles.js: 根目录无 styles.css，跳过');
  process.exit(0);
}

const publicDir = path.join(root, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('scripts/copy-styles.js: 已同步 styles.css -> public/styles.css');
