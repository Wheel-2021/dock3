<script lang="ts" setup>
import { useAuthUser } from '@/composables/auth';
const currentUser = useAuthUser();

definePageMeta({
  middleware: 'admin',
});
</script>
<template>
  <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
    <div
      class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <span v-if="currentUser">{{ currentUser.name }}</span>
      <a href="/admin/sample">サンプルページ</a><br />
      こんてんつ<br />
      <a href="/dashboard/">ダッシュボード</a>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
