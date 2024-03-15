<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';

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
  (values) => {
    console.log(values);
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
</script>
<template>
  <article class="contents__inner bg-gray-100 h-screen py-16 px-4">
    <div
      class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
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
          <div class="w-ful">
            <h2 class="mb-2 text-sm">名前</h2>
            <input
              class="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
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
          <div class="w-full mt-6">
            <h2 class="mb-2 text-sm">メールアドレス(半角英数字)</h2>
            <input
              class="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
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

          <div class="w-full mt-6">
            <h2 class="mb-2 text-sm">パスワード(半角英数字)</h2>
            <input
              class="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
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

          <div class="flex items-center justify-center mt-6">
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
