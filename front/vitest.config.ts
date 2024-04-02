import { defineConfig } from 'vitest/config';
import checker from 'vite-plugin-checker';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'pinia', 'vue-router'],
    }),
    checker({
      typescript: true,
    }),
    Vue(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      include: ['src/**/*.{vue,js,ts}'], // src配下の特定の拡張子のファイルのみをテスト対象に設定
      all: true, // 未テストのコードもカバレッジの対象にする
      reporter: ['html', 'clover', 'text'],
    },
    root: '.',
    reporters: ['verbose'],
  },
});
