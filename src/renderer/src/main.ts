import 'virtual:uno.css'
import './assets/main.css'
import 'vue-toastification/dist/index.css'
import * as Sentry from '@sentry/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PubsubPlugin as createPubsub } from 'vue-pubsub'
import { router } from './router'
import { i18n } from './lang'
import draggable from 'vuedraggable'
import Toast from 'vue-toastification'
import App from './App.vue'
import { useEnv } from './use/env'

const app = createApp(App)
const env = useEnv()

if (!env.isDev()) {
  Sentry.init({
    app,
    dsn: env.getSentry(),
    sendDefaultPii: true
  })
}

app
  .use(createPinia())
  .use(createPubsub())
  .use(router)
  .use(i18n)
  .use(Toast)
  .component('draggable', draggable)
  .mount('#app')
