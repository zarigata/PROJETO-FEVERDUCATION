// CODEX: i18n configuration with expanded language support
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import pt from './locales/pt.json';
import jp from './locales/jp.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

i18next.use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      jp: { translation: jp },
      es: { translation: es },
      fr: { translation: fr }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18next;
