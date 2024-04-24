<script lang="ts" setup>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
  Switch,
} from '@headlessui/vue';
import { UserCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useAuthUser, useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useAdminControll } from '@/composables/admin';
import useImageUpload from '@/composables/useImageUpload';
import useErrorHandler from '@/composables/useErrorHandler';
import { prepareFormData } from '@/utils/prepareImageFormData';
import type { User } from '@/types/user';

const currentUser = useAuthUser();
const { getAllUsers } = useAdminControll();
const { getDBUser, infoUpdate } = useAuth();
const userDBData = currentUser.value
  ? ((await getDBUser(currentUser.value.mail)) as { user: User })
  : null;
const users = ref();
const setDirName = 'avator';
const serverMessage = ref();
const name = ref('');
const mail = ref('');
const animal = ref('');

const filename = ref('');
const selectedRole = ref();
const checkDeleted = ref(false);

const isOpen = ref(false);
const setIsOpen = (value: boolean) => {
  isOpen.value = value;
};
const sendData = (userData: any) => {
  console.log(userData);
  name.value = userData.name;
  mail.value = userData.mail;
  animal.value = userData.animal;
  selectedRole.value = userData.role;
  checkDeleted.value = userData.deleted;
};
// const formData = new FormData();

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
const handleError = useErrorHandler(errors);
const { uploadFile, fileData, isErrorOpen, errorMessage } = useImageUpload();

