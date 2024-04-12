import { User } from '@/models';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    mail: string;
    deletedFlag: boolean;
  }>(event);
  const { mail, deletedFlag } = body;

  const user = await User.getUserByEmail(mail);
  if (!user) {
    return { message: 'ユーザーが見つかりません' };
  }

  // deletedFlagのアップデート
  console.log('cancel', mail, deletedFlag);
  await User.updateOne({ mail: mail }, { deleted: deletedFlag });

  return {
    message: '退会成功！',
  };
});
