import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import pt from '../locales/pt.json';
import it from '../locales/it.json';
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';

export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'zh'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALES: Record<SupportedLocale, { name: string; nativeName: string; flag: string; isMetricDefault: boolean }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', isMetricDefault: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isMetricDefault: true },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', isMetricDefault: true },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isMetricDefault: true },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isMetricDefault: true },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isMetricDefault: true },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isMetricDefault: true },
  zh: { name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', isMetricDefault: true }
};

const dictionaries: Record<SupportedLocale, typeof en> = {
  en,
  es: es as typeof en,
  fr: fr as typeof en,
  de: de as typeof en,
  pt: pt as typeof en,
  it: it as typeof en,
  ja: ja as typeof en,
  zh: zh as typeof en
};

/**
 * Returns translation dictionary for given locale, falling back to English keys if missing.
 */
export function getTranslations(locale: string): typeof en {
  const targetLocale = (SUPPORTED_LOCALES.includes(locale as SupportedLocale) ? locale : DEFAULT_LOCALE) as SupportedLocale;
  return dictionaries[targetLocale] || dictionaries.en;
}

/**
 * Extracts locale code from current URL pathname.
 */
export function getLocaleFromUrl(pathname: string): SupportedLocale {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)) {
    return segments[0] as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Removes locale prefix from a pathname if present.
 */
export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)) {
    segments.shift();
  }
  const cleanPath = '/' + segments.join('/');
  return cleanPath === '/' ? '/' : cleanPath;
}

/**
 * Constructs localized URL path for target locale.
 */
export function getLocalizedPath(pathname: string, targetLocale: SupportedLocale): string {
  const cleanPath = stripLocaleFromPath(pathname);
  if (targetLocale === DEFAULT_LOCALE) {
    return cleanPath;
  }
  return cleanPath === '/' ? `/${targetLocale}/` : `/${targetLocale}${cleanPath}`;
}

/**
 * Generates Google SEO compliant hreflang alternate links for <head>.
 */
export function getHreflangLinks(pathname: string, baseUrl: string = 'https://buildyardage.com'): Array<{ rel: string; hreflang: string; href: string }> {
  const cleanPath = stripLocaleFromPath(pathname);
  const links: Array<{ rel: string; hreflang: string; href: string }> = SUPPORTED_LOCALES.map((locale) => {
    const localizedPath = locale === DEFAULT_LOCALE ? cleanPath : (cleanPath === '/' ? `/${locale}/` : `/${locale}${cleanPath}`);
    return {
      rel: 'alternate',
      hreflang: locale as string,
      href: `${baseUrl}${localizedPath}`
    };
  });

  // Add x-default pointing to default locale (English)
  links.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${baseUrl}${cleanPath}`
  });

  return links;
}

/**
 * Enforces meta title rules: 45 to 58 characters long ending cleanly with '| Build Yardage'.
 */
export function formatMetaTitle(rawTitle: string): string {
  const suffix = ' | Build Yardage';
  let title = (rawTitle || '').trim();

  // Strip pre-existing brand prefixes & suffixes
  title = title
    .replace(/^Build\s*Yardage\s*\|\s*/i, '')
    .replace(/^BuildYardage\s*\|\s*/i, '')
    .replace(/\s*\|\s*Build\s*Yardage$/i, '')
    .replace(/\s*\|\s*BuildYardage$/i, '')
    .replace(/\s*-\s*BuildYardage$/i, '')
    .replace(/\s*-\s*Build\s*Yardage$/i, '')
    .trim();

  // Remove internal duplicate brand mentions if title is long enough
  if (title.length > 20 && /Build\s*Yardage/i.test(title)) {
    title = title.replace(/\s*Build\s*Yardage\s*/gi, ' ').replace(/\s+/g, ' ').trim();
  }

  let fullTitle = `${title}${suffix}`;

  if (fullTitle.length > 58) {
    const maxContentLen = 58 - suffix.length; // 42 chars
    title = title.slice(0, maxContentLen).trim();
    // Clean up trailing connectors or punctuation resulting from truncation
    title = title
      .replace(/[\s&|,-:]+$/, '')
      .replace(/\s+and$/i, '')
      .replace(/\s+or$/i, '')
      .trim();
    fullTitle = `${title}${suffix}`;
  } else if (fullTitle.length < 45) {
    const minContentLen = 45 - suffix.length; // 29 chars
    if (title.length < minContentLen) {
      // Intelligently expand short titles
      if (title.includes('404')) {
        title = '404 Page Not Found Error Details';
      } else if (title.includes('500')) {
        title = '500 Internal Server Error Details';
      } else if (title.toLowerCase().includes('contact')) {
        title = 'Contact & Customer Support Team';
      } else {
        title = `${title} Construction Estimator`;
      }

      if (title.length > minContentLen) {
        title = title.slice(0, 58 - suffix.length).trim();
        title = title.replace(/[\s&|,-:]+$/, '').trim();
      }
    }
    fullTitle = `${title}${suffix}`;
  }

  return fullTitle;
}

/**
 * Generates strict canonical URL for a given pathname.
 */
export function getCanonicalUrl(pathname: string, baseUrl: string = 'https://buildyardage.com'): string {
  const cleanPath = pathname.replace(/\/$/, '');
  const isRoot = cleanPath === '' || /^\/[a-z]{2}$/.test(cleanPath);
  if (isRoot) {
    return `${baseUrl}${cleanPath}/`;
  }
  return `${baseUrl}${cleanPath}`;
}

const OG_LOCALES: Record<SupportedLocale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_PT',
  it: 'it_IT',
  ja: 'ja_JP',
  zh: 'zh_CN'
};

/**
 * Returns ISO OpenGraph locale code for given locale.
 */
export function getOgLocale(locale: SupportedLocale): string {
  return OG_LOCALES[locale] || 'en_US';
}


