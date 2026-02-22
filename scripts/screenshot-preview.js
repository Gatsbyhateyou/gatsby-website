/**
 * 截取 style-previews 预览页整页截图
 * 用法：node scripts/screenshot-preview.js <预览页文件名>
 * 例：  node scripts/screenshot-preview.js 4-retro-css
 *
 * 输出：screenshots/<文件名>.png
 * 视口：1200px 宽，整页截图 (fullPage: true)
 */

const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: node scripts/screenshot-preview.js <preview-id>');
    console.error('Example: node scripts/screenshot-preview.js 4-retro-css');
    process.exit(1);
  }

  const baseDir = path.resolve(__dirname, '..');
  const previewPath = path.join(baseDir, 'public', 'style-previews', id.endsWith('.html') ? id : `${id}.html`);

  if (!fs.existsSync(previewPath)) {
    console.error(`Preview not found: ${previewPath}`);
    process.exit(1);
  }

  const fileUrl = pathToFileURL(previewPath).href;
  const screenshotsDir = path.join(baseDir, 'screenshots');
  const outputName = id.endsWith('.html') ? id.replace('.html', '') : id;
  const outputPath = path.join(screenshotsDir, `${outputName}.png`);

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let playwright;
  try {
    playwright = require('playwright');
  } catch {
    console.error('Playwright not found. Run: npm install -D playwright');
    console.error('Then: npx playwright install chromium');
    process.exit(1);
  }

  const browser = await playwright.chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 800 },
    });
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });
  } finally {
    await browser.close();
  }

  console.log(`Screenshot saved: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
