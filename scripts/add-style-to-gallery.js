#!/usr/bin/env node
/**
 * 将一个新风格接入画廊：追加 style-gallery.html、生成预览页、更新 index 与 KEYWORDS。
 * 用法：node scripts/add-style-to-gallery.js --id <id> --name <展示名> --preview <预览类型> --prompt <整段 prompt> [--keyword <关键词>] [--prompt-file <SKILL.md 路径>]
 * 若用 --prompt-file，会从 SKILL.md 中抽取「Prompt（供画廊复制）」段落作为 prompt，可省略 --prompt。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GALLERY_HTML = path.join(ROOT, 'style-gallery.html');
const PREVIEWS_DIR = path.join(ROOT, 'public', 'style-previews');
const INDEX_HTML = path.join(ROOT, 'public', 'style-previews', 'index.html');
const KEYWORDS_MD = path.join(ROOT, 'style-gallery-draft', 'KEYWORDS.md');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { keyword: '' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) out.id = args[++i];
    else if (args[i] === '--name' && args[i + 1]) out.name = args[++i];
    else if (args[i] === '--preview' && args[i + 1]) out.preview = args[++i];
    else if (args[i] === '--prompt' && args[i + 1]) out.prompt = args[++i];
    else if (args[i] === '--keyword' && args[i + 1]) out.keyword = args[++i];
    else if (args[i] === '--prompt-file' && args[i + 1]) out.promptFile = args[++i];
  }
  return out;
}

function extractFromSkill(mdPath) {
  const abs = path.isAbsolute(mdPath) ? mdPath : path.join(ROOT, mdPath);
  const content = fs.readFileSync(abs, 'utf8');
  const promptMatch = content.match(/##\s*Prompt（供画廊复制）\s*\n+([\s\S]*?)(?=\n##\s|$)/);
  if (!promptMatch) throw new Error('SKILL.md 中未找到「## Prompt（供画廊复制）」段落');
  const prompt = promptMatch[1].trim().replace(/\n+/g, ' ');
  const nameMatch = content.match(/^#\s+(.+?)(?:\s+UI)?\s*$/m);
  const nameFromFile = nameMatch ? nameMatch[1].trim() : null;
  return { prompt, nameFromFile };
}

function escapeForJsString(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ');
}

function escapeForHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nextPreviewNumber() {
  const names = fs.readdirSync(PREVIEWS_DIR).filter((n) => /^\d+-.+\.html$/.test(n));
  const nums = names.map((n) => parseInt(n.split('-')[0], 10)).filter((n) => !isNaN(n));
  return nums.length ? Math.max(...nums) + 1 : 1;
}

const PREVIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>风格展示 · {{TITLE}}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; min-height: 100vh; background: #fff; color: #111; padding: 3rem 2rem; }
    .preview { max-width: 560px; margin: 0 auto; }
    .preview__back { color: #666; text-decoration: none; margin-bottom: 2rem; display: inline-block; font-size: 0.9rem; }
    .preview__back:hover { color: #111; }
    .preview__title { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
    .preview__subtitle { color: #666; margin-bottom: 2.5rem; font-size: 0.95rem; }
    .preview__actions { display: flex; gap: 1rem; margin-bottom: 2.5rem; }
    .preview__btn { padding: 0.6rem 1.25rem; font-size: 0.9rem; border: none; background: #111; color: #fff; cursor: pointer; }
    .preview__cards { display: flex; flex-direction: column; gap: 1.5rem; }
    .preview__card { border-top: 1px solid #eee; padding-top: 1.5rem; }
    .preview__card h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.35rem; }
    .preview__card p { font-size: 0.9rem; color: #555; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="preview">
    <a href="../../style-gallery.html" class="preview__back">← 返回画廊</a>
    <h1 class="preview__title">{{TITLE}}</h1>
    <p class="preview__subtitle">{{SUBTITLE}}</p>
    <div class="preview__actions">
      <button type="button" class="preview__btn">主要</button>
    </div>
    <div class="preview__cards">
      <div class="preview__card"><h3>卡片一</h3><p>占位内容，可后续按风格改写。</p></div>
      <div class="preview__card"><h3>卡片二</h3><p>占位内容。</p></div>
      <div class="preview__card"><h3>卡片三</h3><p>占位内容。</p></div>
    </div>
  </div>
</body>
</html>
`;

function main() {
  const opts = parseArgs();
  if (opts.promptFile) {
    try {
      const extracted = extractFromSkill(opts.promptFile);
      opts.prompt = extracted.prompt;
      if (extracted.nameFromFile && !opts.name) opts.name = extracted.nameFromFile;
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }
  if (!opts.id || !opts.name || !opts.preview || !opts.prompt) {
    console.error('用法: node scripts/add-style-to-gallery.js --id <id> --name <展示名> --preview <预览类型> --prompt <prompt>');
    console.error('  若用 --prompt-file，可从 SKILL.md 第一行 # 标题提取展示名，可省略 --name');
    console.error('  或: --prompt-file style-gallery-skills/<id>/SKILL.md 替代 --prompt');
    console.error('可选: --keyword <关键词> 用于 KEYWORDS.md');
    process.exit(1);
  }
  if (!opts.keyword) opts.keyword = opts.id;

  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(opts.id)) {
    console.error('错误: --id 只能包含英文字母、数字和连字符，且不能以连字符开头。例如: my-style');
    process.exit(1);
  }

  if (!fs.existsSync(GALLERY_HTML)) {
    console.error('错误: 找不到 style-gallery.html，请确认在项目根目录下运行脚本。');
    process.exit(1);
  }
  let galleryCheck = fs.readFileSync(GALLERY_HTML, 'utf8');
  if (galleryCheck.includes("id: '" + opts.id + "'") || galleryCheck.includes('id: "' + opts.id + '"')) {
    console.error("错误: 画廊中已存在 id 为 \"" + opts.id + "\" 的风格，请换一个 --id 或勿重复运行。");
    process.exit(1);
  }
  if (!fs.existsSync(PREVIEWS_DIR)) {
    console.error('错误: 找不到 public/style-previews 目录。');
    process.exit(1);
  }
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('错误: 找不到 public/style-previews/index.html。');
    process.exit(1);
  }
  if (!fs.existsSync(KEYWORDS_MD)) {
    console.error('错误: 找不到 style-gallery-draft/KEYWORDS.md。');
    process.exit(1);
  }

  const N = nextPreviewNumber();
  const previewFileName = `${N}-${opts.id}.html`;
  const previewPath = path.join(PREVIEWS_DIR, previewFileName);
  if (fs.existsSync(previewPath)) {
    console.error('错误: 预览页已存在 ' + previewFileName + '，可能重复运行。请检查 --id 或删除该文件后再试。');
    process.exit(1);
  }

  const nameEscaped = opts.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const promptEscaped = escapeForJsString(opts.prompt);
  const newLine = `        { id: '${opts.id}', name: '${nameEscaped}', preview: '${opts.preview}', prompt: '${promptEscaped}' }`;

  // 1. style-gallery.html：在最后一个 ]; 前的条目后加逗号并追加新条目
  let gallery = fs.readFileSync(GALLERY_HTML, 'utf8');
  const arrayClose = gallery.indexOf('\n      ];');
  if (arrayClose === -1) {
    console.error('无法在 style-gallery.html 中定位 styles 数组末尾');
    process.exit(1);
  }
  const beforeClose = gallery.slice(0, arrayClose);
  const lastNewline = beforeClose.lastIndexOf('\n');
  const lastLine = beforeClose.slice(lastNewline + 1);
  const newLastLine = lastLine.trimEnd().endsWith(',') ? lastLine : lastLine.trimEnd() + ',';
  gallery =
    gallery.slice(0, lastNewline + 1) +
    newLastLine +
    '\n' +
    newLine +
    gallery.slice(arrayClose);
  fs.writeFileSync(GALLERY_HTML, gallery, 'utf8');
  console.log('已追加 style-gallery.html');

  // 2. 生成预览页（标题做 HTML 转义，避免 name 含 < > 等破坏页面）
  const titleSafe = escapeForHtml(opts.name);
  const previewHtml = PREVIEW_TEMPLATE
    .replace(/\{\{TITLE\}\}/g, titleSafe)
    .replace(/\{\{SUBTITLE\}\}/g, '由 add-style-to-gallery 生成，可后续按风格改写。');
  fs.writeFileSync(previewPath, previewHtml, 'utf8');
  console.log('已生成', path.relative(ROOT, previewPath));

  // 3. index.html：在 </ul> 前插入一行（兼容不同换行符）
  let index = fs.readFileSync(INDEX_HTML, 'utf8');
  const nameInIndex = escapeForHtml(opts.name);
  const li = `    <li><a href="${previewFileName}">${previewFileName}</a> — ${N}. ${nameInIndex}</li>\n  </ul>`;
  if (!index.includes('</ul>')) {
    console.error('错误: index.html 中未找到 </ul>，无法插入链接。');
    process.exit(1);
  }
  index = index.replace(/\s*<\/ul>/, '\n' + li);
  fs.writeFileSync(INDEX_HTML, index, 'utf8');
  console.log('已更新 style-previews/index.html');

  // 4. KEYWORDS.md：在「已做」表末尾（## 草稿拉过但未当风格采用 之前）插入一行
  let keywords = fs.readFileSync(KEYWORDS_MD, 'utf8');
  const keywordCell = opts.keyword.length > 22 ? opts.keyword.slice(0, 22) : opts.keyword.padEnd(22);
  const keywordsRow = `| ${keywordCell} | ${opts.id} | 备注 |`;
  const anchor = '## 草稿拉过但未当风格采用';
  const anchorIdx = keywords.indexOf(anchor);
  if (anchorIdx !== -1) {
    keywords = keywords.slice(0, anchorIdx).trimEnd() + '\n' + keywordsRow + '\n\n' + keywords.slice(anchorIdx);
  } else {
    keywords = keywords.trimEnd() + '\n' + keywordsRow + '\n';
  }
  fs.writeFileSync(KEYWORDS_MD, keywords, 'utf8');
  console.log('已更新 style-gallery-draft/KEYWORDS.md');

  console.log('');
  console.log('完成。若为新预览类型，请手动在 style-gallery.html 的 <style> 中增加 .style-card__preview--' + opts.preview + ' 的 CSS。');
}

main();
