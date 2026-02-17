/**
 * 构建时根据环境变量生成 public/analytics-config.js（用于 Vercel 等部署）。
 * 未设置时跳过生成；部署时在托管平台配置 GA_MEASUREMENT_ID、POSTHOG_KEY、POSTHOG_HOST 即可。
 */
const fs = require('fs');
const path = require('path');

// 避免未捕获异常导致 build 失败
try {
  run();
} catch (err) {
  console.error('scripts/generate-analytics-config.js:', err.message);
  process.exit(0); // 跳过生成，不中断构建
}

function run() {
const gaId = (process.env.GA_MEASUREMENT_ID || '').trim();
const phKey = (process.env.POSTHOG_KEY || '').trim();
const phHost = (process.env.POSTHOG_HOST || 'https://eu.posthog.com').trim();

const hasAny = !!(gaId || phKey);
console.log('scripts/generate-analytics-config.js: GA_MEASUREMENT_ID=' + (gaId ? '已设置' : '未设置') + ', POSTHOG_KEY=' + (phKey ? '已设置' : '未设置'));

if (!hasAny) {
  console.log('scripts/generate-analytics-config.js: 未设置 GA 或 PostHog 环境变量，跳过生成。');
  process.exit(0);
}

function escape(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const publicDir = path.join(__dirname, '..', 'public');
const outPath = path.join(publicDir, 'analytics-config.js');
const content = [
  '// 由构建脚本根据环境变量生成，请勿提交',
  "window.__GA_MEASUREMENT_ID__ = '" + escape(gaId) + "';",
  "window.__POSTHOG_KEY__ = '" + escape(phKey) + "';",
  "window.__POSTHOG_HOST__ = '" + escape(phHost) + "';",
  ''
].join('\n');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(outPath, content, 'utf8');
console.log('scripts/generate-analytics-config.js: 已生成 public/analytics-config.js');
}
