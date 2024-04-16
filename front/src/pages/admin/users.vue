<script lang="ts" setup>
import { UserCircleIcon } from '@heroicons/vue/24/outline';
import { useAuthUser, useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useAdmini } from '@/composables/admin';
import useErrorHandler from '@/composables/useErrorHandler';
import { prepareFormData } from '@/utils/prepareImageFormData';
import type { User } from '@/types/user';

const { getAllUsers } = useAdmini();

const users = ref();
const serverMessage = ref();

let formData = new FormData();

const schema = object({
  mail: string().email('メールアドレスの形式ではありません'),
  animal: string().matches(/^[^ -~｡-ﾟ]/, {
    message: '漢字・カタカナ・ひらがなを全角で入力してください',
  }),
  password: string().min(10, '10文字以上で入力してください'),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: fieldName, handleChange: handleChangeName } = useField('name');
const { value: fieldMail, handleChange: handleChangeMail } = useField('mail');
const { value: fieldAnimal, handleChange: handleChangeAnimal } =
  useField('animal');

const allDBUsers = async () => {
  try {
    const result = await getAllUsers();
    console.log('users.vue', result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const submit = () => {};

onMounted(async () => {
  users.value = await allDBUsers();
});

definePageMeta({
  middleware: 'admin',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-white py-12">
        <h1 class="mb-4 text-3xl font-medium text-center">登録ユーザー一覧</h1>
        <p class="text-center text-gray-400 text-sm leading-relaxed">
          登録されたユーザーが表示されています。全権限が与えられているので、操作にご注意を。
        </p>
      </section>
      <article class="contents__inner bg-gray-100 py-16 px-4">
        <section
          class="mx-auto p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          <div class="relative pt-16 overscroll-y-auto">
            <dl
              class="absolute top-0 left-0 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 w-full font-normal"
            >
              <dt
                class="w-full p-2 border border-b border-gray-200 bg-gray-800 text-white text-center text-sm"
              >
                ID
              </dt>
              <dt
                class="w-full p-2 border border-b border-l border-gray-200 bg-gray-800 text-white text-center text-sm"
              >
                名前
              </dt>
              <dt
                class="w-full p-2 border border-b border-l border-gray-200 bg-gray-800 text-white text-center text-sm"
              >
                メールアドレス
              </dt>
              <dt
                class="w-full p-2 border border-b border-l border-gray-200 bg-gray-800 text-white text-center text-sm"
              >
                動物名
              </dt>
              <dt
                class="w-full p-2 tborder border-b border-l border-gray-200 bg-gray-800 text-white text-center text-sm"
              >
                権限
              </dt>
              <dt
                class="w-full p-2 border border-b border-l border-gray-200 bg-gray-800 text-white text-center text-sm"
              >
                削除
              </dt>
              <dt
                class="w-full p-2 border border-b border-l border-gray-200 bg-gray-800 text-white text-center text-sm"
              >
                操作
              </dt>
            </dl>

            <dl
              class="grid sm:grid-cols-3 grid-cols-5 lg:grid-cols-7 w-full border-b"
              v-for="(user, index) in users"
              :key="index"
            >
              <dt class="flex items-center justify-end w-20 p-2  font-normal">
                {{ user.id }}
              </dt>

              <dd class="flex items-center w-50 p-2 text-left">
                <NuxtImg
                  v-if="user.filename"
                  :src="user.filename"
                  width="30"
                  class=""
                  :alt="user.name || ''"
                />
                <UserCircleIcon
                  v-else
                  stroke-width="0.1"
                  class="w-8 h-8text-gray-500"
                />
                <span class="ml-2">{{ user.name }}</span>
              </dd>
              <dd class="flex items-center w-70 p-2 text-left">
                {{ user.mail }}
              </dd>
              <dd class="flex items-center w-32 p-2 text-left">
                {{ user.animal }}
              </dd>
              <dd class="flex items-center w-40 p-2 text-left">
                <span
                  v-if="user.role === 'admin'"
                  class="p-2 rounded-full bg-blue-600 text-white text-sm"
                  >管理者</span
                >
                <span
                  v-if="user.role === 'user'"
                  class="p-2 rounded-full border border-blue-600 text-blue-600 text-sm"
                  >一般ユーザー</span
                >
              </dd>
              <dd class="flex items-center w-20 p-2 text-center">
                <span
                  v-if="user.delated"
                  class="p-2 rounded-full bg-blue-600 text-white text-sm"
                  >削除対象</span
                >
                <span v-else></span>
              </dd>
              <dd class="flex items-center w-full p-2 text-center whitespace-nowrap">
                <button
                  class="mr-1 px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg whitespace-nowrap hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  編集
                </button>
                <button
                  class="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg whitespace-nowrap hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  削除
                </button>
              </dd>
            </dl>
            <div class="divide-dashed"></div>
          </div>
        </section>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
