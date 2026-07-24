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
// 2. Audit Sitemap Entries
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
