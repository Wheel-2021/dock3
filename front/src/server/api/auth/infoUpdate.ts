import {
  defineEventHandler,
  readMultipartFormData,
  createError,
  H3Event,
} from 'h3';
import { writeFile, access, mkdir } from 'fs/promises';
import mongoose from 'mongoose';
import { createSession } from '@/utils/cookie';
import User from '@/models/user';
import { hash } from '@/utils/password';

interface FileItem {
  name?: string | undefined;
  data: Buffer;
  filename?: string;
}

async function processFile(file: FileItem[], event: H3Event) {
  let body, newFileName, dirName, userId, pagePath;

  for (const item of file) {
    switch (item.name) {
      case 'userId':
        userId = item.data.toString();
        break;
      case 'newFileName':
        newFileName = item.data.toString();
        break;
      case 'dirName':
        dirName = item.data.toString();
        break;
      case 'pagePath':
        pagePath = item.data.toString();
        break;
      case 'file':
        {
          const oldFilename = item.filename;
          if (typeof oldFilename === 'string') {
            await createDirectoryIfNotExists(`./src/public/${dirName}`);
            const data = item.data;
            const filePath = `./src/public/${dirName}/${newFileName}`;
            await writeFile(filePath, data);
          }
        }
        break;
      case 'body':
        body = JSON.parse(item.data.toString());
        console.log('info', body);
        deleteSpecificProperties(body);
        deleteEmptyProperties(body);

        if (!body.mail || !body.animal || !body.password) {
          return { message: '必須項目に記入漏れがあります' };
        }
        // パスワード対応
        if (body.password) {
          body.password = await hash(body.password);
        }

        // メールアドレスの重複チェック
        if (body.mail) {
          const existingUser = await User.findOne({ mail: body.mail });
          if (existingUser) {
            return {
              message: 'メールアドレスが重複しています',
            };
          }
        }

        // 削除フラグによって、削除日時を設定排除する new Date().toISOString()
        body.deletedAt = body.deleted ? new Date() : '';
    }
  }
  await User.updateOne({ _id: userId }, body);

  const objectId = new mongoose.Types.ObjectId(userId);
  const userWithPassword = await User.getUserById(objectId);

  if (!userWithPassword) {
    return { message: '登録されていません' };
  }

  // roleがuserの時だけセッションを設定。ログイン情報にも関連
  if (!pagePath) {
    const user = await createSession(event, userWithPassword);
    console.log('infoupdate', user);
    return {
      ...user,
      message: '更新成功！',
    };
  }

  return {
    message: '更新成功！',
  };
}

function deleteEmptyProperties(obj: { [key: string]: string | undefined }) {
  for (const key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }
}

async function createDirectoryIfNotExists(dir: string) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

function deleteSpecificProperties(obj: { [key: string]: string | undefined }) {
  const propertiesToDelete = ['_id', 'id'];
  for (const key of propertiesToDelete) {
    if (key in obj) {
      delete obj[key];
    }
  }
}

export default defineEventHandler(async (event) => {
  const file = await readMultipartFormData(event);
  if (!file || file.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'DATA Not Found',
    });
  }
  return await processFile(file, event);
});
