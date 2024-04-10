<script lang="ts" setup>
import { Dialog, DialogPanel } from '@headlessui/vue';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PencilIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline';
import { useAuth, useAuthUser } from '@/composables/auth';

const currentUser = useAuthUser();
console.log('AdminHeader', currentUser);
const { logout } = useAuth();
const mobileMenuOpen = ref(false);

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
}

const out = async () => {
  try {
    await logout().then((result) => {
      console.log(result);
      location.href = '/';
    });
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <header class="inset-x-0 top-0 z-50">
    <nav
      class="flex items-center justify-between p-6 lg:px-8"
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
            @click="out"
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
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
          >
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Dialog
        as="div"
        class=""
        :open="mobileMenuOpen"
        @close="mobileMenuOpen = false"
      >
        <div class="fixed inset-0 z-50" />
        <DialogPanel
          class="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6"
        >
          <div class="flex items-center justify-between">
            <a href="/" class="-m-1.5 p-1.5">
              <span>会社ロゴ</span>
            </a>
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700"
              @click="mobileMenuOpen = false"
            >
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-dashed">
              <div class="py-6">
                <button
                  @click="out"
                  class="headerLogin w-full flex items-center justify-center px-6 mt-4 text-sm font-medium tracking-wide text-gray-700 capitalize transition-all duration-200 transform border border-gray-300 rounded-lg sm:mt-0 gap-x-2 h-11 dark:text-white hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500 focus:ring focus:ring-blue-300 dark:focus:ring-white/10 focus:ring-opacity-80"
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
              <NuxtLink class="flex items-center py-4" to="/dashboard/">
                <PencilIcon class="w-6 h-6 mb-2 text-sky-500" />
                ダッシュボード
              </NuxtLink>
              <NuxtLink class="flex items-center" to="/dashboard/settings">
                <PencilIcon class="w-6 h-6 mb-2 text-sky-500" />
                記事作成
              </NuxtLink>
              <NuxtLink class="flex items-center" to="/dashboard/settings">
                <Cog6ToothIcon class="w-6 h-6 mb-2 text-sky-500" />
                設定変更
              </NuxtLink>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </nav>
  </header>
</template>

<style lang="scss" scoped></style>
