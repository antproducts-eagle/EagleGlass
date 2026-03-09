export const locales = ['en', 'nl', 'fr', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
  de: 'Deutsch',
};

export const localeFlags: Record<Locale, string> = {
  en: 'GB',
  nl: 'NL',
  fr: 'FR',
  de: 'DE',
};

export function getLocalePath(locale: Locale, path: string = '/') {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}
