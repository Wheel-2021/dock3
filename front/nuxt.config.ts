// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'noindex' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  css: [
    '@/assets/css/reset.css',
    '@/assets/css/main.css',
    '@/assets/css/style.scss',
  ],
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    plugins: ['@/server/plugins/mongodb.ts'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
  },
  srcDir: 'src/',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "@/assets/css/_variables.scss"; @import "@/assets/css/_mixin.scss";',
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
      hmr: {
        overlay: false,
      },
      watch: {
        usePolling: true,
      },
    },
  },
  typescript: {
    shim: false,
    strict: true,
    typeCheck: true,
  },
});
