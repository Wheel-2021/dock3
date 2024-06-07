<script lang="ts" setup>
import {
  Cog6ToothIcon,
  PencilIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  Squares2X2Icon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline';
import { useAuthUser } from '@/composables/auth';
const currentUser = useAuthUser();
const adminUser = ref();

if (currentUser.value !== null) {
  adminUser.value = currentUser.value.role === 'admin' ? true : false;
}

definePageMeta({
  middleware: 'user',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-white py-12">
        <hgroup>
          <span
            class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
            >DASHBOARD</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            ダッシュボード
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            <span v-if="currentUser"
              >{{ currentUser.name }}さん、ようこそ管理画面へ。</span
            >
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue py-16 px-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mt-4">
          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <Squares2X2Icon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/dashboard/"
            >
              ダッシュボード
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <PencilIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/dashboard/settings"
            >
              記事作成
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <Cog6ToothIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/dashboard/settings"
            >
              設定変更
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <ExclamationCircleIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/dashboard/cancel"
            >
              退会
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <EnvelopeIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/dashboard/inquiry"
            >
              問い合わせ
            </NuxtLink>
          </div>

          <div
            v-if="adminUser"
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <WrenchScrewdriverIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/admin"
            >
              管理者ダッシュボード
            </NuxtLink>
          </div>
        </div>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
