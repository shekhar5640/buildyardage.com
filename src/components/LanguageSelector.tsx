import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LOCALES, SUPPORTED_LOCALES, type SupportedLocale, getLocalizedPath, getLocaleFromUrl } from '../i18n/utils';

interface Props {
  currentLocale?: SupportedLocale;
  currentPathname?: string;
  variant?: 'header' | 'footer' | 'mobile';
}

export const LanguageSelector: React.FC<Props> = ({
  currentLocale: initialLocale,
  currentPathname: initialPathname,
  variant = 'header'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale || 'en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activePath = initialPathname || window.location.pathname;
      const detected = initialLocale || getLocaleFromUrl(activePath);
      setLocale(detected);
    }
  }, [initialLocale, initialPathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (targetLocale: SupportedLocale) => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      // 1. Save preference in localStorage & Cookie
      localStorage.setItem('user_locale', targetLocale);
      document.cookie = `user_locale=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;

      // 2. Calculate target URL
      const currentPath = window.location.pathname;
      const targetPath = getLocalizedPath(currentPath, targetLocale);

      // 3. Navigate smoothly
      if (window.location.pathname !== targetPath) {
        window.location.href = targetPath;
      }
    }
  };

  const currentMeta = LOCALES[locale] || LOCALES.en;

  if (variant === 'mobile') {
    return (
      <div className="space-y-2 pt-2 border-t border-hairline">
        <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
          {currentMeta.flag} {currentMeta.nativeName} ({currentMeta.name})
        </label>
        <select
          value={locale}
          onChange={(e) => handleSelect(e.target.value as SupportedLocale)}
          className="w-full px-3 py-2.5 bg-surface-card border border-hairline rounded-lg text-sm text-ink font-medium focus:outline-none focus:border-brand-accent transition-colors"
        >
          {SUPPORTED_LOCALES.map((code) => {
            const item = LOCALES[code];
            return (
              <option key={code} value={code}>
                {item.flag} {item.nativeName} ({item.name})
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Native select overlay for mobile to prevent overflow and provide native UX */}
      <select
        value={locale}
        onChange={(e) => handleSelect(e.target.value as SupportedLocale)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer sm:hidden z-10"
        aria-label="Select Language"
      >
        {SUPPORTED_LOCALES.map((code) => {
          const item = LOCALES[code];
          return (
            <option key={code} value={code}>
              {item.nativeName} ({item.name})
            </option>
          );
        })}
      </select>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none ${
          variant === 'footer'
            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            : 'bg-surface-card border-hairline text-ink hover:border-brand-accent'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={14} className="text-brand-accent shrink-0" />
        <span className="truncate max-w-[110px] sm:max-w-none">
          {currentMeta.flag} {currentMeta.nativeName}
        </span>
        <ChevronDown size={14} className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute w-52 rounded-xl shadow-xl border backdrop-blur-md z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
            variant === 'footer'
              ? 'bottom-full top-auto mb-2 left-0 sm:left-auto sm:right-0 bg-zinc-950 border-zinc-800 text-zinc-200'
              : 'top-full bottom-auto mt-2 right-0 bg-canvas border-hairline text-ink'
          }`}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-muted uppercase tracking-wider border-b border-hairline">
            Select Language / 言語選択
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {SUPPORTED_LOCALES.map((code) => {
              const item = LOCALES[code];
              const isSelected = code === locale;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? variant === 'footer' ? 'bg-brand-accent/20 text-brand-accent font-bold' : 'bg-brand-accent/10 text-brand-accent font-bold'
                      : variant === 'footer' ? 'hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium' : 'hover:bg-surface-soft text-ink font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{item.flag}</span>
                    <span>{item.nativeName}</span>
                    <span className="text-[10px] text-muted">({item.name})</span>
                  </span>
                  {isSelected && <Check size={14} className="text-brand-accent shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
