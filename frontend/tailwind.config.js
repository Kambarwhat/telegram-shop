/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tg: {
          bg: 'var(--tg-theme-bg-color, #ffffff)',
          text: 'var(--tg-theme-text-color, #000000)',
          hint: 'var(--tg-theme-hint-color, #999999)',
          link: 'var(--tg-theme-link-color, #2481cc)',
          button: 'var(--tg-theme-button-color, #2481cc)',
          buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
          secondaryBg: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
          headerBg: 'var(--tg-theme-header-bg-color, #ffffff)',
          accentText: 'var(--tg-theme-accent-text-color, #2481cc)',
          sectionBg: 'var(--tg-theme-section-bg-color, #f1f1f1)',
          sectionHeader: 'var(--tg-theme-section-header-text-color, #6d6d72)',
          subtitle: 'var(--tg-theme-subtitle-text-color, #6d6d72)',
          destructiveText: 'var(--tg-theme-destructive-text-color, #ff3b30)',
        }
      }
    },
  },
  plugins: [],
}