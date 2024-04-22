import { v4 as uuidv4 } from 'uuid';

type FileData = {
  value: {
    name: string;
  };
};

export function prepareFormData(fileData: FileData, dirName: string) {
  const uuid = uuidv4();
  const formData = new FormData();
  let newFileName;
  if (fileData.value) {
    const extension = fileData.value.name.split('.').pop();
    newFileName = `${dirName}_${uuid}.${extension}`;

    formData.append('newFileName', newFileName);
    formData.append('dirName', dirName);
    if (fileData.value instanceof File) {
      formData.append('file', fileData.value);
    } else {
      console.error('fileData.value is not a File');
    }
  }
  return { newFileName, formData };
}
