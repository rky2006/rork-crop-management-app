export type SupportedLanguageCode = 'en' | 'hi' | 'gu' | 'mr';

export const LANGUAGE_OPTIONS: Array<{
  code: SupportedLanguageCode;
  name: string;
  subtitle: string;
}> = [
  { code: 'en', name: 'English', subtitle: 'Continue in English' },
  { code: 'hi', name: 'हिंदी', subtitle: 'हिंदी में आगे बढ़ें' },
  { code: 'gu', name: 'ગુજરાતી', subtitle: 'ગુજરાતીમાં આગળ વધો' },
  { code: 'mr', name: 'मराठी', subtitle: 'मराठीत पुढे जा' },
];

const SUPPORTED_LANGUAGE_CODES = new Set<SupportedLanguageCode>(
  LANGUAGE_OPTIONS.map(option => option.code)
);

export function getSupportedLanguage(language: string | null | undefined): SupportedLanguageCode {
  if (language && SUPPORTED_LANGUAGE_CODES.has(language as SupportedLanguageCode)) {
    return language as SupportedLanguageCode;
  }

  return 'en';
}

export const SPEECH_LANGUAGE_LOCALE: Record<SupportedLanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
};
