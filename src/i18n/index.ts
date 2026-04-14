import { createI18n } from 'vue-i18n'
import br from './locales/br.json';
import en from './locales/en.json';

const i18n = createI18n<[any], string>({
  legacy: false, // Necessário para usar a Composition API (setup)
  locale: 'br',  // Idioma padrão
  fallbackLocale: 'en', // Idioma de reserva
  messages: {
    br,
    en
  }
});

export default i18n;