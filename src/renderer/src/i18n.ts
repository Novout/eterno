import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': {
      default: {
        title: 'Eterno.',
        description: 'A lightweight browser.',
        placeholder: 'Look for something that interests you...'
      }
    },
    'pt-BR': {
      default: {
        title: 'Eterno.',
        description: 'Um navegador leve.',
        placeholder: 'Procure algo de seu interesse...'
      }
    }
  }
})
