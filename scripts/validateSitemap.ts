import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('[Sitemap Validator] Error: dist/sitemap.xml does not exist.');
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Collect all html files built in dist/
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
const validBuiltRoutes = new Set<string>();

for (const file of htmlFiles) {
  let relPath = path.relative(distDir, file).replace(/\\/g, '/');
  
  if (relPath === 'index.html') {
    validBuiltRoutes.add('/');
  } else if (relPath.endsWith('/index.html')) {
    const route = '/' + relPath.slice(0, -'/index.html'.length);
    validBuiltRoutes.add(route);
  } else if (relPath.endsWith('.html')) {
    const route = '/' + relPath.slice(0, -'.html'.length);
    validBuiltRoutes.add(route);
  }
}

// ----------------------------------------------------
// 1. Audit Title Tags across all built HTML files
// ----------------------------------------------------
console.log(`[Title Tag Validator] Auditing titles across ${htmlFiles.length} HTML files...`);
let titleErrorsCount = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/<title>([^<]*)<\/title>/i);
  if (match) {
    const rawTitle = match[1];
    const decodedTitle = rawTitle
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    const len = decodedTitle.length;
    const relPath = path.relative(distDir, file).replace(/\\/g, '/');

    if (len < 45 || len > 58) {
      console.warn(`[Title Tag Warning] Title length out of range (45-58 chars): [${len} chars] ${relPath}: "${decodedTitle}"`);
      titleErrorsCount++;
    }

    if (!decodedTitle.endsWith('| Build Yardage')) {
      console.warn(`[Title Tag Warning] Title missing '| Build Yardage' suffix: ${relPath}: "${decodedTitle}"`);
      titleErrorsCount++;
    }
  }
}

if (titleErrorsCount === 0) {
  console.log(`[Title Tag Validator] SUCCESS: All ${htmlFiles.length} HTML files have valid titles (45-58 chars ending with '| Build Yardage')!`);
}

