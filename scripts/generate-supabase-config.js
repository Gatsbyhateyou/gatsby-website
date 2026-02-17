/**
 * 构建时根据环境变量生成 public/supabase-config.js（用于 Vercel 等部署）。
 * 本地未设置 SUPABASE_URL / SUPABASE_ANON_KEY 时不写入，部署时在托管平台配置即可。
 */
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log('scripts/generate-supabase-config.js: 未设置 SUPABASE_URL 或 SUPABASE_ANON_KEY，跳过生成。');
  process.exit(0);
}

const publicDir = path.join(__dirname, '..', 'public');
const outPath = path.join(publicDir, 'supabase-config.js');
const content = [
  '// 由构建脚本根据环境变量生成，请勿提交',
  "window.__SUPABASE_URL__ = '" + url.replace(/'/g, "\\'") + "';",
  "window.__SUPABASE_ANON_KEY__ = '" + key.replace(/'/g, "\\'") + "';",
  ''
].join('\n');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(outPath, content, 'utf8');
console.log('scripts/generate-supabase-config.js: 已生成 public/supabase-config.js');
