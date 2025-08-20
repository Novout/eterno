import { defineConfig, presetWind3, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons()
  ],
  theme: {
    colors: {
      primary: '#727272ff',
      secondary: '#444444ff',
      tertiary: '#555555ff',
      tabFocus: '#272727ff'
    }
  }
})
