import { detailedIllusionDescriptions } from './illusionDescriptions';
import { en } from './i18n/locales/en';
import { overrides, v03Overrides } from './i18n/locales/overrides';

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = Object.freeze([
  'en',
  'fr',
  'es',
  'de',
  'ja',
  'zh-Hans',
  'zh-Hant',
  'ko'
] as const);

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = Object.freeze({
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  ja: '日本語',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  ko: '한국어'
});

export type TranslationKey = keyof typeof en;
export type TranslationMap = Record<TranslationKey, string>;

const localeOverrides = overrides as Record<Exclude<SupportedLanguage, 'en'>, Partial<TranslationMap>>;
const releaseOverrides = v03Overrides as Record<Exclude<SupportedLanguage, 'en'>, Partial<TranslationMap>>;

export const translations: Record<SupportedLanguage, TranslationMap> = Object.freeze(
  Object.fromEntries(
    SUPPORTED_LANGUAGES.map((language) => [
      language,
      Object.freeze({
        ...en,
        ...(language === 'en' ? {} : localeOverrides[language]),
        ...(language === 'en' ? {} : releaseOverrides[language]),
        ...detailedIllusionDescriptions[language]
      })
    ])
  ) as Record<SupportedLanguage, TranslationMap>
);

export function createTranslator(language: string) {
  const activeLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
  const dictionary = translations[activeLanguage];

  return (key: TranslationKey, values: Record<string, string | number> = {}) => {
    const template = dictionary[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  };
}

export function detectLanguage(languageTags: readonly string[] = []): SupportedLanguage {
  for (const tag of languageTags) {
    const normalized = normalizeLanguage(tag);

    if (normalized) {
      return normalized;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function normalizeLanguage(languageTag: string): SupportedLanguage | null {
  if (!languageTag || typeof languageTag !== 'string') {
    return null;
  }

  const lower = languageTag.trim().replaceAll('_', '-').toLowerCase();

  if (lower.startsWith('zh')) {
    return lower.includes('hant') || lower.includes('tw') || lower.includes('hk') || lower.includes('mo')
      ? 'zh-Hant'
      : 'zh-Hans';
  }

  const base = lower.split('-')[0];
  return isSupportedLanguage(base) ? base : null;
}

export function isSupportedLanguage(language: string): language is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(language);
}
