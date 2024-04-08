<script lang="ts" setup>
import { useAuthUser } from '@/composables/auth';
const currentUser = useAuthUser();

definePageMeta({
  middleware: 'admin',
  layout: false,
});
</script>
<template>
  <NuxtLayout name="custom">
    <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
      <div
        class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
      >
        登録者一覧<br />
        パスワードリセット一覧<br />
        登録者退会(1週間後にDBから削除：論理削除から物理削除へ)

        <span v-if="currentUser">{{ currentUser.name }}</span>
        <a href="/admin/sample">サンプルページ</a><br />
        こんてんつ<br />
        <a href="/dashboard/">ダッシュボード</a>
      </div>
    </article>
  </NuxtLayout>
</template>
<style lang="scss" scoped></style>
