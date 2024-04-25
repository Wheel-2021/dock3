import { User } from '@/models';

export default defineEventHandler(async () => {
  const user = await User.getUsersByDeleted();
  if (!user) {
    return { message: 'ユーザーが見つかりません' };
  }

  return {
    user,
    message: '取得成功！',
  };
});
