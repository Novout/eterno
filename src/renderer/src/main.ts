import 'virtual:uno.css'
import './assets/main.css'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PubsubPlugin } from 'vue-pubsub'
import { router } from './router'
import { i18n } from './lang'
import VueSelect from 'vue-select'
import draggable from 'vuedraggable'
import Toast from 'vue-toastification'
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(PubsubPlugin())
  .use(router)
  .use(i18n)
  .use(Toast)
  .component('v-select', VueSelect)
  .component('draggable', draggable)
  .mount('#app')
