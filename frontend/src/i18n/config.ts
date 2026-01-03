import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import commonUk from '@/i18n/locales/uk/common.json';
import commonCz from '@/i18n/locales/cz/common.json';
import type { I18nResources } from '@/types/i18n.types';

const resources: I18nResources = {
  uk: {
    common: commonUk,
  },
  cz: {
    common: commonCz,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    defaultNS: 'common',
    ns: ['common', 'orders'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
