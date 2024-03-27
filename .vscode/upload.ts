import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { writeFile } from 'fs/promises';

export default defineEventHandler(async (event) => {
  let body;
  const file = await readMultipartFormData(event);
  console.log('送られてきたデータ', file);
  if (!file || file.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image Not Found',
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
      console.log('body', JSON.parse(file[i].data.toString()));
      body = JSON.parse(file[i].data.toString());
      // let body = {
      //   ...JSON.parse(file.toString()),
      // };
    }
  }

  // const upload = file.map((item) => ({
  //   contentType: item.type,
  //   filename: item.filename,
  //   name: item.name,
  //   size: item.data.length,
  // }));

  return {
    body,
  };
});
