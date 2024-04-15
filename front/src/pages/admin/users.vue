<script lang="ts" setup>
import { useAdmini } from '@/composables/admin';
const { getAllUsers } = useAdmini();

const users = ref();

const allDBUsers = async () => {
  try {
    const result = await getAllUsers();
    console.log('users.vue', result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  // users.value = await allDBUsers();
  console.log('users');
  console.log('users.vue', allDBUsers());
});

definePageMeta({
  middleware: 'admin',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-white py-12">
        <h1 class="mb-4 text-3xl font-medium text-center">登録ユーザー一覧</h1>
        <p class="text-center text-gray-400 text-sm leading-relaxed">
          登録されたユーザーが表示されています。全権限が与えられているので、操作にご注意を。
        </p>
      </section>
      <article class="contents__inner bg-gray-100 py-16 px-4">
        <div
          class="mx-auto p-4 overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          <dl v-for="(user, index) in users" :key="index">
            <dt>{{ user.id }}</dt>
            <dd>{{ user.name }}</dd>
            <dd>{{ user.mail }}</dd>
            <dd>{{ user.password }}</dd>
            <dd>{{ user.filename }}</dd>
            <dd>{{ user.role }}</dd>
            <dd>{{ user.deleted }}</dd>
          </dl>
        </div>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
