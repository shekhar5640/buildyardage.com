import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function getRatio(htmlPath: string) {
  if (!fs.existsSync(htmlPath)) {
    console.error(`File not found: ${htmlPath}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const htmlSize = Buffer.byteLength(html, 'utf8');

  // Strip script, style, svg, and html tags
  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const textSize = Buffer.byteLength(textOnly, 'utf8');
  const ratio = (textSize / htmlSize) * 100;
  
  const rel = path.relative(distDir, htmlPath).replace(/\\/g, '/');
  console.log(`[Ratio Audit] ${rel.padEnd(20)} | Ratio: ${ratio.toFixed(2)}% | Text Size: ${textSize} B | HTML Size: ${htmlSize} B`);
}

const locales = ['ja', 'zh', 'es', 'fr', 'de', 'pt', 'it'];
getRatio(path.join(distDir, 'index.html'));
locales.forEach(loc => getRatio(path.join(distDir, loc, 'index.html')));
