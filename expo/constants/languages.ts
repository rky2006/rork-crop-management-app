export type SupportedLanguageCode = 'en' | 'hi' | 'gu' | 'mr';

export const LANGUAGE_OPTIONS: Array<{
  code: string;
  greeting: string;
  nativeName: string;
  englishName: string;
}> = [
  { code: 'en', greeting: 'Welcome',         nativeName: 'English',    englishName: 'English' },
  { code: 'hi', greeting: 'नमस्ते',           nativeName: 'हिंदी',       englishName: 'Hindi' },
  { code: 'mr', greeting: 'नमस्कार',          nativeName: 'मराठी',       englishName: 'Marathi' },
  { code: 'gu', greeting: 'નમસ્તે',           nativeName: 'ગુજરાતી',    englishName: 'Gujarati' },
  { code: 'pa', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',    nativeName: 'ਪੰਜਾਬੀ',    englishName: 'Punjabi' },
  { code: 'bn', greeting: 'নমস্কার',          nativeName: 'বাংলা',       englishName: 'Bengali' },
  { code: 'ta', greeting: 'வணக்கம்',          nativeName: 'தமிழ்',       englishName: 'Tamil' },
  { code: 'te', greeting: 'నమస్తే',           nativeName: 'తెలుగు',     englishName: 'Telugu' },
  { code: 'kn', greeting: 'ನಮಸ್ಕಾರ',          nativeName: 'ಕನ್ನಡ',      englishName: 'Kannada' },
  { code: 'ml', greeting: 'നമസ്കാരം',         nativeName: 'മലയാളം',     englishName: 'Malayalam' },
  { code: 'or', greeting: 'ନମସ୍କାର',          nativeName: 'ଓଡ଼ିଆ',      englishName: 'Odia' },
  { code: 'as', greeting: 'নমস্কাৰ',          nativeName: 'অসমীয়া',    englishName: 'Assamese' },
];

const SUPPORTED_LANGUAGE_CODES = new Set<SupportedLanguageCode>(['en', 'hi', 'gu', 'mr']);

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
