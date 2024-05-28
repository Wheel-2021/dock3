<script lang="ts" setup>
import {
  Squares2X2Icon,
  UsersIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  QueueListIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline';

import { useAdminControll } from '@/composables/admin';

const { getDeletedUsers, deleteUserOne } = useAdminControll();

// 一週間経て削除するロジック ※どうも機能していないみたい
const checkDletedCancel = async () => {
  try {
    const result = await getDeletedUsers();
    // result.userは配列になっている
    if (Array.isArray(result.user)) {
      result.user.forEach((user) => {
        const currentDeletedAt = user.deletedAt;
        if (
          currentDeletedAt &&
          new Date(
            new Date(currentDeletedAt).getTime() + 7 * 24 * 60 * 60 * 1000
          ).toLocaleString() < new Date().toLocaleString()
        ) {
          console.log(
            'check',
            new Date(
              new Date(currentDeletedAt).getTime() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleString(),
            new Date().toLocaleString()
          );
          // delete cancel
          if (user) {
            console.log('delete cancel', user.mail);
            deleteUser(user.mail);
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ユーザー即時削除
const deleteUser = async (mail: string) => {
  try {
    const result = await deleteUserOne(mail);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

checkDletedCancel();

definePageMeta({
  middleware: 'admin',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-white py-12">
        <hgroup>
          <span
            class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
            >ADMIN DASHBOARD</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            管理者ダッシュボード
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            管理者専用の領域です。全権限が与えられているので、操作にご注意を。
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue py-16 px-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mt-4">
          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <Squares2X2Icon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/admin/"
            >
              管理者ダッシュボード
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <UsersIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/admin/users"
            >
              ユーザー一覧
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <Cog6ToothIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/admin/users"
            >
              設定変更
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <ListBulletIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/admin/cancel"
            >
              現在の退会申請一覧
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <QueueListIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/admin/pwreset"
            >
              パスワードリセット一覧
            </NuxtLink>
          </div>

          <div
            class="relative bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100 sm:h-32"
          >
            <div
              class="absolute top-3 left-3 inline-flex items-center justify-center rounded-full p-1 bg-main"
            >
              <ComputerDesktopIcon class="w-4 h-4 text-white" />
            </div>

            <NuxtLink
              class="flex flex-col justify-center items-center h-full p-6"
              to="/dashboard/"
            >
              ユーザー画面
            </NuxtLink>
          </div>
        </div>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
