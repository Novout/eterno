import { createI18n } from 'vue-i18n'

import * as enUS from './en-US'
import * as ptBR from './pt-BR'

export const i18n = createI18n({
  legacy: false,
  locale: 'English',
  fallbackLocale: 'English',
  messages: {
    English: enUS.default,
    'Português do Brasil': ptBR.default
  }
})
