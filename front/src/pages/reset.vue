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

const userData = {
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
  <article class="contents__inner bg-gray-100 py-16 px-4">
    <div
      class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm"
    >
      <section class="w-full p-6 bg-main">
        <hgroup>
          <span
            class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
            >RESET</span
          >
          <h1
            class="mb-4 text-3xl text-center text-white font-noto font-normal"
          >
            パスワードの再設定画面
          </h1>

          <p class="mt-1 text-center text-gray-50 text-sm font-noto font-light">
            登録済みのメールアドレスを入力し、送信ボタンを押してください。<br />登録済みのメールアドレスにパスワード再設定のリクエストメールを送信します。
          </p>
        </hgroup>
      </section>
      <div class="p-6">
        <form @submit.prevent="submit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <div class="flex items-center">
                <span
                  class="inline-block mr-2 p-1 bg-caution text-white font-bold text-[10px]"
                >
                  必須
                </span>
                <label class="text-accent font-bold font-noto" for="mail"
                  >メールアドレス</label
                >
              </div>

              <input
                id="mail"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                  class="text-caution text-xs font-bold"
                  >{{ errors.mail }}</span
                >
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-6">
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
              送信
            </button>
          </div>
        </form>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
