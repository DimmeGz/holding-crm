import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import commonCz from '@/i18n/locales/cz/common.json';
import documentsCz from '@/i18n/locales/cz/documents.json';
import tablesCz from '@/i18n/locales/cz/tables.json';
import commonUk from '@/i18n/locales/uk/common.json';
import documentsUk from '@/i18n/locales/uk/documents.json';
import tablesUk from '@/i18n/locales/uk/tables.json';
import type { I18nResources } from '@/types/i18n.types';

const resources: I18nResources = {
  uk: {
    common: commonUk,
    tables: tablesUk,
    documents: documentsUk,
  },
  cz: {
    common: commonCz,
    tables: tablesCz,
    documents: documentsCz,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    defaultNS: 'common',
    ns: ['common', 'tables'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
