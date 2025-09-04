export interface Language {
  code: string;
  name: string;
  nativeName: string;
  translationLabel: string;
}

export const languages: Language[] = [
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    translationLabel: '日本語訳'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    translationLabel: 'Traducción al español'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    translationLabel: 'Traduction en français'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    translationLabel: 'Deutsche Übersetzung'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    translationLabel: 'Traduzione in italiano'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    translationLabel: 'Tradução em português'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    translationLabel: '中文翻译'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    translationLabel: '한국어 번역'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    translationLabel: 'Перевод на русский'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    translationLabel: 'الترجمة العربية'
  }
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

export const defaultLanguage = languages[0]; // Japanese