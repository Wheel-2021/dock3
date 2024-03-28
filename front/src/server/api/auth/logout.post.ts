import { unsign } from '@/utils/session';
import type { MyNitroApp } from '@/types/nitro';

export default defineEventHandler(async (event) => {
  const app = useNitroApp() as MyNitroApp;
  const config = useRuntimeConfig();

  const cookie = getCookie(event, config.sessionCookieName);
  if (cookie) {
    const unsignedSession = unsign(cookie, config.sessionCookieSecret);
    if (unsignedSession) {
      await app.session.destroy(config.sessionIdPrefix + unsignedSession);
    }
  }

  deleteCookie(event, config.sessionCookieName, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  console.log('kiteru');
  return {
    user: null,
    message: 'ログアウト',
  };
});
