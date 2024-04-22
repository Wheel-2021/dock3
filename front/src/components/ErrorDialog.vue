<script lang="ts" setup>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  isErrorDialog: Boolean,
  message: String,
});
const emit = defineEmits(['update:isErrorDialog']);
const setErrorIsOpen = () => {
  emit('update:isErrorDialog', false);
};
</script>

<template>
  <TransitionRoot :show="props.isErrorDialog">
    <Dialog
      :open="props.isErrorDialog"
      class="fixed inset-0 z-50 overflow-y-auto"
    >
      <div class="flex items-center justify-center min-h-screen">
        <TransitionChild
          enter="duration-150 ease-out"
          enter-frame="opacity-0"
          leave="duration-150 ease-in"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-800 opacity-80" />
        </TransitionChild>

        <TransitionChild
          enter="duration-100 ease-out"
          enter-from="opacity-0 scale-0"
          enter-to="opacity-50 scale-100"
          leave="duration-100 ease-in"
          leave-from="opacity-50 scale-100"
          leave-to="opacity-0 scale-0"
        >
          <div
            class="relative w-full p-8 my-4 mx-auto overflow-y-auto bg-white rounded-lg"
          >
            <button
              class="absolute top-2.5 right-2.5 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              @click="setErrorIsOpen"
            >
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
            <DialogTitle>
              <h2 class="mb-4 text-xl font-medium text-center">エラー</h2>
            </DialogTitle>

            <DialogDescription>
              <p
                class="mt-1 px-4 text-left sm:text-center text-gray-600 text-sm leading-relaxed"
              >
                {{ props.message }}
              </p>
            </DialogDescription>

            <div class="flex justify-center mt-4">
              <button
                class="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                type="submit"
                @click="setErrorIsOpen"
              >
                OK
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped lang="scss"></style>
