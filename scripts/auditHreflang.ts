import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function getAllHtmlFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
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
console.log(`[Hreflang & Canonical Auditor] Auditing ${htmlFiles.length} HTML files...`);

const supportedLocales = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'zh'];
let errorsCount = 0;

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // Determine expected locale from directory route
  const firstSeg = relPath.split('/')[0];
  const expectedLocale = supportedLocales.includes(firstSeg) ? firstSeg : 'en';

  // 1. Check <html lang="..."> attribute
  const htmlLangMatch = content.match(/<html[^>]*lang=["']([^"']+)["']/i);
  if (!htmlLangMatch) {
    console.warn(`[Hreflang Error] Missing <html lang="..."> attribute in ${relPath}`);
    errorsCount++;
  } else if (htmlLangMatch[1] !== expectedLocale) {
    console.warn(`[Hreflang Error] Language mismatch in ${relPath}: expected lang="${expectedLocale}", found lang="${htmlLangMatch[1]}"`);
    errorsCount++;
  }

  // 2. Check <link rel="canonical" ...>
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    console.warn(`[Canonical Error] Missing <link rel="canonical"> in ${relPath}`);
    errorsCount++;
  }

  // 3. Check hreflang alternate tags
  const hreflangTags = content.match(/<link[^>]*hreflang=["']([^"']+)["']/g) || [];
  if (hreflangTags.length < 5) {
    console.warn(`[Hreflang Warning] Incomplete hreflang tags in ${relPath} (found ${hreflangTags.length})`);
    errorsCount++;
  }

  // 4. Check Open Graph og:locale
  const ogLocaleMatch = content.match(/<meta[^>]*property=["']og:locale["'][^>]*content=["']([^"']+)["']/i);
  if (!ogLocaleMatch) {
    console.warn(`[OG Error] Missing og:locale in ${relPath}`);
    errorsCount++;
  }
}

if (errorsCount === 0) {
  console.log(`[Hreflang & Canonical Auditor] SUCCESS: All ${htmlFiles.length} HTML files have valid <html lang="...">, canonical links, og:locale, and hreflang tags!`);
} else {
  console.error(`[Hreflang & Canonical Auditor] FAILED: Found ${errorsCount} issues across HTML files.`);
  process.exit(1);
}
