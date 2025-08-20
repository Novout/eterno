import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
  },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [vue(), unocss(), Components({ dts: true })]
  }
})
