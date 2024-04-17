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
        <section class="mx-auto p-4 bg-white rounded-lg shadow-sm">
          <div class="relative pt-40 md:pt-20 lg:pt-12 overscroll-y-auto">
            <dl
              class="absolute top-0 left-0 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 w-full bg-gray-800 text-gray-200"
            >
              <dt
                class="p-2 bg-gray-800 border-b border-gray-600 lg:border-0 font-normal text-sm"
              >
                ID
              </dt>
              <dt
                class="col-span-2 p-2 bg-gray-800 border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                名前
              </dt>
              <dt
                class="col-span-2 p-2 bg-gray-800 border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                メールアドレス
              </dt>
              <dt
                class="p-2 bg-gray-800 border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                動物名
              </dt>
              <dt
                class="p-2 bg-gray-800 border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                権限
              </dt>
              <dt
                class="p-2 bg-gray-800 border-b border-l border-r border-gray-600 md:border-r-0 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                削除
              </dt>
              <dt
                class="col-span-2 p-2 border-b border-l border-r border-gray-600 lg:border-b-0 lg:border-l bg-gray-800 font-normal text-sm"
              >
                操作
              </dt>
            </dl>

            <dl
              class="grid lg:gap-2 grid-cols-3 md:grid-cols-5 lg:grid-cols-10 w-full lg:py-2 odd:bg-gray-50 even:bg-white border-gray-200 border-dotted border-r border-b sm:border-r-0 text-sm transition-colors duration-300 transform hover:bg-blue-50"
              v-for="(user, index) in users"
              :key="index"
            >
              <dt
                class="flex items-center justify-end p-2 border-b border-l border-gray-200 border-dotted lg:border-none font-normal"
              >
                {{ user.id }}
              </dt>

              <dd
                class="flex items-center col-span-2 p-2 border-b border-l border-gray-200 border-dotted lg:border-none"
              >
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
              <dd
                class="flex items-center col-span-2 p-2 border-b border-l border-r-0 border-gray-200 border-dotted sm:border-r lg:border-none"
              >
                {{ user.mail }}
              </dd>
              <dd
                class="flex items-center col-span-1 p-2 border-b border-l border-gray-200 border-dotted md:border-b-0 lg:border-none"
              >
                {{ user.animal }}
              </dd>
              <dd
                class="flex items-center col-span-1 p-2 border-b border-l border-gray-200 border-dotted md:border-b-0 lg:border-none"
              >
                <span
                  v-if="user.role === 'admin'"
                  class="p-2 rounded-full bg-blue-600 text-white text-xs"
                  >管理者</span
                >
                <span
                  v-if="user.role === 'user'"
                  class="p-2 rounded-full border border-blue-600 text-blue-600 text-xs whitespace-nowrap"
                  >ユーザー</span
                >
              </dd>
              <dd
                class="flex items-center p-2 border-b border-l border-r border-gray-200 border-dotted md:border-r-0 md:border-b-0 lg:border-none"
              >
                <span
                  v-if="user.delated"
                  class="p-2 border-blue-600 text-blue-600 text-xs"
                  >削除対象</span
                >
                <span v-else></span>
              </dd>
              <dd
                class="flex items-center justify-end col-span-2 p-2 border-l border-r border-gray-200 border-dotted lg:border-none whitespace-nowrap"
              >
                <button
                  class="mr-1 px-6 py-2 text-xs font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg whitespace-nowrap hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  編集
                </button>
                <button
                  class="px-6 py-2 text-xs font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-400 rounded-lg whitespace-nowrap hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  削除
                </button>
              </dd>
            </dl>
          </div>
        </section>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
