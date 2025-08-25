import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  theme: {
    colors: {
      primary: '#727272ff',
      secondary: '#444444ff',
      tertiary: '#555555ff',
      tabFocus: '#272727ff',
      primaryColored: '#DAE8F3'
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

      ::-webkit-scrollbar {
        width: 3px;
      }

      ::-webkit-scrollbar-track {
        background: ${theme.colors?.primary};
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors?.secondary};
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors?.tertiary};
      }
    `
    }
  ]
})
