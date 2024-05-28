<script lang="ts" setup>
import { useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import useErrorHandler from '@/composables/useErrorHandler';
// import type { ErrorsType } from '@/types/error';

const router = useRouter();
const { checkUuid, updatePw } = useAuth();
const serverMessage = ref();

// dbのuuidとexpiresの確認
const route = useRoute();
const urlParams = route.params.uuid;
const resetData = await checkUuid(urlParams);
console.log(resetData);
if (!(resetData && Date.now() < resetData.expires + 24 * 60 * 60 * 1000)) {
  serverMessage.value =
    'リセットリンクが無効または期限切れです。この後、パスワードリセット画面に遷移します。';
  setTimeout(() => {
    const redirect = '/reset';
    location.href = redirect;
  }, 3000);
}

const schema = object({
  password: string()
    .required('必須項目です')
    .min(10, '10文字以上で入力してください'),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: password, handleChange: handleChangePassword } =
  useField('password');

const userData = {
  password: '',
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);

const submit = handleSubmit(async (values) => {
  userData.password = values.password;

  if (resetData) {
    try {
      const result = await updatePw(resetData.userId, userData.password);

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
          setTimeout(() => {
            const redirect = '/login';
            router.push({ path: redirect });
          }, 3000);
        }
      }
    } catch (error) {
      console.log('Error updating information:', error);
    }
  }
}, handleError);
const EyeOpen = ref(false);
</script>

<template>
  <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
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
            新しいパスワードを入力し、送信ボタンを押してください。
          </p>
        </hgroup>
      </section>
      <div class="p-6">
        <form @submit.prevent="submit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <span
                class="inline-block mr-2 p-1 bg-caution text-white font-bold text-[10px]"
              >
                必須
              </span>
              <label class="text-accent font-bold font-noto" for="password"
                >パスワード</label
              >
              <div class="relative block w-full">
                <input
                  id="password"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  :type="EyeOpen ? 'text' : 'password'"
                  placeholder="例) xxxxxxxxx"
                  aria-label="Password"
                  name="password"
                  v-model="password"
                  @change="handleChangePassword"
                />
                <button
                  type="button"
                  class="absolute top-0 bottom-0 right-2"
                  @click="EyeOpen = !EyeOpen"
                >
                  <EyeIcon
                    v-if="EyeOpen"
                    class="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                  <EyeSlashIcon
                    v-else
                    class="h-6 w-6 text-gray-400"
                    aria-hidden="false"
                  />
                </button>
              </div>

              <p class="mt-2">
                <span v-if="!errors.password" class="text-gray-400 text-xs"
                  >10文字以上の半角英数字・記号を組み合わせて入力してください</span
                >
                <span
                  v-if="errors.password"
                  class="text-caution text-xs font-bold"
                  >{{ errors.password }}</span
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
              設定
            </button>
          </div>
        </form>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
~/models/reset
