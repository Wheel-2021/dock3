<script lang="ts" setup>
import { CircleStencil, Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  imageData: String,
});
type Emits = {
  (event: 'imageCropped', value: string): void;
  (event: 'cropOut'): void;
  (event: 'resetImageData'): void;
};

const emits = defineEmits<Emits>();

let img = props.imageData;

console.log('Cropper', img);
const cropperChange = () => {
  console.log('yes');
};

const getImage = ref<string | null>(null);
const cropperRef = ref();
const coordinates = ref({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
});
let crop = () => {};
onMounted(() => {
  crop = () => {
    console.log(cropperRef.value);
    const { coordinates: newCordinates, canvas } = cropperRef.value.getResult();
    coordinates.value = newCordinates;
    getImage.value = canvas.toDataURL();
    console.log(getImage);
    if (getImage.value !== null) {
      emits('imageCropped', getImage.value);
      emits('cropOut');
      emits('resetImageData');
    }
    img = '';
  };
});
</script>
<template>
  <div class="">
    <cropper
      ref="cropperRef"
      class="cropper"
      :src="img"
      :stencil-component="CircleStencil"
      :stencil-props="{
        aspectRatio: 1 / 1,
      }"
      @change="cropperChange"
    />
    <button
      class="px-6 py-2 text-sm font-medium tracking-wide text-white font-noto capitalize transition-colors duration-300 transform bg-accent rounded-full hover:bg-spare focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
      @click="crop"
      type="button"
    >
      確定
    </button>
  </div>
</template>
<style lang="scss">
.cropper {
  height: 300px;
  width: 300px;
  background: #ddd;
}
</style>
