/**
 * 输出「下一个要优化的风格」任务，并自动前进进度。
 * 用法：node scripts/next-style-to-optimize.js  或  npm run next-style
 * 输出：指令会自动写入剪贴板，可直接 Ctrl+V 粘贴到 Cursor；同时写入 next-task.txt 并打印到终端。
 * 进度：style-gallery-skills/optimize-progress.json 中的 nextToDoIndex（1-based）
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function copyToClipboard(text, filePathUtf8) {
  const plat = process.platform;
  if (plat === 'win32' && filePathUtf8) {
    // Windows: clip 会乱码，改用 PowerShell 按 UTF-8 读文件再写入剪贴板
    const psCmd = `Set-Clipboard -Value (Get-Content -LiteralPath '${filePathUtf8.replace(/'/g, "''")}' -Raw -Encoding UTF8)`;
    spawn('powershell', ['-NoProfile', '-Command', psCmd], { stdio: 'ignore' });
    return;
  }
  let cmd, args, opts;
  if (plat === 'win32') {
    cmd = 'clip';
    args = [];
    opts = { shell: true, stdio: ['pipe', 'ignore', 'ignore'] };
  } else if (plat === 'darwin') {
    cmd = 'pbcopy';
    args = [];
    opts = { stdio: ['pipe', 'ignore', 'ignore'] };
  } else {
    cmd = 'xclip';
    args = ['-selection', 'clipboard'];
    opts = { stdio: ['pipe', 'ignore', 'ignore'] };
  }
  const p = spawn(cmd, args, opts);
  p.stdin.end(Buffer.from(text, 'utf8'), 'utf8');
  p.on('error', () => {});
}

const baseDir = path.resolve(__dirname, '..');
const galleryPath = path.join(baseDir, 'style-gallery.html');
const progressPath = path.join(baseDir, 'style-gallery-skills', 'optimize-progress.json');
const taskOutputPath = path.join(baseDir, 'style-gallery-skills', 'next-task.txt');

function extractStyles(html) {
  const list = [];
  const re = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    list.push({ id: m[1], name: m[2] });
  }
  return list;
}

function main() {
  const html = fs.readFileSync(galleryPath, 'utf8');
  const styles = extractStyles(html);
  if (styles.length === 0) {
    console.error('Could not parse styles from style-gallery.html');
    process.exit(1);
  }

  let progress = { nextToDoIndex: 1 };
  if (fs.existsSync(progressPath)) {
    try {
      progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
    } catch (_) { /* ignore parse error */ }
  }

  const nextIndex = progress.nextToDoIndex;
  if (nextIndex > styles.length) {
    console.log('All styles done (nextToDoIndex > ' + styles.length + '). Reset optimize-progress.json to start over.');
    return;
  }

  const style = styles[nextIndex - 1];
  const previewFileName = nextIndex + '-' + style.id + '.html';
  const screenshotArg = nextIndex + '-' + style.id;

  const instruction = `请严格按照 @style-gallery-skills/style-gallery-workflow.md 优化第 ${nextIndex} 个风格（id: ${style.id}，名称：${style.name}）。只做这一个，完整执行：0. Web search（必须）→ 1. 优化预览页（层次丰富、居中、1b hover 必做）→ 2. 优化 prompt → 3. 优化画廊小框 → 4. 三轮截图并每轮读图反思与修改。预览页路径：public/style-previews/${previewFileName}；截图命令：node scripts/screenshot-preview.js ${screenshotArg}。`;

  // 前进进度
  progress.nextToDoIndex = nextIndex + 1;
  const skillsDir = path.dirname(progressPath);
  if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2), 'utf8');

  // 写入文件
  fs.writeFileSync(taskOutputPath, instruction, 'utf8');

  // 自动写入剪贴板（Windows 用 PowerShell UTF-8 读文件，避免乱码）
  copyToClipboard(instruction, taskOutputPath);

  console.log('--- 已复制到剪贴板，新开对话后直接 Ctrl+V 粘贴即可 ---\n');
  console.log(instruction);
  console.log('\n--- 下次将优化第 ' + progress.nextToDoIndex + ' 个 ---');
}

main();
