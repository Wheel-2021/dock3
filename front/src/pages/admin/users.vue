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
          class="mx-auto p-4 overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        >
          <div class="relative h-screen pt-16 overscroll-y-auto">
            <dl
              class="absolute top-0 left-0 items-center w-full bg-white border-b font-normal"
            >
              <dt class="w-20 p-2 text-center">#</dt>
              <dt class="w-40 p-2 text-center">名前</dt>
              <dt class="w-50 p-2 text-center">メールアドレス</dt>
              <dt class="w-32 p-2 text-center">動物名</dt>
              <dt class="w-40 p-2 text-center">権限</dt>
              <dt class="w-40 p-2 text-center">削除</dt>
              <dt class="p-2 text-center">操作</dt>
            </dl>

            <dl
              class="w-full border-b"
              v-for="(user, index) in users"
              :key="index"
            >
              <dt class="w-20 p-2 text-right">
                {{ user.id }}
              </dt>

              <dd class="w-40 p-2 text-left">
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
              <dd class="w-50 p-2 text-left">
                {{ user.mail }}
              </dd>
              <dd class="w-32 p-2 text-left">
                {{ user.animal }}
              </dd>
              <dd class="w-40 p-2 text-left">
                <span v-if="user.role === 'admin'">管理者</span>
                <span v-if="user.role === 'user'">一般ユーザー</span>
              </dd>
              <dd class="w-40 p-2 text-center">
                <span v-if="user.delated">削除対象</span>
                <span v-else>普通だよ</span>
              </dd>
              <dd class="p-2 text-center">
                <button
                  class="mr-1 px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  編集
                </button>
                <button
                  class="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
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
