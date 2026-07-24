import type { APIRoute } from 'astro';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../i18n/utils';
import { getAllPseoPages } from '../data/pseo/pseoMatrix';

const SITE_URL = 'https://buildyardage.com';

const CORE_PATHS = [
  '/',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/calculators/concrete-slab-calculator',
  '/calculators/concrete-column-calculator',
  '/calculators/gravel-driveway-calculator',
  '/calculators/drywall-calculator',
  '/calculators/framing-calculator',
  '/calculators/rebar-calculator',
];

/**
 * Returns full canonical URL for a base path and locale.
 * - Root path ('/'): locale='en' -> 'https://buildyardage.com/', locale='es' -> 'https://buildyardage.com/es/'
 * - Subpaths ('/about'): locale='en' -> 'https://buildyardage.com/about', locale='es' -> 'https://buildyardage.com/es/about'
 */
function getCanonicalUrl(basePath: string, locale: string): string {
  const cleanPath = basePath === '/' ? '/' : (basePath.endsWith('/') ? basePath.slice(0, -1) : basePath);
  
  if (cleanPath === '/') {
    return locale === DEFAULT_LOCALE ? `${SITE_URL}/` : `${SITE_URL}/${locale}/`;
  }
  
  return locale === DEFAULT_LOCALE ? `${SITE_URL}${cleanPath}` : `${SITE_URL}/${locale}${cleanPath}`;
}

/**
 * Generates xhtml:link alternate hreflang tags for a given base path.
 */
function getHreflangXmlTags(basePath: string): string {
  const tags: string[] = [];
  
  for (const locale of SUPPORTED_LOCALES) {
    const href = getCanonicalUrl(basePath, locale);
    tags.push(`    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}"/>`);
  }

  // x-default points to default locale (English)
  const defaultHref = getCanonicalUrl(basePath, DEFAULT_LOCALE);
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}"/>`);

  return tags.join('\n');
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split('T')[0];
  const urlEntries: string[] = [];
  const seenLocs = new Set<string>();

  // 1. Core & Calculator Landing Pages
  for (const basePath of CORE_PATHS) {
    const priority = basePath === '/' ? '1.0' : (basePath.startsWith('/calculators/') ? '0.9' : '0.5');
    const changefreq = basePath === '/' ? 'daily' : 'weekly';
    const hreflangXml = getHreflangXmlTags(basePath);

    for (const locale of SUPPORTED_LOCALES) {
      const loc = getCanonicalUrl(basePath, locale);
      if (seenLocs.has(loc)) continue;
      seenLocs.add(loc);

      urlEntries.push(`  <url>
    <loc>${loc}</loc>
${hreflangXml}
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }
  }

  // 2. pSEO Matrix Pages
  const pseoPages = getAllPseoPages();

  for (const page of pseoPages) {
    const basePath = page.urlPath;
    const priority = '0.8';
    const changefreq = 'weekly';
    const hreflangXml = getHreflangXmlTags(basePath);

    for (const locale of SUPPORTED_LOCALES) {
      const loc = getCanonicalUrl(basePath, locale);
      if (seenLocs.has(loc)) continue;
      seenLocs.add(loc);

      urlEntries.push(`  <url>
    <loc>${loc}</loc>
${hreflangXml}
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
