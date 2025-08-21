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
  },
  preflights: [
    {
      getCSS: ({ theme }) => `
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        font-weight: normal;
      }

      *:focus {
        outline: none;
      }

      textarea:focus,
      input:focus {
        outline: none;
      }

      ul {
        list-style: none;
      }

      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `
    }
  ]
})
