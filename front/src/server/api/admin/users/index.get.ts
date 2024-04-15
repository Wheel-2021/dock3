import { User } from '@/models';

export default defineEventHandler(async (event) => {
  try {
    const userData = await User.find();
    console.log('index.get', userData);
    return userData.map((user) => ({
      _id: user._id ? user._id : null,
      id: user.id,
      mail: user.mail,
      name: user.name,
      filename: user.filename ? user.filename : null,
      role: user.role,
      deleted: user.deleted,
    }));
  } catch (err) {
    event.res.statusCode = 500;
    return {
      code: 'ERROR',
      message: 'Something went wrong',
    };
  }
});
