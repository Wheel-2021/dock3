import { v4 as uuidv4 } from 'uuid';
import { User } from '@/models';
import { sign } from '@/utils/session';
import type { MyNitroApp } from '@/types/nitro';
import type { H3Event } from 'h3';

interface UserWithPassword {
  id: number;
  mail: string;
  name: string;
  role: string;
  password: string;
}

export async function createSession(
  event: H3Event,
  userWithPassword: UserWithPassword
) {
  const config = useRuntimeConfig();
  const sessionId = uuidv4();
  const signedSessionId = sign(sessionId, config.sessionCookieSecret);

  setCookie(event, config.sessionCookieName, signedSessionId, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + config.sessionExpires * 1000),
  });

  const app = useNitroApp() as MyNitroApp;
  await app.session.set(config.sessionIdPrefix + sessionId, {
    id: userWithPassword.id,
    mail: userWithPassword.mail,
    name: userWithPassword.name,
    role: userWithPassword.role,
  });

  return {
    user: {
      id: userWithPassword.id,
      mail: userWithPassword.mail,
      name: userWithPassword.name,
      role: userWithPassword.role,
    },
  };
}
