import { mount } from '@vue/test-utils';
import Login from '@/pages/login.vue';

test('ログインフォーム', async () => {
  const wrapper = mount(Login);

  // メールアドレスとパスワードの入力
  await wrapper.find('input[name="mail"]').setValue('test@example.com');
  await wrapper.find('input[name="password"]').setValue('password');

  // フォームの送信
  await wrapper.find('form').trigger('submit.prevent');

  // 結果の確認
  expect(wrapper.emitted()).toHaveProperty('submit');
  console.log();
});
