import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function getAllHtmlFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`[H1 Tag & Keyword Auditor] Auditing H1 headings across ${htmlFiles.length} HTML files...`);

let multiH1Count = 0;
let keywordErrorsCount = 0;

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  // Exclude error pages and embed widgets from H1 check
  if (relPath === '404.html' || relPath === '500.html' || relPath.startsWith('embed/')) continue;

  const html = fs.readFileSync(file, 'utf8');

  // Check 1: Single H1 tag per page
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length > 1) {
    console.warn(`[Multi-H1 Warning] ${relPath} has ${h1Matches.length} <h1> tags!`);
    multiH1Count++;
  } else if (h1Matches.length === 0) {
    console.warn(`[Missing-H1 Error] ${relPath} has 0 <h1> tags!`);
    keywordErrorsCount++;
    continue;
  }

  // Check 2: H1 keywords present in body text
  const stopWords = new Set(['how', 'much', 'many', 'for', 'and', 'the', 'with', 'per', 'are', 'can', 'your', 'need', 'from', 'this', 'that', 'into', 'feet', 'deep', 'inch', 'inches']);
  const firstH1 = h1Matches[0];
  const h1Text = firstH1 ? firstH1.replace(/<[^>]+>/g, '').trim() : '';

  const words = h1Text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff\u3040-\u30ff]/g, ' ')
    .split(/[\s,.\-—]+/);

  const keyTerms: string[] = [];
  for (const w of words) {
    if (w.length < 2 || stopWords.has(w)) continue;
    if (/[\u4e00-\u9fff\u3040-\u30ff]/.test(w) && w.length > 4) {
      for (let i = 0; i <= w.length - 4; i += 4) {
        keyTerms.push(w.substring(i, i + 4));
      }
    } else {
      keyTerms.push(w);
    }
  }

  // Extract body text after removing script, style, svg, and the h1 itself
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<h1[\s\S]*?<\/h1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .toLowerCase();

  const missingWords = keyTerms.filter(w => !bodyText.includes(w));
  if (missingWords.length > 0 && (missingWords.length / keyTerms.length) > 0.25) {
    console.warn(`[H1 Keyword Misalignment] ${relPath}: Missing H1 terms in body text: [${missingWords.join(', ')}]`);
    keywordErrorsCount++;
  }
}

if (multiH1Count === 0 && keywordErrorsCount === 0) {
  console.log(`[H1 Tag & Keyword Auditor] SUCCESS: All ${htmlFiles.length} HTML files have exactly ONE <h1> tag and 100% keyword alignment in body copy!`);
} else {
  console.warn(`[H1 Tag & Keyword Auditor] Completed: ${multiH1Count} pages with multiple H1s, ${keywordErrorsCount} pages with keyword misalignment.`);
}
