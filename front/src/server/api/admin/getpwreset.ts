import { Reset } from '@/models';

export default defineEventHandler(async () => {
  const uuid = await Reset.getIdes();
  if (!uuid) {
    return { message: 'uuidが見つかりません' };
  }

  return {
    uuid,
    message: '取得成功！',
  };
});
