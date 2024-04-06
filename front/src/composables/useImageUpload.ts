// image upload
const useImageUpload = () => {
  const uploadDataName = ref();
  const fileData = ref();
  const uploadFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      fileData.value = file;
      console.log(fileData);

      // 以下アラート対応
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      const imageExtensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
        'svg',
      ];
      if (fileExtension && imageExtensions.includes(fileExtension)) {
        uploadDataName.value = fileName;
      } else {
        alert('画像ファイルを選択してください。');
      }
    }
  };

  onMounted(() => {
    const imageButton = document.querySelector('.imageButton') as HTMLElement;
    imageButton?.addEventListener('click', () => {
      (document.querySelector('#imageInput') as HTMLElement)?.click();
    });
    imageButton?.addEventListener('keydown', (event) => {
      if (!imageButton.isEqualNode(event.target as Node)) {
        return;
      }

      if (event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        (document.querySelector('#imageInput') as HTMLElement)?.click();
      }
    });
    watch(uploadDataName, (newValue) => {
      if (newValue) {
        imageButton.innerText = newValue;
      }
    });
  });

  return {
    uploadFile,
    fileData,
  };
};

export default useImageUpload;
