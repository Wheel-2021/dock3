<script lang="ts" setup>
import { useAdminControll } from '@/composables/admin';

const { getPwresetUsers } = useAdminControll();
const uuides = ref();

const pwresetUsers = async () => {
  try {
    const result = await getPwresetUsers();
    uuides.value = result.uuid;
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  pwresetUsers();
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
            >PASSWORD RESET LIST</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            パスワードリセット一覧
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            パスワードリセットの一覧です。
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue pb-16 px-4">
        <section class="mx-auto p-4 bg-white rounded-lg shadow-sm">
          <div class="relative pt-40 md:pt-20 lg:pt-12 overscroll-y-auto">
            <dl
              class="absolute top-0 left-0 grid grid-cols-1 sm:grid-cols-3 w-full bg-accent text-gray-200"
            >
              <dt
                class="p-2 bg-accent border-b border-gray-600 lg:border-0 font-normal text-sm"
              >
                ID
              </dt>
              <dt
                class="p-2 bg-accent border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                生成UUID
              </dt>
              <dt
                class="p-2 bg-accent border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                リセット日時
              </dt>
            </dl>

            <dl
              class="grid lg:gap-2 grid-cols-1 sm:grid-cols-3 w-full lg:py-2 odd:bg-gray-50 even:bg-white border-gray-200 border-dotted border-r border-b sm:border-r-0 text-sm transition-colors duration-300 transform hover:bg-blue-50"
              v-for="(uuid, index) in uuides"
              :key="index"
            >
              <dt
                class="flex items-center p-2 border-b border-l border-gray-200 border-dotted lg:border-none font-normal"
              >
                {{ uuid._id }}
              </dt>

              <dd
                class="flex items-center p-2 border-b border-l border-gray-200 border-dotted lg:border-none"
              >
                {{ uuid.uuid }}
              </dd>
              <dd
                class="flex items-center p-2 border-b border-l border-r-0 border-gray-200 border-dotted sm:border-r lg:border-none"
              >
                {{ new Date(uuid.expires).toLocaleString() }}
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
