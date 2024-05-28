<script lang="ts" setup>
import { useAuthUser, useAuth } from '@/composables/auth';
import { useForm } from 'vee-validate';
import useErrorHandler from '@/composables/useErrorHandler';

const router = useRouter();
const currentUser = useAuthUser();
const { logout, cancel } = useAuth();
const serverMessage = ref();

const { errors, handleSubmit } = useForm({});

type DeletedInfo = {
  mail: string | undefined;
  deletedFlag: boolean;
};

const deletedInfo: DeletedInfo = {
  mail: '',
  deletedFlag: false,
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);

const signOut = async () => {
  try {
    await logout().then((result) => {
      console.log(result);
      const redirect = '/';
      router.push({ path: redirect });
    });
  } catch (error) {
    console.log(error);
  }
};

const submit = handleSubmit(async () => {
  deletedInfo.mail = currentUser.value?.mail;
  deletedInfo.deletedFlag = true;

  try {
    const result = await cancel(deletedInfo.mail, deletedInfo.deletedFlag);

    if (result && 'message' in result) {
      if (result.message === '退会成功！') {
        serverMessage.value = result.message + 'トップページに遷移します。';
        // logout後に遷移しない
        signOut();
      } else {
        serverMessage.value = result.message;
      }
    }
    if (result && 'session' in result) {
      return result.session;
    }
  } catch (error) {
    console.log('Error updating information:', error);
  }
}, handleError);

definePageMeta({
  middleware: 'user',
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
            >ACCOUNT CANCEL</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            アカウント削除画面
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            退会する場合は、こちらより退会してください。<br
              class="hidden sm:!block"
            />1週間はアカウント情報を保持しているので、<br
              class="hidden sm:!block"
            />退会後でも情報を復活させることができます。
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue pb-16 px-4">
        <div class="sm:flex"></div>
        <div class="bg-white rounded-lg shadow-sm"></div>
        <div class="sm:px-6">
          <form @submit.prevent="submit">
            <div
              class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div class=""></div>
              <div
                class="flex items-center justify-center h-48 p-4 bg-white rounded-lg shadow-sm"
              >
                <p>
                  <span
                    v-if="serverMessage"
                    class="text-caution text-xs font-bold"
                    >{{ serverMessage }}</span
                  >
                </p>
                <button
                  class="px-6 py-2 text-sm font-medium tracking-wide text-white font-noto capitalize transition-colors duration-300 transform bg-accent rounded-full hover:bg-spare focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  退会
                </button>
              </div>
            </div>
          </form>
        </div>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