const submit = handleSubmit(async (values) => {
  let { formData, newFileName } = prepareFormData(fileData, setDirName);
  formData.append('userId', userDBData?.user._id || '');

  if (newFileName) {
    userData.filename = newFileName;
  }

  if (values.password) {
    userData.password = values.password;
  }

  const fieldsToUpdate = ['name', 'mail', 'animal', 'role', 'deleted'];

  fieldsToUpdate.forEach((field) => {
    if (values[field] !== userDBData?.user[field]) {
      userData[field] = values[field];
    }
  });
  console.log('users', userData);
  formData.append('body', JSON.stringify(userData));

  try {
    // ログイン者の情報を書き換えている
    const result = await infoUpdate(formData);
    console.log('users.vue', result);
    if (result && 'message' in result) {
      if (result.message === '更新成功！') {
        serverMessage.value = result.message;
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

onMounted(async () => {
  users.value = await allDBUsers();
  try {
    if (userDBData && userDBData.user) {
      name.value = userDBData.user.name;
      mail.value = userDBData.user.mail;
      animal.value = userDBData.user.animal;
      if (userDBData.user.filename) {
        filename.value = `/${setDirName}/${userDBData.user.filename}`;
      }
    }
  } catch (error) {
    console.error('Error mounting component:', error);
  }
});

definePageMeta({
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
              class="grid lg:gap-2 grid-cols-2 md:grid-cols-5 lg:grid-cols-10 w-full lg:py-2 odd:bg-gray-50 even:bg-white border-gray-200 border-dotted border-r border-b sm:border-r-0 text-sm transition-colors duration-300 transform hover:bg-blue-50"
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
                  v-if="user.deleted"
                  class="p-2 border border-blue-600 text-blue-600 text-xs"
                  >削除対象</span
                >
              </dd>
              <dd
                class="flex items-center justify-end col-span-2 p-2 border-l border-r border-gray-200 border-dotted lg:border-none whitespace-nowrap"
              >
                <button
                  class="mr-1 px-6 py-2 text-xs font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg whitespace-nowrap hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                  @click="
                    setIsOpen(true);
                    sendData(user);
                  "
                >
                  編集
                </button>
                <button
                  class="px-2 py-2 text-xs font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-400 rounded-lg whitespace-nowrap hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                >
                  強制削除
                </button>
              </dd>
            </dl>
          </div>
        </section>
        <TransitionRoot :show="isOpen">
          <Dialog
            :open="isOpen"
            class="fixed inset-0 z-50 overflow-y-auto"
            @close="setIsOpen"
          >
            <div class="flex items-center justify-center min-h-screen">
              <TransitionChild
                enter="duration-150 ease-out"
                enter-frame="opacity-0"
                leave="duration-150 ease-in"
                leave-to="opacity-0"
              >
                <DialogOverlay class="fixed inset-0 bg-gray-800 opacity-80" />
              </TransitionChild>

              <TransitionChild
                enter="duration-100 ease-out"
                enter-from="opacity-0 scale-0"
                enter-to="opacity-50 scale-100"
                leave="duration-100 ease-in"
                leave-from="opacity-50 scale-100"
                leave-to="opacity-0 scale-0"
              >
                <div
                  class="relative w-5/6 sm:w-full p-8 my-4 mx-auto overflow-y-auto bg-white rounded-lg"
                >
                  <button
                    class="absolute top-2.5 right-2.5 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    @click="setIsOpen(false)"
                  >
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                  <DialogTitle>
                    <h1 class="mb-4 text-xl font-medium text-center">
                      アカウント設定画面
                    </h1>
                  </DialogTitle>

                  <DialogDescription>
                    <p
                      class="mt-1 px-4 text-left sm:text-center text-gray-600 text-sm leading-relaxed"
                    >
                      設定を変更する場合は、情報を更新してください。<br
                        class="hidden sm:!block"
                      />メールアドレスが重複している場合は更新できません。
                    </p>
                  </DialogDescription>

                  <form @submit.prevent="submit">
                    <div
                      class="grid gap-6 mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      <div class="col-span-1">
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
                          <span
                            v-if="!errors.name"
                            class="text-gray-400 text-xs"
                            >全角か半角で入力してください</span
                          >
                          <span
                            v-if="errors.name"
                            class="text-red-700 text-xs font-bold"
                            >{{ errors.name }}</span
                          >
                        </p>
                      </div>

                      <div class="col-span-1">
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
                          :value="mail"
                          @change="handleChangeMail"
                        />

                        <p class="mt-2">
                          <span
                            v-if="!errors.mail"
                            class="text-gray-400 text-xs"
                            >半角で入力してください</span
                          >
                          <span
                            v-if="errors.mail"
                            class="text-red-700 text-xs font-bold"
                            >{{ errors.mail }}</span
                          >
                        </p>
                      </div>

                      <div class="col-span-1">
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
                          <span
                            v-if="!errors.animal"
                            class="text-gray-400 text-xs"
                            >漢字・カタカナ・ひらがなを全角で入力してください</span
                          >
                          <span
                            v-if="errors.animal"
                            class="text-red-700 text-xs font-bold"
                            >{{ errors.animal }}</span
                          >
                        </p>
                      </div>
                      <div class="col-span-1">
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
                          class="hidden imageInputs"
                          @change="uploadFile"
                          @click="uploadFile"
                        />
                        <ErrorDialog
                          v-model:isErrorDialog="isErrorOpen"
                          :message="errorMessage"
                        />
                      </div>

                      <div class="col-span-1">
                        <!-- <Listbox id="role" name="role" v-model="selectedRole">
                            <ListboxLabel>役割</ListboxLabel>
                            <div class="relative mt-1">
                              <ListboxButton
                                class="relative w-full cursor-default border border-gray-200 rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                              >
                                <span class="block truncate">{{
                                  selectedRole.name
                                }}</span>
                                <span
                                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                >
                                  <ChevronUpDownIcon
                                    class="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </ListboxButton>

                              <transition
                                leave-active-class="transition duration-100 ease-in"
                                leave-from-class="opacity-100"
                                leave-to-class="opacity-0"
                              >
                                <ListboxOptions
                                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                                >
                                  <ListboxOption
                                    v-slot="{ active, selected }"
                                    v-for="role in roleList"
                                    :key="role.name"
                                    :value="role"
                                    as="template"
                                  >
                                    <li
                                      :class="[
                                        active
                                          ? 'bg-amber-100 text-amber-900'
                                          : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pl-10 pr-4',
                                      ]"
                                    >
                                      <span
                                        :class="[
                                          selected
                                            ? 'font-medium'
                                            : 'font-normal',
                                          'block truncate',
                                        ]"
                                        >{{ role.name }} {{ role.role }}</span
                                      >
                                      <span
                                        v-if="selected"
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                                      >
                                        <CheckIcon
                                          class="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </li>
                                  </ListboxOption>
                                </ListboxOptions>
                              </transition>
                            </div>
                          </Listbox> -->
                        <label
                          class="text-gray-700 dark:text-gray-200 font-bold"
                          for="role"
                          >役割</label
                        >
                        <select
                          id="role"
                          v-model="selectedRole"
                          class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                          <option value="admin">管理者</option>
                          <option value="user">ユーザー</option>
                        </select>
                      </div>

                      <div class="">
                        <label
                          class="text-gray-700 dark:text-gray-200 font-bold"
                          for="deleted"
                          >削除</label
                        >
                        <div class="block mt-2">
                          <Switch
                            id="deleted"
                            name="deleted"
                            v-model="checkDeleted"
                            :class="
                              checkDeleted ? 'bg-blue-600' : 'bg-gray-200'
                            "
                            class="relative inline-flex h-10 w-20 items-center rounded-full"
                          >
                            <span class="sr-only">Enable notifications</span>
                            <span
                              :class="
                                checkDeleted
                                  ? 'translate-x-10'
                                  : 'translate-x-1'
                              "
                              class="inline-block h-8 w-8 transform rounded-full bg-white transition"
                            />
                          </Switch>
                        </div>
                      </div>

                      <div
                        class="col-span-1 sm:col-span-2 lg:col-span-3 flex items-end justify-between"
                      >
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
              </TransitionChild>
            </div>
          </Dialog>
        </TransitionRoot>
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
