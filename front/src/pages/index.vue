<script lang="ts" setup>
import { Dialog, DialogPanel } from '@headlessui/vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

definePageMeta({
  layout: false,
});
</script>
<template>
  <div class="top bg-white">
    <div
      class="bg-[url('@/assets/images/top_bg-min.jpg')] bg-center bg-cover bg-no-repeat"
    >
      <div class="px-6 lg:px-8 bg-purple-700 bg-opacity-70">
        <PageHeader />

        <div class="sm:-top-80" aria-hidden="true"></div>
        <section class="mx-auto max-w-2xl pt-8 pb-20">
          <div class="hidden sm:mb-8 sm:flex sm:justify-center"></div>
          <div class="text-center">
            <h1
              class="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
              見出しが入るよ
            </h1>
            <p class="mt-6 text-lg leading-8 text-white">
              リード文と登録への誘導がはいるよ。リード文と登録への誘導がはいるよ。リード文と登録への誘導がはいるよ。リード文と登録への誘導がはいるよ。リード文と登録への誘導がはいるよ。
            </p>
            <div
              class="mt-10 sm:flex sm:items-center sm:justify-center gap-x-6"
            >
              <a
                href="/register"
                class="relative inline-block w-full p-px rounded-lg sm:w-auto group h-11 bg-gradient-to-r from-purple-600 to-sky-500 dark:from-purple-600 dark:to-blue-400 before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-400 before:to-sky-400 dark:before:from-purple-600 dark:before:to-sky-500 before:scale-75 before:opacity-50 before:rounded-md before:blur-lg before:transition before:duration-300 active:before:scale-90 focus:before:scale-90 focus:before:opacity-75 hover:before:scale-100 hover:before:opacity-100"
                ><span
                  class="relative flex justify-center h-full text-sm font-medium items-center text-white tracking-wide bg-indigo-700 px-[calc(1.5rem-1px)] rounded-[calc(0.5rem-1px)] group-hover:bg-indigo-800 transition duration-300"
                >
                  登録
                </span></a
              >
              <a
                href="/login"
                class="flex items-center justify-center px-6 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-all duration-200 transform border border-gray-300 rounded-lg sm:mt-0 gap-x-2 h-11 dark:text-white hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500 focus:ring focus:ring-blue-300 dark:focus:ring-white/10 focus:ring-opacity-80"
              >
                ログイン
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  ></path></svg
              ></a>
            </div>
          </div>
        </section>
      </div>
    </div>

    <section class="text-center">ここにもはいるよ。。。</section>
    <div class="flex items-center mt-2 ps-4 border border-gray-200 rounded-lg">
      <input
        id="deleted"
        type="checkbox"
        name="deleted"
        class="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
      />
      <label
        for="deleted"
        class="w-full p-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >削除する</label
      >
    </div>
    <PageFooter />
  </div>
</template>
<style lang="scss">
.top {
  .logo,
  .headerLogin {
    color: #fff;
  }
}
</style>
