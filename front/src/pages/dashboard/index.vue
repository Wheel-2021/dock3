<script lang="ts" setup>
import {
  Cog6ToothIcon,
  PencilIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
} from '@heroicons/vue/24/outline';
import { useAuthUser } from '@/composables/auth';
const currentUser = useAuthUser();
definePageMeta({
  middleware: 'user',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-white py-12">
        <h1 class="mb-4 text-3xl font-medium text-center">ダッシュボード</h1>
        <p class="text-center text-gray-400 text-sm leading-relaxed">
          <span v-if="currentUser"
            >{{ currentUser.name }}さん、ようこそ管理画面へ。</span
          >
        </p>
      </section>
      <article class="contents__inner bg-gray-100 py-16 px-4">
        <div
          class="mx-auto p-4 overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          ここにメッセージが入る。
        </div>
        <div class="sm:flex mt-4">
          <div
            class="sm:w-1/4 sm:mr-4 mb-4 sm:!mb-0 p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/dashboard/settings"
            >
              <PencilIcon class="w-6 h-6 mb-2 text-sky-500" />
              記事作成
            </NuxtLink>
          </div>

          <div
            class="sm:w-1/4 sm:mr-4 mb-4 sm:!mb-0 p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/dashboard/settings"
            >
              <Cog6ToothIcon class="w-6 h-6 mb-2 text-sky-500" />
              設定変更
            </NuxtLink>
          </div>

          <div
            class="sm:w-1/4 sm:mr-4 mb-4 sm:!mb-0 p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/dashboard/cancel"
            >
              <ExclamationCircleIcon class="w-6 h-6 mb-2 text-sky-500" />
              退会
            </NuxtLink>
          </div>

          <div
            class="sm:w-1/4 mb-4 sm:!mb-0 p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/dashboard/inquiry"
            >
              <EnvelopeIcon class="w-6 h-6 mb-2 text-sky-500" />
              問い合わせ
            </NuxtLink>
          </div>
        </div>
        <NuxtImg
          src="/avator/avator_94e100cb-530b-4109-a726-412c49a2dfdb.png"
          width="36"
          alt="avator"
        />
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