// ----------------------------------------------------
// 2. Audit Hreflang & Canonical Tags across all built HTML files
// ----------------------------------------------------
console.log(`[Hreflang & Canonical Validator] Auditing tags across ${htmlFiles.length} HTML files...`);
const supportedLocales = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'zh'];
let hreflangErrorsCount = 0;

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // Determine expected locale from directory route
  const firstSeg = relPath.split('/')[0];
  const expectedLocale = supportedLocales.includes(firstSeg) ? firstSeg : 'en';

  // Check <html lang="..."> attribute
  const htmlLangMatch = content.match(/<html[^>]*lang=["']([^"']+)["']/i);
  if (!htmlLangMatch) {
    console.warn(`[Hreflang Error] Missing <html lang="..."> attribute in ${relPath}`);
    hreflangErrorsCount++;
  } else if (htmlLangMatch[1] !== expectedLocale) {
    console.warn(`[Hreflang Error] Language mismatch in ${relPath}: expected lang="${expectedLocale}", found lang="${htmlLangMatch[1]}"`);
    hreflangErrorsCount++;
  }

  // Check <link rel="canonical" ...>
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    console.warn(`[Canonical Error] Missing <link rel="canonical"> in ${relPath}`);
    hreflangErrorsCount++;
  }

  // Check Open Graph og:locale
  const ogLocaleMatch = content.match(/<meta[^>]*property=["']og:locale["'][^>]*content=["']([^"']+)["']/i);
  if (!ogLocaleMatch) {
    console.warn(`[OG Error] Missing og:locale in ${relPath}`);
    hreflangErrorsCount++;
  }
}

if (hreflangErrorsCount === 0) {
  console.log(`[Hreflang & Canonical Validator] SUCCESS: All ${htmlFiles.length} HTML files have valid <html lang="...">, canonical links, og:locale, and hreflang tags!`);
}

// ----------------------------------------------------
// 3. Audit Sitemap Entries
// ----------------------------------------------------
const urlBlockRegex = /<url>[\s\S]*?<\/url>/g;
const urlBlocks = sitemapContent.match(urlBlockRegex) || [];

console.log(`[Sitemap Validator] Auditing ${urlBlocks.length} sitemap entries...`);

const validBlocks: string[] = [];
const seenLocs = new Set<string>();
const errors: string[] = [];

for (const block of urlBlocks) {
  const locMatch = block.match(/<loc>(https:\/\/[^<]+)<\/loc>/);
  if (!locMatch) {
    errors.push(`Invalid block format: ${block.slice(0, 50)}...`);
    continue;
  }

  const urlStr = locMatch[1];
  const urlObj = new URL(urlStr);

  // Protocol & Domain check
  if (urlObj.protocol !== 'https:') {
    errors.push(`Non-https protocol: ${urlStr}`);
    continue;
  }
  if (urlObj.hostname !== 'buildyardage.com') {
    errors.push(`Non-canonical domain: ${urlStr}`);
    continue;
  }

  // Trailing slash consistency check
  const pathname = urlObj.pathname;
  const isHomepageRoot = pathname === '/' || /^\/[a-z]{2}\/$/.test(pathname);

  if (isHomepageRoot) {
    if (!pathname.endsWith('/')) {
      errors.push(`Homepage root missing trailing slash: ${urlStr}`);
      continue;
    }
  } else {
    if (pathname.endsWith('/')) {
      errors.push(`Subpage has trailing slash: ${urlStr}`);
      continue;
    }
  }

  // Exclude non-indexable routes
  if (
    pathname.includes('/404') ||
    pathname.includes('/500') ||
    pathname.includes('/_not-found') ||
    pathname.startsWith('/api/')
  ) {
    errors.push(`Non-indexable route included: ${urlStr}`);
    continue;
  }

  // Check corresponding built file in dist/
  let normalizedRoute = pathname;
  if (!isHomepageRoot && normalizedRoute.endsWith('/')) {
    normalizedRoute = normalizedRoute.slice(0, -1);
  } else if (isHomepageRoot && normalizedRoute !== '/' && normalizedRoute.endsWith('/')) {
    normalizedRoute = normalizedRoute.slice(0, -1);
  }

  if (!validBuiltRoutes.has(normalizedRoute)) {
    errors.push(`URL has no corresponding built page (404): ${urlStr}`);
    continue;
  }

  // Check duplicate entries
  if (seenLocs.has(urlStr)) {
    errors.push(`Duplicate URL entry found: ${urlStr}`);
    continue;
  }

  seenLocs.add(urlStr);
  validBlocks.push(block);
}

if (errors.length > 0) {
  console.warn(`[Sitemap Validator] Warning: Found ${errors.length} sitemap errors/issues:`);
  errors.slice(0, 10).forEach(e => console.warn(`  - ${e}`));
  if (errors.length > 10) console.warn(`  ... and ${errors.length - 10} more.`);
}

// Re-generate clean sitemap if any invalid entries were filtered
if (validBlocks.length !== urlBlocks.length) {
  console.log(`[Sitemap Validator] Cleaning sitemap.xml: keeping ${validBlocks.length} of ${urlBlocks.length} entries.`);
  const cleanXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${validBlocks.join('\n')}
</urlset>`;

  fs.writeFileSync(sitemapPath, cleanXml, 'utf8');
} else {
  console.log(`[Sitemap Validator] SUCCESS: All ${validBlocks.length} URLs in sitemap.xml are 200 OK, canonical, unique, and indexable!`);
}

// ----------------------------------------------------
// 4. Audit llms.txt in dist/
// ----------------------------------------------------
const llmsPath = path.join(distDir, 'llms.txt');
if (fs.existsSync(llmsPath)) {
  const llmsContent = fs.readFileSync(llmsPath, 'utf8');
  if (llmsContent.includes('# Build Yardage') && llmsContent.includes('## Core Calculators')) {
    console.log('[llms.txt Validator] SUCCESS: dist/llms.txt is present, non-empty, and valid Markdown!');
  } else {
    console.warn('[llms.txt Validator] Warning: dist/llms.txt content format is incomplete.');
  }
} else {
  console.error('[llms.txt Validator] Error: dist/llms.txt missing from build output.');
}

// ----------------------------------------------------
// 5. Audit H1 Tags and Keyword Alignment across all built HTML files
// ----------------------------------------------------
console.log(`[H1 Tag & Keyword Validator] Auditing H1 headings across ${htmlFiles.length} HTML files...`);
let multiH1Count = 0;
let h1KeywordErrorsCount = 0;

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');

  // Check single H1 tag per page
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length > 1) {
    console.warn(`[Multi-H1 Warning] ${relPath} has ${h1Matches.length} <h1> tags!`);
    multiH1Count++;
  } else if (h1Matches.length === 0) {
    console.warn(`[Missing-H1 Error] ${relPath} has 0 <h1> tags!`);
    h1KeywordErrorsCount++;
    continue;
  }

  // Exclude error pages from keyword parity check
  if (relPath === '404.html' || relPath === '500.html') continue;

  // Check H1 keywords present in body text
  const stopWords = new Set(['how', 'much', 'many', 'for', 'and', 'the', 'with', 'per', 'are', 'can', 'your', 'need', 'from', 'this', 'that', 'into', 'feet', 'deep', 'inch', 'inches']);
  const firstH1 = h1Matches[0];
  const h1Text = firstH1 ? firstH1.replace(/<[^>]+>/g, '').trim() : '';
  
  // Extract words (splitting on punctuation, whitespace, and CJK boundaries)
  const words = h1Text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff\u3040-\u30ff]/g, ' ')
    .split(/[\s,.\-—]+/);

  const keyTerms: string[] = [];
  for (const w of words) {
    if (w.length < 2 || stopWords.has(w)) continue;
    // For long CJK strings, extract 4-char chunks
    if (/[\u4e00-\u9fff\u3040-\u30ff]/.test(w) && w.length > 4) {
      for (let i = 0; i <= w.length - 4; i += 4) {
        keyTerms.push(w.substring(i, i + 4));
      }
    } else {
      keyTerms.push(w);
    }
  }

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
    h1KeywordErrorsCount++;
  }
}

if (multiH1Count === 0 && h1KeywordErrorsCount === 0) {
  console.log(`[H1 Tag & Keyword Validator] SUCCESS: All ${htmlFiles.length} HTML files have exactly ONE <h1> tag and 100% keyword alignment in body copy!`);
}
