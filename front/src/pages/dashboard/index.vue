<script lang="ts" setup>
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
      <section class="bg-white py-8">
        <h1 class="mb-2 text-xl font-medium text-center">ダッシュボード</h1>
        <p class="text-center text-gray-400 text-sm"><span v-if="currentUser">{{ currentUser.name }}さん、ようこそ管理画面へ。</span
          ></p>
      </section>
      <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
        <div
          class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          <br />

          <NuxtLink to="/dashboard/settings">セッティング</NuxtLink>
        </div>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
