<script lang="ts" setup>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useAuthUser, useAuth } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';
import useImageUpload from '@/composables/useImageUpload';
import { dataURLtoFile } from '@/utils/imageUtils';
import Cropper from '~/components/Cropper.vue';
import useErrorHandler from '@/composables/useErrorHandler';
import { prepareFormData } from '@/utils/prepareImageFormData';
import type { User } from '@/types/user';
import type { Ref } from 'vue';

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

const selectedImage: Ref = ref('');
const isOpen = ref(false);
const setIsOpen = (value: boolean) => {
  isOpen.value = value;
  if (!value) {
    selectedImage.value = '';
  }
};

const handleFileChange = (event: Event) => {
  uploadFile(event);
  if (!isErrorOpen.value) {
    setIsOpen(true);
  }
};

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
const { uploadFile, imgData, isErrorOpen, errorMessage } = useImageUpload();

let formData = new FormData();
const submit = handleSubmit(async (values) => {
  // roleがadminでも更新するとuserになる
  if (imgData.value) {
    const imageFile = dataURLtoFile(imgData.value, 'image.png');
    //prepareFormDataを通過するとその回数分uuidの名前が変わるので注意
    const result = prepareFormData({ value: imageFile }, setDirName);
    userData.filename = result.newFileName;
    formData = result.formData;
  }

  formData.append('userId', userDBData?.user._id || '');

  if (values.password) {
    userData.password = values.password;
  }

  const fieldsToUpdate = ['name', 'mail', 'animal', 'deleted'];

  fieldsToUpdate.forEach((field) => {
    if (values[field] !== userDBData?.user[field]) {
      userData[field] = values[field];
    }
  });

  formData.append('body', JSON.stringify(userData));

  try {
    const result = await infoUpdate(formData);

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
const handleImageCropped = (croppedImage: string) => {
  imgData.value = croppedImage;
};

const onCropOut = () => {
  isOpen.value = false;
};

const resetSelectedImage = () => {
  selectedImage.value = '';
};
onMounted(() => {
  if (userDBData && userDBData.user) {
    name.value = userDBData.user.name;
    mail.value = userDBData.user.mail;
    animal.value = userDBData.user.animal;
    if (userDBData.user.filename) {
      filename.value = `/${setDirName}/${userDBData.user.filename}`;
    }
  }
  watchEffect(() => {
    if (imgData.value) {
      selectedImage.value = imgData;
    }
  });
});

definePageMeta({
  middleware: 'user',
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
            >SETTINGS</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            アカウント設定画面
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            設定を変更する場合は、情報を更新してください。<br
              class="hidden sm:!block"
            />メールアドレスが重複している場合は更新できません。
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue pb-16 px-4">
        <div class="sm:flex"></div>
        <div
          class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm"
        ></div>
        <div class="sm:px-6">
          <form @submit.prevent="submit">
            <div
              class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label class="text-accent font-bold font-noto" for="name"
                  >名前</label
                >
                <input
                  id="name"
                  class="block w-full pl-4 pr-10 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                    class="text-caution text-xs font-bold"
                    >{{ errors.name }}</span
                  >
                </p>
              </div>

              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label class="text-accent font-bold font-noto" for="mail"
                  >メールアドレス</label
                >
                <input
                  id="mail"
                  class="block w-full pl-4 pr-10 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                    class="text-caution text-xs font-bold"
                    >{{ errors.mail }}</span
                  >
                </p>
              </div>

              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label class="text-accent font-bold font-noto" for="animal"
                  >好きな動物</label
                >
                <input
                  id="animal"
                  class="block w-full pl-4 pr-10 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                    class="text-caution text-xs font-bold"
                    >{{ errors.animal }}</span
                  >
                </p>
              </div>

              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label
                  class="text-accent font-bold font-noto"
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
                  @change="handleFileChange"
                />
                <ErrorDialog
                  :isErrorDialog="isErrorOpen"
                  @update:isErrorDialog="isErrorOpen = $event"
                  :message="errorMessage"
                />
              </div>

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
                      <DialogOverlay
                        class="fixed inset-0 bg-accent opacity-80"
                      />
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
                              >CROP</span
                            >
                            <DialogTitle>
                              <h1
                                class="mb-4 text-3xl text-center text-white font-noto font-normal"
                              >
                                画像調整
                              </h1>
                            </DialogTitle>

                            <DialogDescription>
                              <p
                                class="mt-1 text-center text-gray-50 text-sm font-noto font-light"
                              >
                                画像をお好みで調整してください。
                              </p>
                            </DialogDescription>
                          </hgroup>
                        </section>
                        <Cropper
                          v-if="selectedImage.value"
                          :imageData="selectedImage.value"
                          :stencil-props="{
                            aspectRatio: 1 / 1,
                          }"
                          :stencil-size="{
                            width: 280,
                            height: 280,
                          }"
                          @imageCropped="handleImageCropped"
                          @cropOut="onCropOut"
                          @resetImageData="resetSelectedImage"
                        />
                      </div>
                    </TransitionChild>
                  </div>
                </Dialog>
              </TransitionRoot>

              <div class="p-4 bg-white rounded-lg shadow-sm">
                <label class="text-accent font-bold font-noto" for="password"
                  >パスワード</label
                >
                <div class="relative block w-full">
                  <input
                    id="password"
                    class="block w-full pl-4 pr-10 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                    class="text-caution text-xs font-bold"
                    >{{ errors.password }}</span
                  >
                </p>
              </div>

              <div class="flex items-end justify-between mt-6 pb-4">
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
      </article>
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped></style>
