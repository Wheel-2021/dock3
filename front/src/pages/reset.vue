<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import useErrorHandler from '@/composables/useErrorHandler';

const router = useRouter();
const { pwReset } = useAuth();
const serverMessage = ref();

const schema = object({
  mail: string()
    .required('必須項目です')
    .email('メールアドレスの形式ではありません'),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});
const { value: mail, handleChange: handleChangeMail } = useField('mail');

let userData = {
  mail: '',
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);

const submit = handleSubmit(async (values) => {
  userData.mail = values.mail;
  try {
    const result = await pwReset(userData.mail);

    console.log(result);
    if (result && 'message' in result) {
      if (result.message === '送信成功！') {
        serverMessage.value =
          result.message + 'この後、ログイン画面に遷移します。';
        setTimeout(() => {
          const redirect = '/login';
          router.push({ path: redirect });
        }, 3000);
      } else {
        serverMessage.value = result.message;
      }
    }
  } catch (error) {
    console.log('Error updating information:', error);
  }
}, handleError);
</script>

<template>
  <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
    <div
      class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
    >
      <div class="px-6 py-4 bg-indigo-600">
        <h1 class="mb-2 text-xl font-medium text-center text-white">
          パスワードの再設定画面
        </h1>

        <p class="mt-1 text-center text-gray-200 text-sm">
          登録済みのメールアドレスを入力し、送信ボタンを押してください。<br />登録済みのメールアドレスにパスワード再設定のリクエストメールを送信します。
        </p>
      </div>
      <div class="px-6 py-4">
        <form @submit.prevent="submit">
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <span
                class="inline-block mr-2 p-1 bg-red-700 text-white font-bold text-xs"
              >
                必須
              </span>
              <label
                class="text-gray-700 dark:text-gray-200 font-bold"
                for="mail"
                >メールアドレス</label
              >
              <input
                id="mail"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                type="email"
                placeholder="例) xxxxx@xxxxx.xx"
                aria-label="Email Address"
                name="mail"
                @change="handleChangeMail"
                :value="mail"
              />

              <p class="mt-2">
                <span v-if="!errors.mail" class="text-gray-400 text-xs"
                  >登録したメールアドレスを半角で入力してください</span
                >
                <span
                  v-if="errors.mail"
                  class="text-red-700 text-xs font-bold"
                  >{{ errors.mail }}</span
                >
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-6">
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
              送信
            </button>
          </div>
        </form>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
