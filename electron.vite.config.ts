import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { FontaineTransform } from 'fontaine'
import { resolve } from 'path'
import unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import version from 'vite-plugin-package-version'
import autoImport from 'unplugin-auto-import/vite'
import checker from 'vite-plugin-checker'
//import optimize from 'vite-plugin-optimize-persist'
//import config from 'vite-plugin-package-config'
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
      version(),
      autoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        imports: ['vue', 'vue-router']
      }),
      checker({
        vueTsc: true
      }),
      //optimize(),
      //config(),
      Components({ dts: true }),
      FontaineTransform.vite({
        fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans']
      })
    ]
  }
})
