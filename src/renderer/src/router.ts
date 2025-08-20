import { createMemoryHistory, createRouter } from 'vue-router'

import Main from './pages/Main.vue'
import Options from './pages/Options.vue'

const routes = [
  { path: '/', component: Main },
  { path: '/options', component: Options },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})