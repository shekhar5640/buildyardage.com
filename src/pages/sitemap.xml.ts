import type { APIRoute } from 'astro';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../i18n/utils';
import {
  getConcreteSlabPseoPages,
  getConcreteColumnPseoPages,
  getGravelPseoPages,
  getDrywallPseoPages,
  getFramingPseoPages,
  getRebarPseoPages
} from '../data/pseo/pseoMatrix';

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

export const GET: APIRoute = async () => {
  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Core & Calculator Landing Pages
  for (const path of CORE_PATHS) {
    for (const locale of SUPPORTED_LOCALES) {
      const localizedPath = locale === DEFAULT_LOCALE 
        ? path 
        : (path === '/' ? `/${locale}/` : `/${locale}${path}`);
      
      const priority = path === '/' ? '1.0' : (path.startsWith('/calculators/') ? '0.9' : '0.5');
      const changefreq = path === '/' ? 'daily' : 'weekly';

      urls.push({
        loc: `${SITE_URL}${localizedPath}`,
        lastmod: today,
        changefreq,
        priority
      });
    }
  }

  // 2. pSEO Matrix Pages
  const pseoDataGetters = [
    getConcreteSlabPseoPages,
    getConcreteColumnPseoPages,
    getGravelPseoPages,
    getDrywallPseoPages,
    getFramingPseoPages,
    getRebarPseoPages,
  ];

  for (const getter of pseoDataGetters) {
    const pages = getter();
    for (const page of pages) {
      for (const locale of SUPPORTED_LOCALES) {
        const localizedPath = locale === DEFAULT_LOCALE
          ? page.urlPath
          : `/${locale}${page.urlPath}`;

        urls.push({
          loc: `${SITE_URL}${localizedPath}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
