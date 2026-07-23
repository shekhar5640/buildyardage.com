import fs from 'node:fs';
import path from 'node:path';
import { getAllPseoPages } from '../src/data/pseo/pseoMatrix';

const BASE_URL = 'https://buildyardage.com';

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
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static routes
  for (const route of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;
  }

  // Add pSEO matrix routes
  for (const page of pages) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.urlPath}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  const targetPath = path.join(process.cwd(), 'public', 'sitemap-calculators.xml');
  fs.writeFileSync(targetPath, xml, 'utf8');
  console.log(`[pSEO Sitemap] Successfully generated sitemap with ${pages.length + staticRoutes.length} URLs at ${targetPath}`);
}

generateSitemap();
