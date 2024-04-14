<script lang="ts" setup>
definePageMeta({
  middleware: 'admin',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
        <div
          class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          <a href="/admin/">管理画面トップページ</a>
          こんてんつ
        </div>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
