/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['src/**/*.tsx'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      text: colors.gray[900],
      disabled: colors.slate[500],
      grey: colors.slate[700],
      light: colors.stone[300],
      link: colors.blue[700],
    },
    keyframes: {
      loading: {
        from: { width: 0, left: 0 },
        to: { width: 0, right: 0 },
        '50%': { width: '100%' },
      },
    },
    animation: {
      loading: 'loading 720ms linear infinite',
    },
  },
  plugins: [],
};
