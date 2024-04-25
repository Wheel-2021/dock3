<script lang="ts" setup>
import {
  UsersIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  QueueListIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline';
import { useAuthUser } from '@/composables/auth';
import { useAdminControll } from '@/composables/admin';

const { getDeletedUsers, deleteUserOne } = useAdminControll();
const currentUser = useAuthUser();

// 一週間経て削除するロジック
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
          if (result.user) {
            deleteUser(result.user.mail);
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
        <h1 class="mb-4 text-3xl font-medium text-center">
          管理者ダッシュボード
        </h1>
        <p class="text-center text-gray-400 text-sm leading-relaxed">
          管理者専用の領域です。全権限が与えられているので、操作にご注意を。
        </p>
      </section>
      <article class="contents__inner bg-gray-100 py-16 px-4">
        <div
          class="mx-auto p-4 overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          ここにメッセージが入る。
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mt-4">
          <div
            class="p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/admin/users"
            >
              <UsersIcon class="w-6 h-6 mb-2 text-sky-500" />
              ユーザー一覧
            </NuxtLink>
          </div>

          <div
            class="p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/dashboard/settings"
            >
              <Cog6ToothIcon class="w-6 h-6 mb-2 text-sky-500" />
              設定変更
            </NuxtLink>
          </div>

          <div
            class="p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/admin/cancel"
            >
              <ListBulletIcon class="w-6 h-6 mb-2 text-sky-500" />
              現在の退会申請一覧
            </NuxtLink>
          </div>

          <div
            class="p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/admin/pwreset"
            >
              <QueueListIcon class="w-6 h-6 mb-2 text-sky-500" />
              パスワードリセット一覧
            </NuxtLink>
          </div>
          <div
            class="p-6 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:bg-sky-100"
          >
            <NuxtLink
              class="flex flex-col justify-center items-center"
              to="/dashboard"
            >
              <ComputerDesktopIcon class="w-6 h-6 mb-2 text-sky-500" />
              ユーザー画面
            </NuxtLink>
          </div>
        </div>
      </article>

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
  </div>
</template>
<style lang="scss" scoped></style>
