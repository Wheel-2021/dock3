<script lang="ts" setup>
const changeImage = ref('');
console.log('custom', changeImage.value);
</script>
<template>
  <div class="main">
    <AdminHeader />
    <main class="contents">
      <slot />
    </main>
    <AdminFooter />
  </div>
</template>
<style scoped lang="scss"></style>
