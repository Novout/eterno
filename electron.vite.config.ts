import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { FontaineTransform } from 'fontaine'
import { resolve } from 'path'
import unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
// @ts-ignore
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    optimizeDeps: {
      include: ['uuid', 'date-fns', 'vuedraggable']
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ['webview'].includes(tag)
          }
        }
      }),
      unocss(),
      Components({ dts: true }),
      FontaineTransform.vite({
        fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans']
      })
    ]
  }
})
