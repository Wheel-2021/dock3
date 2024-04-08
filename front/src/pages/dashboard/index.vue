<script lang="ts" setup>
import { useAuthUser } from '@/composables/auth';
const currentUser = useAuthUser();
definePageMeta({
  middleware: 'user',
  layout: false,
});
</script>
<template>
  <NuxtLayout name="custom">
    <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
      <div
        class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
      >
        <span v-if="currentUser">{{ currentUser.name }}</span
        ><br />

        <NuxtLink to="/dashboard/settings">セッティング</NuxtLink>
      </div>
    </article>
  </NuxtLayout>
</template>
<style lang="scss" scoped></style>
