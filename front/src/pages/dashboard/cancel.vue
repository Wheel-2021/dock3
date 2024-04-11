<script lang="ts" setup>
import { useAuthUser, useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import useImageUpload from '@/composables/useImageUpload';
import useErrorHandler from '@/composables/useErrorHandler';
import { prepareFormData } from '@/utils/prepareImageFormData';
import type { User } from '@/types/user';

const router = useRouter();
const currentUser = useAuthUser();
const { getDBUser, infoUpdate } = useAuth();
const userDBData = currentUser.value
  ? ((await getDBUser(currentUser.value.mail)) as { user: User })
  : null;

const setDirName = 'avator';
const serverMessage = ref();


let formData = new FormData();

const { errors, handleSubmit } = useForm({
});

let userData: User = {
  _id: null,
  id: null,
  name: '',
  mail: '',
  animal: '',
  password: '',
  filename: '',
  role: 'user',
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);


const submit = handleSubmit(async (values) => {

  formData.append('userId', userDBData?.user._id || '');
  console.log('userDBData', values, userDBData?.user);

  console.log('settings', userData);
  formData.append('body', JSON.stringify(userData));

  try {
    const result = await cancel(formData);

    if (result && 'message' in result) {
      if (result.message === '退会成功！') {
        serverMessage.value = result.message;

        setTimeout(() => {
          const redirect = '/dashboard';
          router.push({ path: redirect });
        }, 3000);
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

  formData = new FormData();
}, handleError);
gi

definePageMeta({
  middleware: 'user',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-white py-12">
        <h1 class="mb-4 text-3xl font-medium text-center">
          アカウント削除画面
        </h1>
        <p
          class="mt-1 px-4 text-left sm:text-center text-gray-600 text-sm leading-relaxed"
        >
          退会する場合は、こちらより退会してください。<br
            class="hidden sm:!block"
          />1週間はアカウント情報を保持しているので、<br
            class="hidden sm:!block"
          />退会後でも情報を復活させることができます。
        </p>
      </section>
      <article class="contents__inner bg-gray-100 py-12 px-4">
        <div class="sm:flex"></div>
        <div
          class="bg-white rounded-lg shadow-sm dark:bg-gray-800"
        ></div>
        <div class="sm:px-6">
          <form @submit.prevent="submit">
            <div class="">
              <div class="flex items-end justify-center mt-6 pb-4">
                <p>
                  <span
                    v-if="serverMessage"
                    class="text-red-700 text-xs font-bold"
                    >{{ serverMessage }}</span
                  >
                </p>
                <button
                  class="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  アカウント削除
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
