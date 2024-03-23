import { v4 as uuidv4 } from 'uuid';
import { User } from '@/models';
import { verify } from '@/utils/password';
import { sign } from '@/utils/session';
import type { MyNitroApp } from '@/types/nitro';

const user: UserWithoutPassword = {
  id: userWithPassword.id,
  mail: userWithPassword.mail,
  name: userWithPassword.name,
  role: userWithPassword.role,
};

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    mail: string;
    password: string;
    rememberMe: boolean;
  }>(event);

  const { mail, password, rememberMe } = body;

  if (!mail || !password) {
    return createError({
      statusCode: 400,
      message: 'Email address and password are required',
    });
  }

  const userWithPassword = await User.getUserByEmail(mail);
  if (!userWithPassword) {
    return createError({
      statusCode: 401,
      message: 'Bad credentials',
    });
  }

  const verified = await verify(password, userWithPassword.password);
  if (!verified) {
    return createError({
      statusCode: 401,
      message: 'Bad credentials',
    });
  }

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
});
