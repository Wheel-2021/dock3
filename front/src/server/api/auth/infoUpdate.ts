import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { writeFile, access, mkdir } from 'fs/promises';
import mongoose from 'mongoose';
import { verify } from '@/utils/password';
import { createSession } from '@/utils/cookie';
import User from '@/models/user';
import { hash } from '@/utils/password';

export default defineEventHandler(async (event) => {
  let body;
  let newFileName;
  let dirName;
  let userId;

  const file = await readMultipartFormData(event);
  console.log('formData', file);
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
  console.log('infoupdate.ts', file);
  for (let i = 0; i < file.length; i++) {
    if (file[i].name === 'userId') {
      userId = file[i].data.toString();
    }
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

      // パスワード対応
      if (body.password === '') {
        delete body.password;
      } else {
        body.password = await hash(body.password);
      }

      if (body._id || body.id || body.role) {
        delete body._id;
        delete body.id;
        delete body.role;
      }
      if (body.name === '') {
        delete body.name;
      }
      if (body.animal === '') {
        delete body.animal;
      }
      if (body.filename === '') {
        delete body.filename;
      }
      if (body.mail === '') {
        delete body.mail;
      } else {
        const existingUser = await User.findOne({ mail: body.mail });

        if (existingUser) {
          return {
            message: 'メールアドレスが重複しています',
          };
        }
      }
      console.log('infoupdate.ts', body);
      await User.updateOne({ _id: userId }, body);

      const objectId = new mongoose.Types.ObjectId(userId);
      const userWithPassword = await User.getUserById(objectId);

      if (!userWithPassword) {
        return { message: '登録されていません' };
      }

      const user = await createSession(event, userWithPassword);
      console.log('login', user);
      return {
        ...user,
        message: '更新成功！',
      };
    }
  }
});
