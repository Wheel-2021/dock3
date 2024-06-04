<script lang="ts" setup>
import { useAuth, useUser } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import useImageUpload from '@/composables/useImageUpload';
import useErrorHandler from '@/composables/useErrorHandler';
import { prepareFormData } from '@/utils/prepareImageFormData';
import type { User } from '@/types/user';

const router = useRouter();
const { signUp } = useAuth();
const setDirName = 'avator';
const serverMessage = ref();
// const formData = new FormData();

const schema = object({
  name: string().required('必須項目です'),
  mail: string()
    .required('必須項目です')
    .email('メールアドレスの形式ではありません'),
  animal: string()
    .required('必須項目です')
    .matches(/^[^ -~｡-ﾟ]/, {
      message: '漢字・カタカナ・ひらがなを全角で入力してください',
    }),
  password: string()
    .required('必須項目です')
    .min(10, '10文字以上で入力してください'),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: name } = useField('name');
const { value: mail, handleChange: handleChangeMail } = useField('mail');
const { value: animal } = useField('animal');
const { value: password, handleChange: handleChangePassword } =
  useField('password');

const userData: User = {
  id: null,
  name: '',
  mail: '',
  animal: '',
  password: '',
  filename: undefined,
  role: 'user',
  deleted: false,
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);
const { uploadFile, fileData } = useImageUpload();

const submit = handleSubmit(async (values) => {
  let { formData } = prepareFormData(fileData, setDirName);
  const { newFileName } = prepareFormData(fileData, setDirName);
  userData.filename = newFileName;
  userData.name = values.name;
  userData.mail = values.mail;
  userData.animal = values.animal;
  userData.password = values.password;

  formData.append('body', JSON.stringify(userData));

  try {
    const result = await signUp(formData);
    console.log('register.vue', result);
    if (result && 'message' in result) {
      if (result.message === '登録成功！') {
        const isUser = useUser();
        serverMessage.value =
          result.message + 'この後、ダッシュボードに遷移します。';
        setTimeout(() => {
          const redirect = isUser.value ? '/dashboard' : '/';
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

const EyeOpen = ref(false);
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
            >SIGN UP</span
          >
          <h1
            class="mb-4 text-3xl text-center text-white font-noto font-normal"
          >
            登録画面
          </h1>

          <p class="mt-1 text-center text-gray-50 text-sm font-noto font-light">
            下記を入力し、アカウントを作成してください。<br
              class="hidden sm:!block"
            />メールアドレスが重複している場合は登録できません。
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
                <label class="text-accent font-bold font-noto" for="name"
                  >名前</label
                >
              </div>

              <input
                id="name"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                type="text"
                placeholder="例) 山田 太郎"
                aria-label="Name"
                name="name"
                v-model="name"
              />
              <p class="mt-2">
                <span v-if="!errors.name" class="text-gray-400 text-xs"
                  >全角か半角で入力してください</span
                >
                <span
                  v-if="errors.name"
                  class="text-caution text-xs font-bold"
                  >{{ errors.name }}</span
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
                  >半角で入力してください</span
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
                  >漢字・カタカナ・ひらがなを全角で入力してください</span
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
                  class="inline-block mr-2 p-1 bg-accent text-white font-bold text-[10px]"
                >
                  任意
                </span>
                <label
                  class="text-accent font-bold font-noto"
                  for="passwordConfirmation"
                  >アバター</label
                >
              </div>

              <div
                role="button"
                tabindex="0"
                class="imageButton block whitespace-nowrap overflow-hidden w-full px-4 py-2 mt-2 text-gray-400 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              >
                ファイルを選択
              </div>
              <input
                id="imageInput"
                name="imageInput"
                type="file"
                class="hidden"
                @change="uploadFile"
              />
              <p class="mt-2">
                <span class="text-gray-400 text-xs"
                  >登録後でも設定できます</span
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
                <label class="text-accent font-bold font-noto" for="password"
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
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
