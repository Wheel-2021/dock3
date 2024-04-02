import { Reset } from '@/models';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ urlParams: string }>(event);
  const { urlParams } = body;

  if (!urlParams) {
    return { message: 'uuidが見つかりません' };
  }

  const resetUuid = await Reset.getExpiresByUuid(urlParams);

  if (!resetUuid) {
    return { message: '登録されていません' };
  }

  return resetUuid;
});
