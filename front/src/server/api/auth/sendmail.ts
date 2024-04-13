import { defineEventHandler } from 'h3';
import { createTransport } from 'nodemailer';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name: string;
    mail: string;
    textarea: string;
  }>(event);

  const { name, mail, textarea } = body;

  if (!name || !mail || !textarea) {
    return { message: '必須項目に記入漏れがあります' };
  }

  // メール送信のプログラム
  const transporter = createTransport({
    host: 'mailhog',
    port: 1025,
    auth: {
      user: 'user',
      pass: 'password',
    },
  });

  const adminMailAddress = 'info@sixwheel.net';
  const userMailAddress = mail;
  const subject = `${name}様からのお問い合わせ`;
  const text = `
  ${name} 様からお問い合わせがありました。\n
  内容は以下です。\n\n
  ${textarea}
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
