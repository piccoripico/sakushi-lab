import { describe, expect, it } from 'vitest';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, detectLanguage, normalizeLanguage, translations } from '../src/i18n';

describe('i18n', () => {
  it('keeps the planned language set and readable names', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['en', 'fr', 'es', 'de', 'ja', 'zh-Hans', 'zh-Hant', 'ko']);
    expect(LANGUAGE_NAMES).toEqual({
      en: 'English',
      fr: 'Français',
      es: 'Español',
      de: 'Deutsch',
      ja: '日本語',
      'zh-Hans': '简体中文',
      'zh-Hant': '繁體中文',
      ko: '한국어'
    });
  });

  it('normalizes browser languages', () => {
    expect(detectLanguage(['ja-JP', 'en-US'])).toBe('ja');
    expect(detectLanguage(['pt-BR', 'fr-FR'])).toBe('fr');
    expect(normalizeLanguage('zh-CN')).toBe('zh-Hans');
    expect(normalizeLanguage('zh-TW')).toBe('zh-Hant');
    expect(normalizeLanguage('zh-HK')).toBe('zh-Hant');
  });

  it('keeps every translation dictionary complete and unmangled', () => {
    const englishKeys = Object.keys(translations.en).sort();

    for (const language of SUPPORTED_LANGUAGES) {
      expect(Object.keys(translations[language]).sort()).toEqual(englishKeys);
      expect(Object.values(translations[language]).join('\n')).not.toMatch(/[�縺譁郢]/);
    }
  });

  it('does not keep obsolete header kicker copy', () => {
    expect(Object.hasOwn(translations.en, 'app.kicker')).toBe(false);
    expect(Object.hasOwn(translations.en, 'actions.randomize')).toBe(false);
    expect(Object.hasOwn(translations.en, 'controls.lockSeed')).toBe(false);
    expect(Object.hasOwn(translations.en, 'info.shareLabel')).toBe(false);
    expect(Object.hasOwn(translations.en, 'export.url')).toBe(false);
    expect(Object.hasOwn(translations.en, 'share.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'footer.about')).toBe(false);
    expect(Object.hasOwn(translations.en, 'info.tryParameters')).toBe(false);
    expect(Object.hasOwn(translations.en, 'info.tryAnimationParameters')).toBe(false);
    expect(Object.hasOwn(translations.en, 'category.perspectiveDepth')).toBe(false);
    expect(Object.hasOwn(translations.en, 'category.impossibleFigures')).toBe(false);
    expect(Object.hasOwn(translations.en, 'category.ambiguousFigures')).toBe(false);
    expect(Object.hasOwn(translations.en, 'category.apparentMotion')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.railway-perspective.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.optic-flow-tunnel.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.fraser-spiral.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.penrose-triangle.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.impossible-cube.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.moire-motion.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.rotating-ames-window.title')).toBe(false);
    expect(Object.hasOwn(translations.en, 'illusion.checker-shadow.title')).toBe(false);
    expect(translations.en['app.title']).toBe('Sakushi Lab');
    expect(translations.en['controls.media']).toBe('Media');
    expect(translations.en['media.static']).toBe('Static images');
    expect(translations.en['media.video']).toBe('Videos');
    expect(translations.en['actions.generate']).toBe('Generate');
    expect(translations.en['stateCopy.title']).toBe('Reproducible and shareable URL');
    expect(translations.en['stateCopy.copy']).toBe('Copy URL');
    expect(translations.ja['controls.disableRandomSeed']).toBe('シードをランダム入力しない');
    expect(translations.en['app.description']).toContain('Explore');
    expect(translations.ja['app.description']).toContain('錯視の起こりやすさ');
    expect(translations.ja['footer.description']).toContain('Sakushi Labは');
  });

  it('uses detailed multi-paragraph UI descriptions for every illusion', () => {
    const descriptionKeys = Object.keys(translations.en).filter(
      (key) => key.startsWith('illusion.') && key.endsWith('.description')
    );

    expect(descriptionKeys).toHaveLength(18);

    for (const language of SUPPORTED_LANGUAGES) {
      for (const key of descriptionKeys) {
        const text = translations[language][key as keyof typeof translations.en];
        const paragraphs = text.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

        expect(text, `${language}.${key}`).not.toContain('{params}');
        expect(paragraphs.length, `${language}.${key}`).toBeGreaterThanOrEqual(3);
        expect(paragraphs.every((paragraph) => paragraph.length > 12), `${language}.${key}`).toBe(true);
      }
    }
  });

  it('translates parameter labels for Simplified Chinese, Traditional Chinese, and Korean', () => {
    const paramKeys = Object.keys(translations.en).filter((key) => key.startsWith('param.'));

    for (const language of ['zh-Hans', 'zh-Hant', 'ko'] as const) {
      for (const key of paramKeys) {
        expect(translations[language][key as keyof typeof translations.en]).not.toBe(
          translations.en[key as keyof typeof translations.en]
        );
      }
    }

    expect(translations['zh-Hans']['param.rows']).toBe('行数');
    expect(translations['zh-Hant']['param.rows']).toBe('列數');
    expect(translations.ko['param.rows']).toBe('행 수');
  });
});
