// image upload
const useImageUpload = () => {
  const uploadDataName = ref();
  const fileData = ref();
  const imgData = ref();
  const isErrorOpen = ref<boolean>(false);
  const errorMessage = ref<string>('');

  const uploadFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      fileData.value = file;

      // 以下アラート対応
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      if (fileExtension && imageExtensions.includes(fileExtension)) {
        uploadDataName.value = fileName;

        // ここはファイルデータの取得
        const reader = new FileReader();
        reader.onload = (e) => {
          imgData.value = e.target?.result as string;
          console.log(imgData.value);
        };

        reader.readAsDataURL(file);

        watch(imgData, (newImgData) => {
          console.log('useImageUploadでimgDataが変化', newImgData);
        });
      } else {
        // alert('画像ファイルを選択してください。');
        errorMessage.value =
          '画像ファイルを選択してください。\njpg・jpeg・png・gif・webp・svg拡張子が有効です。';
        isErrorOpen.value = true;
      }
    }
  };

  onMounted(() => {
    const imageButton = document.querySelector('.imageButton') as HTMLElement;
    imageButton?.addEventListener('click', () => {
      (document.querySelector('#imageInput') as HTMLElement)?.click();
      console.log('click');
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
    watch(uploadDataName, (newValue: string) => {
      if (newValue) {
        imageButton.innerText = newValue;
      }
    });
  });

  return {
    uploadFile,
    fileData,
    imgData,
    isErrorOpen,
    errorMessage,
  };
};

export default useImageUpload;
