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
export function getHreflangLinks(pathname: string, baseUrl: string = 'https://buildyardage.com') {
  const cleanPath = stripLocaleFromPath(pathname);
  const links = SUPPORTED_LOCALES.map((locale) => {
    const localizedPath = locale === DEFAULT_LOCALE ? cleanPath : (cleanPath === '/' ? `/${locale}/` : `/${locale}${cleanPath}`);
    return {
      rel: 'alternate',
      hreflang: locale,
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
