<script lang="ts" setup>
import { useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import type { User } from '@/types/user';
import { useAdmin } from '@/composables/auth';

const isAdmin = useAdmin();
const { signUp } = useAuth();
const serverMessage = ref();
let formData = new FormData();
type ErrorsType = Partial<Record<string, string>>;

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

let data: User = {
  id: null,
  name: '',
  mail: '',
  animal: '',
  password: '',
  filename: null,
  role: 'user',
};

const submit = handleSubmit(
  async (values) => {
    data.name = values.name;
    data.mail = values.mail;
    data.animal = values.animal;
    data.password = values.password;

    formData.append('body', JSON.stringify(data));

    try {
      const result = await signUp(formData);
      console.log(result);
      if (result && 'message' in result) {
        if (result.message === '登録成功！') {
          serverMessage.value =
            result.message + 'この後、ダッシュボードに遷移します。';
          setTimeout(() => {
            const redirect = isAdmin.value ? '/admin' : '/dashboard';
            location.href = redirect;
          }, 3000);
        } else {
          serverMessage.value = result.message;
        }
      }
      if (result && 'session' in result) {
        return result.session;
      }
    } catch (error) {
      console.log(error);
    }

    formData = new FormData();
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

// image upload
const uploadDataName = ref();
const uploadFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    data.filename = file.name;
    formData.append('file', file);

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    if (fileExtension && imageExtensions.includes(fileExtension)) {
      uploadDataName.value = fileName;
    } else {
      alert('画像ファイルを選択してください。');
    }
  }
};

const EyeOpen = ref(false);

onMounted(() => {
  const avatarImage = document.querySelector('.avatarImage') as HTMLElement;
  avatarImage?.addEventListener('click', () => {
    (document.querySelector('#avatarInput') as HTMLElement)?.click();
  });
  avatarImage?.addEventListener('keydown', (event) => {
    if (!avatarImage.isEqualNode(event.target as Node)) {
      return;
    }

    if (event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault();
      (document.querySelector('#avatarInput') as HTMLElement)?.click();
    }
  });
  watch(uploadDataName, (newValue) => {
    if (newValue) {
      avatarImage.innerText = newValue;
    }
  });
});
</script>
<template>
  <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
    <div
      class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <div class="px-6 py-4 bg-indigo-600">
        <h1 class="mb-2 text-xl font-medium text-center text-white">
          登録画面
        </h1>

        <p class="mt-1 text-center text-gray-200 text-sm">
          下記を入力し、アカウントを作成してください。メールアドレスが重複している場合は登録できません。
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
                class="text-gray-700 dark:text-gray-200 text-lg font-bold"
                for="name"
                >名前</label
              >
              <input
                id="name"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
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
                  class="text-red-700 text-xs font-bold"
                  >{{ errors.name }}</span
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
                  >半角で入力してください</span
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
                  >漢字・カタカナ・ひらがなを全角で入力してください</span
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
                class="inline-block mr-2 p-1 bg-gray-800 text-white font-bold text-xs"
              >
                任意
              </span>
              <label
                class="text-gray-700 dark:text-gray-200 font-bold"
                for="passwordConfirmation"
                >アバター</label
              >
              <div
                role="button"
                tabindex="0"
                class="avatarImage block whitespace-nowrap overflow-hidden w-full px-4 py-2 mt-2 text-gray-400 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              >
                ファイルを選択
              </div>
              <input
                id="avatarInput"
                name="avatarInput"
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
                  >10文字以上の半角英数字・記号を組み合わせて入力してください</span
                >
                <span
                  v-if="errors.password"
                  class="text-red-700 text-xs font-bold"
                  >{{ errors.password }}</span
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
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped></style>
