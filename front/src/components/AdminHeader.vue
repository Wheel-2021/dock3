<script lang="ts" setup>
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PencilIcon,
  ExclamationCircleIcon,
  HomeIcon,
  EnvelopeIcon,
  UsersIcon,
  ListBulletIcon,
  QueueListIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline';
import { useAuth, useAuthUser } from '@/composables/auth';

const router = useRouter();
const currentUser = useAuthUser();
console.log('AdminHeader', currentUser);
const { logout } = useAuth();
const mobileMenuOpen = ref(false);

const adminUser = ref();

const avator = ref({
  image: null as string | null,
  name: null as string | null,
});

if (currentUser.value !== null) {
  avator.value.image = currentUser.value.filename
    ? `/avator/${currentUser.value.filename}`
    : null;
  avator.value.name = currentUser.value.name;
  console.log(avator.value, currentUser.value.filename);
  adminUser.value = currentUser.value.role === 'admin' ? true : false;
}

const signOut = async () => {
  try {
    await logout().then((result) => {
      console.log(result);
      // location.href = '/';
      const redirect = '/';
      router.push({ path: redirect });
    });
  } catch (error) {
    console.log(error);
  }
};

const menuBtnAction = (flag: boolean) => {
  if (flag === true) {
    mobileMenuOpen.value = true;
  } else {
    mobileMenuOpen.value = false;
  }
  console.log('click', mobileMenuOpen.value);
};
</script>
<template>
  <header class="inset-x-0 top-0 z-50">
    <nav
      class="flex items-center justify-between p-6 lg:p-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="logo">会社ロゴ</span>
        </a>
      </div>
      <div class="flex items-center justify-end">
        <div class="mr-4">
          <NuxtImg
            v-if="avator.image"
            :src="avator.image"
            width="36"
            :alt="avator.name || ''"
          />
          <UserCircleIcon
            v-else
            stroke-width="0.1"
            class="w-10 h-10 text-gray-500"
          />
        </div>
        <div class="hidden sm:!block mr-6">
          <button
            @click="signOut"
            class="headerLogin flex items-center justify-center px-6 mt-4 text-sm font-medium tracking-wide text-gray-700 capitalize transition-all duration-200 transform border border-gray-300 rounded-lg sm:mt-0 gap-x-2 h-11 dark:text-white hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500 focus:ring focus:ring-blue-300 dark:focus:ring-white/10 focus:ring-opacity-80"
          >
            ログアウト
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              ></path>
            </svg>
          </button>
        </div>
        <div class="flex">
          <button
            type="button"
            class="naviWrap__open -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="menuBtnAction(true)"
          >
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        class="naviWrap fixed inset-0 px-6 lg:px-8 py-10 bg-white overflow-y-auto transition duration-200 ease-in-out"
        :class="{
          '-z-50 opacity-0': !mobileMenuOpen,
          'z-50 opacity-100': mobileMenuOpen,
        }"
      >
        <div class="flex items-center justify-end">
          <button
            type="button"
            class="menu__btn naviWrap__close -m-2.5 rounded-md p-2.5 text-gray-700"
            @click="menuBtnAction(false)"
          >
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-dashed">
            <div class="sm:w-1/4 py-6">
              <button
                @click="signOut"
                class="naviWrap__close headerLogin w-full flex items-center justify-center px-6 mt-4 text-sm font-medium tracking-wide text-gray-700 capitalize transition-all duration-200 transform border border-gray-300 rounded-lg sm:mt-0 gap-x-2 h-11 dark:text-white hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500 focus:ring focus:ring-blue-300 dark:focus:ring-white/10 focus:ring-opacity-80"
              >
                ログアウト
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  ></path>
                </svg>
              </button>
            </div>

            <NuxtLink
              v-if="adminUser"
              class="naviWrap__close flex items-center py-4 text-red-300"
              @click="menuBtnAction(false)"
              to="/admin"
            >
              <HomeIcon class="w-6 h-6 mr-4" />
              ダッシュボード(管理者専用)
            </NuxtLink>

            <NuxtLink
              v-if="adminUser"
              class="naviWrap__close flex items-center py-4 text-red-300"
              @click="menuBtnAction(false)"
              to="/admin/users"
            >
              <UsersIcon class="w-6 h-6 mr-4" />
              ユーザー一覧(管理者専用)
            </NuxtLink>
            <NuxtLink
              v-if="adminUser"
              class="naviWrap__close flex items-center py-4 text-red-300"
              @click="menuBtnAction(false)"
              to="/admin/cancel"
            >
              <ListBulletIcon class="w-6 h-6 mr-4" />
              現在の退会申請一覧(管理者専用)
            </NuxtLink>
            <NuxtLink
              v-if="adminUser"
              class="naviWrap__close flex items-center py-4 text-red-300"
              @click="menuBtnAction(false)"
              to="/admin/pwreset"
            >
              <QueueListIcon class="w-6 h-6 mr-4" />
              パスワードリセット一覧(管理者専用)
            </NuxtLink>

            <NuxtLink
              class="naviWrap__close flex items-center py-4"
              @click="menuBtnAction(false)"
              to="/dashboard"
            >
              <HomeIcon class="w-6 h-6 mr-4 text-grey-500" />
              ダッシュボード
            </NuxtLink>
            <NuxtLink
              class="naviWrap__close flex items-center py-4"
              @click="menuBtnAction(false)"
              to="/dashboard/settings"
            >
              <PencilIcon class="w-6 h-6 mr-4 text-grey-500" />
              記事作成
            </NuxtLink>

            <NuxtLink
              class="naviWrap__close flex items-center py-4"
              @click="menuBtnAction(false)"
              to="/dashboard/settings"
            >
              <Cog6ToothIcon class="w-6 h-6 mr-4 text-grey-500" />
              <p>設定変更</p>
            </NuxtLink>
            <NuxtLink
              class="naviWrap__close flex items-center py-4"
              @click="menuBtnAction(false)"
              to="/dashboard/cancel"
            >
              <ExclamationCircleIcon class="w-6 h-6 mr-4 text-grey-500" />
              退会
            </NuxtLink>
            <NuxtLink
              class="naviWrap__close flex items-center py-4"
              @click="menuBtnAction(false)"
              to="/dashboard/inquiry"
            >
              <EnvelopeIcon class="w-6 h-6 mr-4 text-grey-500" />
              問い合わせ
            </NuxtLink>

            <div class="border-b-1 border-dashed"></div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped></style>
