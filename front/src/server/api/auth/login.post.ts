import { User } from '@/models';
import { verify } from '@/utils/password';
import { createSession } from '@/utils/cookie';

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

  return createSession(event, userWithPassword);
});
