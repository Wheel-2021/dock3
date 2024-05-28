<script lang="ts" setup>
import { useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import { useAdmin, useUser } from '@/composables/auth';
import useErrorHandler from '@/composables/useErrorHandler';

const router = useRouter();
const { login } = useAuth();
const serverMessage = ref();

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

const userData = {
  mail: '',
  animal: '',
  password: '',
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);

const submit = handleSubmit(async (values) => {
  userData.mail = values.mail;
  userData.animal = values.animal;
  userData.password = values.password;

  try {
    const result = await login(
      userData.mail,
      userData.animal,
      userData.password
    );

    if (result && 'message' in result) {
      if (result.message === 'サインイン成功！') {
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
  } catch (error) {
    console.log('Error updating information:', error);
  }
}, handleError);

const EyeOpen = ref(false);

onMounted(() => {});
</script>
<template>
  <article class="contents__inner bg-gray-100 py-16 px-4">
    <div
      class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
    >
      <section class="w-full p-6 bg-main">
        <hgroup>
          <span
            class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
            >SIGN IN</span
          >
          <h1
            class="mb-4 text-3xl text-center text-white font-noto font-normal"
          >
            サインイン画面
          </h1>

          <p class="mt-1 text-center text-gray-50 text-sm font-noto font-light">
            下記を入力し、サインインしてください。
          </p>
        </hgroup>
      </section>
      <div class="p-6">
        <form @submit.prevent="submit">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 mt-4"
          >
            <div>
              <div class="flex items-center">
                <span
                  class="inline-block mr-2 p-1 bg-caution text-white font-bold text-[10px]"
                >
                  必須
                </span>
                <label class="text-gray-700 font-bold font-noto" for="mail"
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

            <div>
              <div class="flex items-center">
                <span
                  class="inline-block mr-2 p-1 bg-caution text-white font-bold text-[10px]"
                >
                  必須
                </span>
                <label class="text-accent font-bold font-noto" for="animal"
                  >好きな動物</label
                >
              </div>

              <input
                id="animal"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                  class="text-caution text-xs font-bold"
                  >{{ errors.animal }}</span
                >
              </p>
            </div>

            <div>
              <div class="flex items-center">
                <span
                  class="inline-block mr-2 p-1 bg-caution text-white font-bold text-[10px]"
                >
                  必須
                </span>
                <label class="text-gray-700 font-bold font-noto" for="password"
                  >パスワード</label
                >
              </div>

              <div class="relative block w-full">
                <input
                  id="password"
                  class="block w-full pl-4 pr-10 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                  class="text-caution text-xs font-bold"
                  >{{ errors.password }}</span
                >
              </p>
            </div>

            <div>
              <p class="mt-2">
                <span class="text-xs font-noto"
                  >パスワードを変更したい・忘れた方は<NuxtLink
                    to="/reset"
                    class="text-blue-500 transition-colors duration-300 transform hover:text-accent"
                    >こちら</NuxtLink
                  ></span
                ><br />
                <span class="text-xs font-noto"
                  >アカウント復活については<NuxtLink
                    to="/inquiry"
                    class="text-blue-500 transition-colors duration-300 transform hover:text-accent"
                    >こちら</NuxtLink
                  ></span
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
              サインイン
            </button>
          </div>
        </form>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
