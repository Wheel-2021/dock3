<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';

const formData = new FormData();
let dataArray: SubmitForm[] = [];
type SubmitForm = {
  name: string;
  mail: string;
  password: string;
  filename?: string | null;
};
type ErrorsType = Partial<Record<string, string>>;

const schema = object({
  name: string().required('必須項目です'),
  mail: string()
    .required('必須項目です')
    .email('メールアドレスの形式ではありません'),
  password: string().required('必須項目です'),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: name } = useField('name');
const { value: mail, handleChange } = useField('mail');
const { value: password } = useField('password');

const submit = handleSubmit(
  async (values) => {
    dataArray[0].name = values.name;
    dataArray[0].mail = values.mail;
    dataArray[0].password = values.password;
    formData.append('body', JSON.stringify(dataArray));

    await $fetch('/api/register', {
      method: 'post',
      body: formData,
    }).then((result: any) => {
      console.log(result.data.value);
    });
  },
  ({ errors }: { errors: ErrorsType }) => {
    const firstError = Object.keys(errors)[0];
    const errorElem = document.querySelector<HTMLElement>(
      `[name="${firstError}"]`,
    );
    if (errorElem) {
      const errorElemOffsetTop = errorElem.offsetTop;
      window.scrollTo({
        top: errorElemOffsetTop,
        behavior: 'smooth',
      });
      errorElem.focus();
    }
  },
);

// image upload
const uploadDataName = ref();
const uploadFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    let data: SubmitForm = {
      name: name.value as string,
      mail: mail.value as string,
      password: password.value as string,
      filename: file.name,
    };
    dataArray.push(data);
    console.log(dataArray);

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
          下記を入力し、アカウントを作成してください。
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
              <p class="mt-2 text-red-700 text-xs font-bold" v-if="errors.name">
                {{ errors.name }}
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
                @change="handleChange"
                :value="mail"
              />
              <p class="mt-2 text-red-700 text-xs font-bold" v-if="errors.mail">
                {{ errors.mail }}
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
              <input
                id="password"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                type="password"
                placeholder="例) xxxxxxxxx"
                aria-label="Password"
                name="password"
                v-model="password"
              />
              <p
                class="mt-2 text-red-700 text-xs font-bold"
                v-if="errors.password"
              >
                {{ errors.password }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end mt-6">
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
