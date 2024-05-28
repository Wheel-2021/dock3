<script lang="ts" setup>
import { useAuth } from '@/composables/auth';
import { useAuthUser } from '@/composables/auth';
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import useErrorHandler from '@/composables/useErrorHandler';

const currentUser = useAuthUser();
const router = useRouter();
const { sendMail } = useAuth();
const serverMessage = ref();

const schema = object({
  contents: string()
    .required('必須項目です')
    .test('is-not-blank', '空白の行は許可されていません', (value) => {
      return /\S/.test(value);
    }),
});
const { errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: contents } = useField<string>('contents');

const mailData = {
  name: '',
  mail: '',
  contents: '',
};
// veevalidateのエラー表示部分
const handleError = useErrorHandler(errors);

const submit = handleSubmit(async (values) => {
  mailData.name = `${currentUser.value?.name} [${currentUser.value?.mail}]`;
  mailData.mail = 'info@sixwheel.net';
  mailData.contents = values.contents;

  try {
    // mailData.mailがtoになっている 送り先を変えるか判断する
    const result = await sendMail(
      mailData.name,
      mailData.mail,
      mailData.contents
    );
    console.log('inquiry.vue', result);
    if (result && 'message' in result) {
      if (result.message === '送信成功！') {
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
  } catch (error) {
    console.log('Error updating information:', error);
  }
}, handleError);

definePageMeta({
  middleware: 'user',
  layout: false,
});
</script>
<template>
  <div>
    <!-- 名前とメールアドレスはわかっているので、除いてもいい -->
    <NuxtLayout name="custom">
      <section class="bg-bgBlue py-12">
        <hgroup>
          <span
            class="block w-fit mx-auto mb-1 px-1 py-0.5 font-roboto bg-accent text-gold text-[10px]"
            >INQUIRY</span
          >
          <h1 class="mb-4 text-3xl font-medium text-center font-noto">
            お問い合わせ
          </h1>
          <p
            class="text-center text-gray-400 text-sm leading-relaxed font-noto"
          >
            下記を入力し、送信ボタンを押してください。
          </p>
        </hgroup>
      </section>
      <article class="contents__inner bg-bgBlue pb-16 px-4">
        <div class="sm:flex"></div>
        <div
          class="w-8/12 min-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800"
        ></div>
        <div class="sm:px-6">
          <form @submit.prevent="submit">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div class="p-4 bg-white rounded-lg shadow-sm">
                <div class="flex items-center">
                  <span
                    class="inline-block mr-2 p-1 bg-caution text-white font-bold text-[10px]"
                  >
                    必須
                  </span>
                  <label class="text-accent font-bold font-noto" for="contents"
                    >問い合わせ内容</label
                  >
                </div>

                <textarea
                  id="contents"
                  class="block w-full h-48 pl-4 pr-10 py-2 mt-2 text-gray-700 bg-input border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  placeholder="例) 問い合わせ"
                  aria-label="Textarea"
                  name="contents"
                  v-model="contents"
                ></textarea>
                <p class="mt-2">
                  <span v-if="!errors.contents" class="text-gray-400 text-xs"
                    >問い合わせ内容を入力してください</span
                  >
                  <span
                    v-if="errors.contents"
                    class="text-caution text-xs font-bold"
                    >{{ errors.contents }}</span
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
                  送信
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
