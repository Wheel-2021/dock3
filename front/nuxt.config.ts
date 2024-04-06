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
  image: {
    domains: [],
    screens: {},
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  nitro: {
    plugins: ['@/server/index.ts'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    apiSecret: {
      MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mongo:27017',
    },
    sessionCookieName: process.env.SESSION_COOKIE_NAME || '__session', // クッキー作成用シークレットコード
    sessionCookieSecret: process.env.SESSION_COOKIE_SECRET || 'secret',
    sessionExpires: parseInt(process.env.SESSION_EXPIRES || '60 * 30', 10), // 30分
    sessionIdPrefix: process.env.SESSION_ID_PREFIX || 'sess:', // Redisセッション保存用セッションIDプレフィックス
    sessionRedisUrl: process.env.SESSION_REDIS_URL || 'redis://redis:6379/',
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
