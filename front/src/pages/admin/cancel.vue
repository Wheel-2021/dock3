<script lang="ts" setup>
import { UserCircleIcon } from '@heroicons/vue/24/outline';
import { useAdminControll } from '@/composables/admin';
const { getDeletedUsers } = useAdminControll();

const users = ref();
const displayDeleteUser = async () => {
  try {
    const result = await getDeletedUsers();
    console.log(result);
    users.value = result.user;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  displayDeleteUser();
});
definePageMeta({
  middleware: 'admin',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-bgBlue py-12">
        <hgroup>
          <span
            class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
            >CANCEL LIST</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            削除対象ユーザー一覧
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            退会するユーザーが表示されています。
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue pb-16 px-4">
        <section class="mx-auto p-4 bg-white rounded-lg shadow-sm">
          <div class="relative pt-30 md:pt-20 lg:pt-12 overscroll-y-auto">
            <dl
              class="absolute top-0 left-0 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 w-full bg-gray-800 text-gray-200"
            >
              <dt
                class="p-2 bg-gray-800 border-b border-gray-600 lg:border-0 font-normal text-sm"
              >
                ID
              </dt>

              <dt
                class="col-span-2 p-2 bg-gray-800 border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                名前
              </dt>
              <dt
                class="p-2 bg-gray-800 border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                権限
              </dt>
              <dt
                class="p-2 bg-gray-800 border-b border-l border-r border-gray-600 md:border-r-0 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                削除
              </dt>
              <dt
                class="p-2 border-b border-l border-r border-gray-600 lg:border-b-0 lg:border-l bg-gray-800 font-normal text-sm"
              >
                退会日
              </dt>
              <dt
                class="p-2 border-b border-l border-r border-gray-600 lg:border-b-0 lg:border-l bg-gray-800 font-normal text-sm"
              >
                抹消予定日
              </dt>
            </dl>

            <dl
              class="grid lg:gap-2 grid-cols-3 md:grid-cols-5 lg:grid-cols-7 w-full lg:py-2 odd:bg-gray-50 even:bg-white border-gray-200 border-dotted border-r border-b lg:border-r-0 text-sm transition-colors duration-300 transform hover:bg-blue-50"
              v-for="(user, index) in users"
              :key="index"
            >
              <dt
                class="flex items-center justify-end col-span-1 p-2 border-b border-l border-gray-200 border-dotted lg:border-none font-normal"
              >
                {{ user.id }}
              </dt>

              <dd
                class="flex items-center col-span-2 p-2 border-b border-l border-gray-200 border-dotted lg:border-none"
              >
                <NuxtImg
                  v-if="user.filename"
                  :src="`/avator/${user.filename}`"
                  width="30"
                  class=""
                  :alt="user.name || ''"
                />
                <UserCircleIcon
                  v-else
                  stroke-width="0.1"
                  class="w-8 h-8text-gray-500"
                />
                <span class="ml-2">{{ user.name }}</span>
              </dd>

              <dd
                class="flex items-center col-span-1 p-2 border-b border-l border-gray-200 border-dotted lg:border-none"
              >
                <span
                  v-if="user.role === 'admin'"
                  class="p-2 rounded-full bg-blue-600 text-white text-xs"
                  >管理者</span
                >
                <span
                  v-if="user.role === 'user'"
                  class="p-2 rounded-full border border-blue-600 text-blue-600 text-xs whitespace-nowrap"
                  >ユーザー</span
                >
              </dd>
              <dd
                class="flex items-center p-2 border-b border-l border-r border-gray-200 border-dotted md:border-r-0 lg:border-none"
              >
                <span
                  v-if="user.deleted"
                  class="p-2 border border-blue-600 text-blue-600 text-xs"
                  >削除対象</span
                >
              </dd>
              <dd
                class="flex items-center col-span-1 p-2 border-b border-l border-gray-200 border-dotted md:border-b-0 lg:border-none"
              >
                {{ new Date(user.deletedAt).toLocaleString() }}
              </dd>
              <dd
                class="flex items-center col-span-1 p-2 border-b border-l border-gray-200 border-dotted md:border-b-0 lg:border-none text-red-600"
              >
                {{
                  new Date(
                    new Date(user.deletedAt).getTime() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleString()
                }}
              </dd>
            </dl>
            <div class="flex justify-center border-t-2 border-accent"></div>
          </div>
        </section>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
