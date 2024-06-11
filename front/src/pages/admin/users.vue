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
import { UserIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useAdminControll } from '@/composables/admin';
import useErrorHandler from '@/composables/useErrorHandler';
import type { User } from '@/types/user';

const { getAllUsers, deleteUserOne } = useAdminControll();
const { getDBUser, infoUpdate } = useAuth();
let formData = new FormData();
const users = ref<User[]>([]);

const serverMessage = ref();

const name = ref('');
const mail = ref('');
const animal = ref('');
const role = ref();
const deleted = ref(false);

const pageList = [
  {
    name: '10行',
    value: 10,
  },
  {
    name: '50行',
    value: 50,
  },
  {
    name: '100行',
    value: 100,
  },
];
const pageNumber = ref(pageList[0].value);

const page = ref(1);
const pageCount = ref();
pageCount.value = pageNumber.value;

function rowsChange(newValue: number) {
  pageCount.value = Number(newValue);
}

const isOpen = ref(false);
const setIsOpen = (value: boolean) => {
  isOpen.value = value;
  resetForm();
};
let userDBData: { user: User } | null;

// 修正ボタンを押したらモーダル画面にデータ反映
const sendData = async (userData: User) => {
  // メッセージ初期化
  serverMessage.value = '';
  name.value = userData.name;
  mail.value = userData.mail;
  animal.value = userData.animal;
  role.value = userData.role;
  deleted.value = userData.deleted;

  // 現在のユーザーになっている
  userDBData = userData.mail
    ? ((await getDBUser(userData.mail)) as { user: User })
    : null;
};

// ユーザー即時削除
const deleteUser = async (userData: User) => {
  try {
    await deleteUserOne(userData.mail);
    // 一覧再表示
    displayAllUsers();
  } catch (error) {
    console.log(error);
  }
};

const schema = object({
  // 必須項目は外す。
  name: string(),
  mail: string().email('メールアドレスの形式ではありません'),
  animal: string().matches(/^[^ -~｡-ﾟ]/, {
    message: '漢字・カタカナ・ひらがなを全角で入力してください',
  }),
});
const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { handleChange: handleChangeName } = useField('name');
const { handleChange: handleChangeMail } = useField('mail');
const { handleChange: handleChangeAnimal } = useField('animal');
const { handleChange: handleChangeRole } = useField('role');
const { handleChange: handleChangeDeleted } = useField('deleted');

