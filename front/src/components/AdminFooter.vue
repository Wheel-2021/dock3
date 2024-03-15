<script lang="ts" setup>
const now = new Date();
const currentYear = now.getFullYear();
</script>
<template>
  <footer class="footer">
    <p class="text-center text-xs text-gray-400">Ⓒ {{ currentYear }} 会社名</p>
  </footer>
</template>

<style lang="scss" scoped></style>
