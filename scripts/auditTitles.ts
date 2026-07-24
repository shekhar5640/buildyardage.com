import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function getAllHtmlFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`Auditing titles in ${htmlFiles.length} HTML files...`);

let minLen = Infinity;
let maxLen = -Infinity;
const issues: { file: string; title: string; len: number }[] = [];
const allTitles = new Set<string>();

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/<title>([^<]*)<\/title>/i);
  if (match) {
    const title = match[1];
    const len = title.length;
    if (len < minLen) minLen = len;
    if (len > maxLen) maxLen = len;

    if (len < 45 || len > 58) {
      const relPath = path.relative(distDir, file).replace(/\\/g, '/');
      issues.push({ file: relPath, title, len });
    }
  }
}

console.log(`Title length range across site: ${minLen} - ${maxLen} characters.`);
console.log(`Titles out of 45-58 character range: ${issues.length}`);

if (issues.length > 0) {
  console.log('\nSample out-of-range titles:');
  issues.slice(0, 35).forEach(i => {
    console.log(`[${i.len} chars] ${i.file}: "${i.title}"`);
  });
}
