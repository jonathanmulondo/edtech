import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Lazy load translations
const loadTranslations = async () => {
  const [enTranslation, swTranslation] = await Promise.all([
    fetch('/locales/en/translation.json').then((r) => r.json()),
    fetch('/locales/sw/translation.json').then((r) => r.json()),
  ]);

  return {
    en: { translation: enTranslation },
    sw: { translation: swTranslation },
  };
};

// Initialize i18n with basic config first
i18n.use(initReactI18next).init({
  resources: {},
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Load translations after initialization
loadTranslations().then((resources) => {
  Object.keys(resources).forEach((lng) => {
    i18n.addResourceBundle(lng, 'translation', resources[lng as keyof typeof resources].translation);
  });
});

export default i18n;
