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
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
      },
      colors: {
        main: '#38BDF8',
        sub: '#3B82F6',
        spare: '#4338CA',
        caution: '#BE123C',
        accent: '#27272A',
        gold: '#F9E088',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        noto: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
