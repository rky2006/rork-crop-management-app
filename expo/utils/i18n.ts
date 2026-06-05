import { useUser } from '@/contexts/UserContext';
import { translations, Language } from '@/constants/translations';

export function useTranslation() {
  const { language } = useUser();
  const lang = (language as Language) || 'en';

  const t = translations[lang] || translations.en;

  return { t, lang };
}
