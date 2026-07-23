import fs from 'node:fs';
import path from 'node:path';
import { getAllPseoPages } from '../src/data/pseo/pseoMatrix';

const BASE_URL = 'https://buildyardage.com';
const LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'zh'];

function generateSitemap() {
  const pages = getAllPseoPages();
  const dateStr = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    '/',
    '/calculators/concrete-slab-calculator',
    '/calculators/concrete-column-calculator',
    '/calculators/gravel-driveway-calculator',
    '/calculators/drywall-calculator',
    '/calculators/framing-calculator',
    '/calculators/rebar-calculator',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  let totalUrlCount = 0;

  // Add static routes with hreflang
  for (const route of staticRoutes) {
    for (const locale of LOCALES) {
      const locUrl = locale === 'en' ? `${BASE_URL}${route}` : `${BASE_URL}/${locale}${route === '/' ? '/' : route}`;
      xml += `  <url>\n`;
      xml += `    <loc>${locUrl}</loc>\n`;
      xml += `    <lastmod>${dateStr}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${route === '/' ? '1.0' : '0.9'}</priority>\n`;
      xml += `  </url>\n`;
      totalUrlCount++;
    }
  }

  // Add pSEO matrix routes with hreflang
  for (const page of pages) {
    for (const locale of LOCALES) {
      const locUrl = locale === 'en' ? `${BASE_URL}${page.urlPath}` : `${BASE_URL}/${locale}${page.urlPath}`;
      xml += `  <url>\n`;
      xml += `    <loc>${locUrl}</loc>\n`;
      xml += `    <lastmod>${dateStr}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
      totalUrlCount++;
    }
  }

  xml += `</urlset>`;

  const targetPath = path.join(process.cwd(), 'public', 'sitemap-calculators.xml');
  fs.writeFileSync(targetPath, xml, 'utf8');
  console.log(`[i18n & pSEO Sitemap] Successfully generated sitemap with ${totalUrlCount} localized URLs at ${targetPath}`);
}

generateSitemap();
