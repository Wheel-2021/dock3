import { User } from '@/models';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ mail: string }>(event);
  const { mail } = body;

  const user = await User.getUserByEmail(mail);

  if (!user) {
    return { message: 'ユーザーが見つかりません' };
  }
  return {
    user,
    message: 'ユーザーが見つかりました',
  };
});
