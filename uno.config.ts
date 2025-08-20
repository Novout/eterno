import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  theme: {
    colors: {
      primary: '#727272ff',
      secondary: '#444444ff',
      tertiary: '#555555ff',
      tabFocus: '#272727ff'
    }
  }
})
