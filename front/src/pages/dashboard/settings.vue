<script lang="ts" setup>
import { useAuthUser, useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import useImageUpload from '@/composables/useImageUpload';
import useErrorHandler from '@/composables/useErrorHandler';
import { prepareFormData } from '@/utils/prepareImageFormData';
import type { User } from '@/types/user';

const router = useRouter();
const currentUser = useAuthUser();
const { getDBUser, infoUpdate } = useAuth();
const userDBData = currentUser.value
  ? ((await getDBUser(currentUser.value.mail)) as { user: User })
  : null;

const setDirName = 'avator';
const serverMessage = ref();
const name = ref('');
const mail = ref('');
const animal = ref('');
const filename = ref('');
const password = ref('');

const schema = object({
  // 必須項目は外す。
  name: string(),
  mail: string().email('メールアドレスの形式ではありません'),
  animal: string().matches(/^[^ -~｡-ﾟ]/, {
    message: '漢字・カタカナ・ひらがなを全角で入力してください',
  }),
  password: string().min(10, '10文字以上で入力してください'),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const { handleChange: handleChangeName } = useField('name');
const { handleChange: handleChangeMail } = useField('mail');
const { handleChange: handleChangeAnimal } = useField('animal');
const { handleChange: handleChangePassword } = useField('password');

const userData: User = {
  _id: null,
  id: null,
  name: '',
  mail: '',
  animal: '',
  password: '',
  filename: '',
  role: 'user',
  deleted: false,
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);
const { uploadFile, fileData, isErrorOpen, errorMessage } = useImageUpload();

const submit = handleSubmit(async (values) => {
  let { formData } = prepareFormData(fileData, setDirName);
  const { newFileName } = prepareFormData(fileData, setDirName);
  formData.append('userId', userDBData?.user._id || '');

  if (newFileName) {
    userData.filename = newFileName;
  }

  if (values.password) {
    userData.password = values.password;
  }

  const fieldsToUpdate = ['name', 'mail', 'animal', 'deleted'];

  fieldsToUpdate.forEach((field) => {
    if (values[field] !== userDBData?.user[field]) {
      userData[field] = values[field];
    }
  });
  console.log('settings', userData);
  formData.append('body', JSON.stringify(userData));

  try {
    const result = await infoUpdate(formData);
    console.log('settings.vue', result);
    if (result && 'message' in result) {
      if (result.message === '更新成功！') {
        serverMessage.value =
          result.message + 'この後、ダッシュボードに遷移します。';

        setTimeout(() => {
          const redirect = '/dashboard';
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

onMounted(async () => {
  if (userDBData && userDBData.user) {
    name.value = userDBData.user.name;
    mail.value = userDBData.user.mail;
    animal.value = userDBData.user.animal;
    if (userDBData.user.filename) {
      filename.value = `/${setDirName}/${userDBData.user.filename}`;
    }
  }
});

definePageMeta({
  middleware: 'user',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-white py-12">
        <h1 class="mb-4 text-3xl font-medium text-center">
          アカウント設定画面
        </h1>
        <p
          class="mt-1 px-4 text-left sm:text-center text-gray-600 text-sm leading-relaxed"
        >
          設定を変更する場合は、情報を更新してください。<br
            class="hidden sm:!block"
          />メールアドレスが重複している場合は更新できません。
        </p>
      </section>
      <article class="contents__inner bg-gray-100 py-12 px-4">
        <div class="sm:flex"></div>
        <div
          class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        ></div>
        <div class="sm:px-6">
          <form @submit.prevent="submit">
            <div
              class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label
                  class="text-gray-700 dark:text-gray-200 text-lg font-bold"
                  for="name"
                  >名前</label
                >
                <input
                  id="name"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-200 rounded-md bg-sky-50 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  type="text"
                  placeholder="例) 山田 太郎"
                  aria-label="Name"
                  name="name"
                  v-model="name"
                  @change="handleChangeName"
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

              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label
                  class="text-gray-700 dark:text-gray-200 font-bold"
                  for="mail"
                  >メールアドレス</label
                >
                <input
                  id="mail"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-200 rounded-md bg-sky-50 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  type="email"
                  placeholder="例) xxxxx@xxxxx.xx"
                  aria-label="Email Address"
                  name="mail"
                  v-model="mail"
                  @change="handleChangeMail"
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

              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label
                  class="text-gray-700 dark:text-gray-200 text-lg font-bold"
                  for="animal"
                  >好きな動物</label
                >
                <input
                  id="animal"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-200 rounded-md bg-sky-50 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  type="text"
                  placeholder="例) いぬ"
                  aria-label="Animal"
                  name="animal"
                  v-model="animal"
                  @change="handleChangeAnimal"
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

              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label
                  class="text-gray-700 dark:text-gray-200 font-bold"
                  for="passwordConfirmation"
                  >アバター</label
                >
                <div
                  role="button"
                  tabindex="0"
                  class="imageButton block whitespace-nowrap overflow-hidden w-full px-4 py-2 mt-2 text-gray-400 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
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
                <ErrorDialog
                  v-model:isErrorDialog="isErrorOpen"
                  :message="errorMessage"
                />
                <!-- <p class="mt-2">
                    <span class="text-gray-400 text-xs"
                      >登録後でも設定できます</span
                    >
                  </p> -->
                <!-- <NuxtImg
                    v-if="filename"
                    :src="filename"
                    width="36"
                    alt="アバター"
                    class="mt-2"
                  /> -->
              </div>

              <div class="p-4 bg-white rounded-lg shadow-sm">
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
                    placeholder="パスワードを更新する場合のみ、入力してください"
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

              <div class="flex items-end justify-between mt-6 pb-4">
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
                  更新
                </button>
              </div>
            </div>
          </form>
        </div>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
