import mongoose from 'mongoose';
import { User } from '@/models';
import { hash } from '@/utils/password';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ userId: string; password: string }>(event);
  const { userId, password } = body;

  if (!password) {
    return { message: 'パスワードが記入されていません' };
  }
  const objectId = new mongoose.Types.ObjectId(userId);
  const userWithPassword = await User.getUserById(objectId);

  if (!userWithPassword) {
    return { message: 'ユーザーが見つかりません' };
  }
  userWithPassword.password = await hash(password);
  await userWithPassword.save();
  return {
    message: 'パスワードを変更しました',
  };
});
