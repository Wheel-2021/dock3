import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
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
        bgBlue: '#E9F8FD',
        input: '#F1F1F1',
        gray: {
          50: ' #F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#071203',
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        noto: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
