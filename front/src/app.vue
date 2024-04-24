<script lang="ts" setup></script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.5s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
