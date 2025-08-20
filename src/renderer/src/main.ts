import 'virtual:uno.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PubsubPlugin } from "vue-pubsub";
import { router } from './router'
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(PubsubPlugin())
  .use(router)
  .mount('#app')
