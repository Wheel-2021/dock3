import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { writeFile } from 'fs/promises';
import mongoose from 'mongoose';
import User from '@/models/user';
import { hash } from '@/utils/password';
import { createSession } from '@/utils/cookie';

export default defineEventHandler(async (event) => {
  let body;
  const file = await readMultipartFormData(event);

  if (!file || file.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'DATA Not Found',
    });
  }

  for (let i = 0; i < file.length; i++) {
    if (file[i].name === 'file') {
      const filename = file[i].filename;
      const data = file[i].data;
      const filePath = `./src/public/${filename}`;
      await writeFile(filePath, data);
    }
    if (file[i].name === 'body') {
      body = JSON.parse(file[i].data.toString());
      console.log('送られてきたデータ', body);
      const getUserTotalNumber = await mongoose.model('User').countDocuments();
      const setId = Number(getUserTotalNumber) + 1;
      body.id = setId;
      body.password = await hash(body.password);
      const existingUser = await mongoose
        .model('User')
        .findOne({ mail: body.mail });
      if (existingUser) {
        return {
          message: 'メールアドレスが重複しています',
        };
      }

      const userData = new User(body);
      console.log('body', userData);
      await userData.save();
      const userWithPassword = await User.getUserByEmail(body.mail);
      return createSession(event, userWithPassword);
    }
  }

  return {
    message: '登録成功！',
  };
});