const allDBUsers = async () => {
  try {
    const result = await getAllUsers();
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

const submit = handleSubmit(async (values) => {
  formData.append('userId', userDBData?.user._id || '');
  formData.append('pagePath', 'admin');
  const fieldsToUpdate = ['name', 'mail', 'animal', 'role', 'deleted'];
  type FormValType = {
    name: string;
    mail: string;
    animal: string;
    role: string;
    deleted: boolean;
    [key: string]: string | boolean;
  };

  const formVal: Partial<FormValType> = {};

  fieldsToUpdate.forEach((field) => {
    // ここでフォームの値をバックアップしておく
    formVal[field] = values[field];

    // ここで照合がうまくいってないメールアドレス
    if (values[field] !== userDBData?.user[field]) {
      console.log(userDBData?.user[field]);
      userData[field] = values[field];
    }
    if (field === 'deleted') {
      userData[field] = deleted.value;
    }
  });

  console.log('users', userData);
  formData.append('body', JSON.stringify(userData));

  try {
    const result = await infoUpdate(formData);

    if (result && 'message' in result) {
      if (result.message === '更新成功！') {
        serverMessage.value = result.message;
        // フォーム内データ再設定
        if (formVal.name !== undefined) name.value = formVal.name;
        if (formVal.mail !== undefined) mail.value = formVal.mail;
        if (formVal.animal !== undefined) animal.value = formVal.animal;
        if (formVal.role !== undefined) role.value = formVal.role;
        if (formVal.deleted !== undefined) deleted.value = formVal.deleted;
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
  // formDataを空に
  formData = new FormData();

  // 一覧再表示
  displayAllUsers();
}, handleError);

onMounted(() => {
  displayAllUsers();
});

async function displayAllUsers() {
  const userList = await allDBUsers();
  if (userList) {
    users.value = userList;
    //   rows.value = users.value.slice(
    //     (page.value - 1) * pageCount,
    //     page.value * pageCount
    //   );
  }
}

const rows = computed(() => {
  return users.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value
  );
});

definePageMeta({
  middleware: 'admin',
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="custom">
      <section class="bg-bgBlue py-12">
        <hgroup>
          <span
            class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
            >USER LIST</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            登録ユーザー一覧
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            登録されたユーザーが表示されています。全権限が与えられているので、操作にご注意を。
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue pb-16 px-4">
        <section class="mx-auto p-4 bg-white rounded-lg shadow-sm">
          <div class="">
            <div class="flex justify-end">
              <USelect
                v-model="pageNumber"
                :options="pageList"
                option-attribute="name"
                class="w-24 mb-2"
                @change="rowsChange"
              />
            </div>
            <dl
              class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 w-full bg-accent text-gray-200"
            >
              <dt
                class="p-2 bg-accent border-b border-gray-600 lg:border-0 font-normal text-sm"
              >
                ID
              </dt>
              <dt
                class="col-span-2 p-2 bg-accent border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                名前
              </dt>
              <dt
                class="col-span-2 p-2 bg-accent border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                メールアドレス
              </dt>
              <dt
                class="p-2 bg-accent border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                動物名
              </dt>
              <dt
                class="p-2 bg-accent border-b border-l border-gray-600 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                権限
              </dt>
              <dt
                class="p-2 bg-accent border-b border-l border-r border-gray-600 md:border-r-0 lg:border-b-0 lg:border-l font-normal text-sm"
              >
                削除
              </dt>
              <dt
                class="col-span-2 p-2 border-b border-l border-r border-gray-600 lg:border-b-0 lg:border-l bg-accent font-normal text-sm"
              >
                操作
              </dt>
            </dl>

            <dl
              class="grid lg:gap-2 grid-cols-2 md:grid-cols-5 lg:grid-cols-10 w-full lg:py-2 odd:bg-gray-50 even:bg-white border-gray-200 border-dotted border-r border-b sm:border-r-0 text-sm transition-colors duration-300 transform hover:bg-blue-50"
              v-for="(user, index) in rows"
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
                  :src="`/avator/${user.filename}`"
                  width="44"
                  :alt="user.name || ''"
                  class="rounded-full"
                />
                <div
                  v-else
                  class="inline-flex items-center justify-center rounded-full p-2.5 bg-gray-200"
                >
                  <UserIcon stroke-width="0.1" class="w-6 text-gray-500" />
                </div>
                <span class="ml-2 font-noto">{{ user.name }}</span>
              </dd>
              <dd
                class="flex items-center col-span-2 p-2 border-b border-l border-r-0 border-gray-200 border-dotted sm:border-r lg:border-none"
              >
                {{ user.mail }}
              </dd>
              <dd
                class="flex items-center col-span-1 p-2 border-b border-l border-gray-200 border-dotted md:border-b-0 lg:border-none font-noto"
              >
                {{ user.animal }}
              </dd>
              <dd
                class="flex items-center col-span-1 p-2 border-b border-l border-gray-200 border-dotted md:border-b-0 lg:border-none font-noto"
              >
                <span
                  v-if="user.role === 'admin'"
                  class="p-2 border border-sub text-sub text-xs"
                  >管理者</span
                >
                <span
                  v-if="user.role === 'user'"
                  class="p-2 border border-accent text-accent text-xs whitespace-nowrap"
                  >ユーザー</span
                >
              </dd>
              <dd
                class="flex items-center p-2 border-b border-l border-r border-gray-200 border-dotted md:border-r-0 md:border-b-0 lg:border-none"
              >
                <span
                  v-if="user.deleted"
                  class="p-2 border border-caution text-caution bg-white text-xs"
                  >削除対象</span
                >
              </dd>
              <dd
                class="flex items-center justify-end col-span-2 p-2 border-l border-r border-gray-200 border-dotted lg:border-none whitespace-nowrap"
              >
                <button
                  class="mr-1 px-6 py-2 text-xs tracking-wide text-white capitalize transition-colors duration-300 transform bg-accent rounded-lg whitespace-nowrap hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 font-noto"
                  type="submit"
                  @click="
                    setIsOpen(true);
                    sendData(user);
                  "
                >
                  編集
                </button>
                <button
                  class="px-6 py-2 tracking-wide text-white text-xs font-noto capitalize transition-colors duration-300 transform bg-caution rounded-full hover:bg-spare focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  type="submit"
                  @click="deleteUser(user)"
                >
                  即時削除
                </button>
              </dd>
            </dl>
            <div class="flex justify-center pt-6 border-t-2 border-accent">
              <UPagination
                :active-button="{
                  color: 'black',
                }"
                v-model="page"
                :page-count="pageCount"
                :total="users.length"
              />
            </div>
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
                <DialogOverlay class="fixed inset-0 bg-accent opacity-80" />
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
                  class="relative sm:w-full mx-auto overflow-y-auto bg-white rounded-lg"
                >
                  <section class="w-full p-6 bg-main">
                    <button
                      class="absolute top-2.5 right-2.5 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                      @click="setIsOpen(false)"
                    >
                      <XMarkIcon
                        class="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                    <hgroup>
                      <span
                        class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
                        >SETTINGS</span
                      >
                      <DialogTitle>
                        <h1
                          class="mb-4 text-3xl text-center text-white font-noto font-normal"
                        >
                          アカウント設定画面
                        </h1>
                      </DialogTitle>

                      <DialogDescription>
                        <p
                          class="mt-1 text-center text-gray-50 text-sm font-noto font-light"
                        >
                          設定を変更する場合は、情報を更新してください。<br
                            class="hidden sm:!block"
                          />メールアドレスが重複している場合は更新できません。
                        </p>
                      </DialogDescription>
                    </hgroup>
                  </section>

                  <form @submit.prevent="submit">
                    <div
                      class="grid gap-6 p-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      <div class="col-span-1">
                        <label
                          class="text-gray-700 font-bold font-noto"
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
                            class="text-caution text-xs font-bold"
                            >{{ errors.name }}</span
                          >
                        </p>
                      </div>

                      <div class="col-span-1">
                        <label
                          class="text-gray-700 font-bold font-noto"
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
                          <span
                            v-if="!errors.mail"
                            class="text-gray-400 text-xs"
                            >半角で入力してください</span
                          >
                          <span
                            v-if="errors.mail"
                            class="text-caution text-xs font-bold"
                            >{{ errors.mail }}</span
                          >
                        </p>
                      </div>

                      <div class="col-span-1">
                        <label
                          class="text-gray-700 font-bold font-noto"
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
                            class="text-caution text-xs font-bold"
                            >{{ errors.animal }}</span
                          >
                        </p>
                      </div>

                      <div class="col-span-1">
                        <label
                          class="text-gray-700 font-bold font-noto"
                          for="role"
                          >役割</label
                        >
                        <select
                          id="role"
                          v-model="role"
                          @change="handleChangeRole"
                          class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                          <option value="admin">管理者</option>
                          <option value="user">ユーザー</option>
                        </select>
                      </div>

                      <div class="">
                        <label
                          class="text-gray-700 font-bold font-noto"
                          for="deleted"
                          >削除</label
                        >
                        <div class="block mt-2">
                          <Switch
                            id="deleted"
                            name="deleted"
                            v-model="deleted"
                            @change="handleChangeDeleted"
                            :class="deleted ? 'bg-blue-600' : 'bg-gray-200'"
                            class="relative inline-flex h-10 w-20 items-center rounded-full"
                          >
                            <span class="sr-only">Enable notifications</span>
                            <span
                              :class="
                                deleted ? 'translate-x-10' : 'translate-x-1'
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
                            class="text-caution text-xs font-bold"
                            >{{ serverMessage }}</span
                          >
                        </p>
                        <button
                          class="px-6 py-2 text-sm font-medium tracking-wide text-white font-noto capitalize transition-colors duration-300 transform bg-accent rounded-full hover:bg-spare focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
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
