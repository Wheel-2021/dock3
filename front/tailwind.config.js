// const colors = require('tailwindcss/colors');
export default {
  content: [
    './src/components/**/*.{js,vue,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './src/app.vue',
  ],
  theme: {
    extend: {
      // aspectRatio: {
      //   auto: 'auto',
      //   square: '1 / 1',
      //   video: '16 / 9',
      // },
      // Set theme colors (Required config!)
      // colors: {
      //   primary: colors.blue,
      //   secondary: colors.slate,
      // },
    },
  },
  plugins: [],
};
