import { User } from '@/models';

export default defineEventHandler(async (event) => {
  try {
    const userData = await User.find();
    return userData.map((user) => ({
      id: user.id,
      mail: user.mail,
      name: user.name,
      filename: user.filename ? user.filename : null,
      role: user.role,
    }));
  } catch (err) {
    event.res.statusCode = 500;
    return {
      code: 'ERROR',
      message: 'Something went wrong',
    };
  }
});
