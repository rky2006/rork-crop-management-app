import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Language, LANGUAGE_OPTIONS, translate } from '@/constants/localization';

const LANGUAGE_STORAGE_KEY = 'kishan_language';

async function loadLanguage(): Promise<Language> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'hi' ? 'hi' : 'en';
}

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadLanguage()
      .then((storedLanguage) => {
        if (isMounted) {
          setLanguageState(storedLanguage);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    void AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return translate(language, key, params);
  }, [language]);

  return useMemo(() => ({
    language,
    isReady,
    languages: LANGUAGE_OPTIONS,
    setLanguage,
    t,
  }), [isReady, language, setLanguage, t]);
});
