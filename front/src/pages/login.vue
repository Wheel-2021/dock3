<script lang="ts" setup>
import { useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import { useAdmin } from '@/composables/auth';

const router = useRouter();
const { login } = useAuth();
const serverMessage = ref();
type ErrorsType = Partial<Record<string, string>>;

const schema = object({
  mail: string()
    .required('必須項目です')
    .email('メールアドレスの形式ではありません'),
  animal: string()
    .required('必須項目です')
    .matches(/^[^ -~｡-ﾟ]/, { message: '全角で入力してください' }),
  password: string().required('必須項目です'),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: mail, handleChange: handleChangeMail } = useField('mail');
const { value: animal } = useField('animal');
const { value: password, handleChange: handleChangePassword } =
  useField('password');

let data = {
  mail: '',
  animal: '',
  password: '',
};

const submit = handleSubmit(
  async (values) => {
    data.mail = values.mail;
    data.animal = values.animal;
    data.password = values.password;

    const result = await login(data.mail, data.animal, data.password);

    if (result && 'message' in result) {
      if (result.message === 'ログイン成功！') {
        const isAdmin = useAdmin();
        const isUser = useUser();
        serverMessage.value =
          result.message + 'この後、ダッシュボードに遷移します。';
        console.log('login.vue', isAdmin.value, isUser.value);
        setTimeout(() => {
          if (isUser) {
            const redirect = isUser.value ? '/dashboard' : '/';
            router.push({ path: redirect });
          }
          const redirect = isAdmin.value ? '/admin' : '/dashboard';
          router.push({ path: redirect });
        }, 3000);
      } else {
        serverMessage.value = result.message;
      }
    }
    if (result && 'session' in result) {
      return result.session;
    }
  },
  ({ errors }: { errors: ErrorsType }) => {
    const firstError = Object.keys(errors)[0];
    const errorElem = document.querySelector<HTMLElement>(
      `[name="${firstError}"]`
    );
    if (errorElem) {
      const errorElemOffsetTop = errorElem.offsetTop;
      window.scrollTo({
        top: errorElemOffsetTop,
        behavior: 'smooth',
      });
      errorElem.focus();
    }
  }
);

const EyeOpen = ref(false);

onMounted(() => {});
</script>
<template>
  <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
    <div
      class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
    >
      <div class="px-6 py-4 bg-indigo-600">
        <h1 class="mb-2 text-xl font-medium text-center text-white">
          ログイン画面
        </h1>

        <p class="mt-1 text-center text-gray-200 text-sm">
          下記を入力し、ログインしてください。
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

            <div>
              <span
                class="inline-block mr-2 p-1 bg-red-700 text-white font-bold text-xs"
              >
                必須
              </span>
              <label
                class="text-gray-700 dark:text-gray-200 text-lg font-bold"
                for="animal"
                >好きな動物</label
              >
              <input
                id="animal"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                type="text"
                placeholder="例) いぬ"
                aria-label="Animal"
                name="animal"
                v-model="animal"
              />
              <p class="mt-2">
                <span v-if="!errors.animal" class="text-gray-400 text-xs"
                  >登録した動物名を入力してください</span
                >
                <span
                  v-if="errors.animal"
                  class="text-red-700 text-xs font-bold"
                  >{{ errors.animal }}</span
                >
              </p>
            </div>

            <div>
              <span
                class="inline-block mr-2 p-1 bg-red-700 text-white font-bold text-xs"
              >
                必須
              </span>
              <label
                class="text-gray-700 dark:text-gray-200 font-bold"
                for="password"
                >パスワード</label
              >
              <div class="relative block w-full">
                <input
                  id="password"
                  class="block w-full pl-4 pr-10 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
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
                  >登録したパスワードを入力してください</span
                >
                <span
                  v-if="errors.password"
                  class="text-red-700 text-xs font-bold"
                  >{{ errors.password }}</span
                >
              </p>
            </div>

            <div>
              <p class="mt-2">
                <span class="text-xs"
                  >パスワードを変更したい・忘れた方は<a
                    href="/reset"
                    class="text-blue-500"
                    >こちら</a
                  ></span
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
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
