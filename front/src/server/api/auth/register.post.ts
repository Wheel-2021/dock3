import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { writeFile, access, mkdir } from 'fs/promises';
import mongoose from 'mongoose';
import User from '@/models/user';
import { hash } from '@/utils/password';
import { createSession } from '@/utils/cookie';

export default defineEventHandler(async (event) => {
  let body;
  let newFileName;
  let dirName;

  const file = await readMultipartFormData(event);
  async function createDirectoryIfNotExists(dir: string) {
    try {
      await access(dir);
    } catch {
      await mkdir(dir, { recursive: true });
    }
  }

  if (!file || file.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'DATA Not Found',
    });
  }
  console.log('register.ts', file);
  for (let i = 0; i < file.length; i++) {
    if (file[i].name === 'newFileName') {
      newFileName = file[i].data.toString();
    }
    if (file[i].name === 'dirName') {
      dirName = file[i].data.toString();
    }
    if (file[i].name === 'file') {
      // 送られてきたファイル名
      console.log('register.ts ファイル', file[i]);
      const oldFilename = file[i].filename;
      if (typeof oldFilename === 'string') {
        await createDirectoryIfNotExists(`./src/public/${dirName}`);
        const data = file[i].data;
        const filePath = `./src/public/${dirName}/${newFileName}`;
        await writeFile(filePath, data);
      }
    }
    if (file[i].name === 'body') {
      body = JSON.parse(file[i].data.toString());
      const getMaxId = await User.find().sort({ id: -1 }).limit(1);
      const setId = getMaxId[0] ? getMaxId[0].id + 1 : 1;
      body._id = new mongoose.Types.ObjectId();
      body.id = setId;
      body.password = await hash(body.password);
      const existingUser = await User.findOne({ mail: body.mail });

      if (existingUser) {
        return {
          message: 'メールアドレスが重複しています',
        };
      }

      const userData = new User(body);

      await userData.save();
      const dbUser = await User.getUserByEmail(body.mail);
      const user = await createSession(event, dbUser);
      console.log('register.ts', user);
      return {
        ...user,
        message: '登録成功！',
      };
    }
  }
});
