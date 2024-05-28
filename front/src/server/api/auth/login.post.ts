import { User } from '@/models';
import { verify } from '@/utils/password';
import { createSession } from '@/utils/cookie';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    mail: string;
    animal: string;
    password: string;
  }>(event);

  const { mail, animal, password } = body;

  if (!mail || !animal || !password) {
    return { message: '必須項目に記入漏れがあります' };
  }

  const userWithPassword = await User.getUserByEmail(mail);
  console.log(userWithPassword);
  if (!userWithPassword) {
    return { message: '登録されていません' };
  }
  if (userWithPassword.deleted) {
    return { message: '削除されたアカウントです' };
  }

  const verified = await verify(password, userWithPassword.password);
  if (!verified) {
    return { message: '好きな動物かパスワードが間違っています' };
  }

  const user = await createSession(event, userWithPassword);
  console.log('login', user);
  return {
    ...user,
    message: 'サインイン成功！',
  };
});
