import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import commonCz from '@/i18n/locales/cz/common.json';
import companiesCz from '@/i18n/locales/cz/companies.json';
import documentsCz from '@/i18n/locales/cz/documents.json';
import reportsCz from '@/i18n/locales/cz/reports.json';
import tablesCz from '@/i18n/locales/cz/tables.json';
import commonUk from '@/i18n/locales/uk/common.json';
import companiesUk from '@/i18n/locales/uk/companies.json';
import documentsUk from '@/i18n/locales/uk/documents.json';
import reportsUk from '@/i18n/locales/uk/reports.json';
import tablesUk from '@/i18n/locales/uk/tables.json';
import type { I18nResources } from '@/types/i18n.types';

const resources: I18nResources = {
  uk: {
    common: commonUk,
    tables: tablesUk,
    documents: documentsUk,
    companies: companiesUk,
    reports: reportsUk,
  },
  cz: {
    common: commonCz,
    tables: tablesCz,
    documents: documentsCz,
    companies: companiesCz,
    reports: reportsCz,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    defaultNS: 'common',
    ns: ['common', 'tables', 'documents', 'companies', 'reports'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
