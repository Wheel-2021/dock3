import { Reset } from '@/models';

export default defineEventHandler(async () => {
  const uuides = await Reset.getIdes();
  if (!uuides) {
    return { message: 'uuidが見つかりません' };
  }

  return {
    uuides,
    message: '取得成功！',
  };
});
