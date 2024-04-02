import { v4 as uuidv4 } from 'uuid';
import { User, Reset } from '@/models';
import { createTransport } from 'nodemailer';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const uuid = uuidv4();
  const uuidExpires = new Date(Date.now() + config.sessionExpires * 1000);

  const body = await readBody<{ mail: string }>(event);
  const { mail } = body;

  if (!mail) {
    return { message: '必須項目に記入漏れがあります' };
  }

  const userWithPassword = await User.getUserByEmail(mail);

  if (!userWithPassword) {
    return { message: '登録されていません' };
  }

  // dbに期限を設置
  const pwResetList = new Reset({
    userId: userWithPassword._id,
    uuid: uuid,
    expires: uuidExpires,
  });

  await pwResetList.save();

  // メール送信のプログラム
  const transporter = createTransport({
    host: 'mailhog',
    port: 1025,
    auth: {
      user: 'user',
      pass: 'password',
    },
  });

  const url = `http:localhost:3000/reset-${uuid}`;
  const adminMailAddress = 'info@sixwheel.net';
  const userMailAddress = mail;
  const subject = 'パスワードの再設定';
  const text = `
  ${userWithPassword.name} 様\n\n
  いつもご利用いただき、ありがとうございます。\n
  以下のURLをクリックして、パスワードを再設定してください。\n
  ${url}\n
  このメールは再送信専用のため、返信はできません。
  `;
  try {
    await transporter.sendMail({
      from: adminMailAddress,
      to: userMailAddress,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.log('メールを送信できませんでした');
    throw error;
  }

  return {
    message: '送信成功！',
  };
});
