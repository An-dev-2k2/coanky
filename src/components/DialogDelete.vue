<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @mousedown.self="$emit('update:modelValue', false)">
        <div class="bg-white rounded-xl shadow-2xl w-full flex flex-col"
          :style="{ maxWidth: width, maxHeight: '90vh' }">
          <div class="relative px-5 py-4">
            <div class="relative flex justify-center items-center flex-col gap-2">
              <X class="w-5 text-slate-400 hover:text-slate-800 cursor-pointer absolute top-0 right-0"
                @click="emits('update:modelValue', false)" />
              <div class="w-14 h-14 mt-5 rounded-full bg-red-100 flex justify-center items-center">
                <TriangleAlert class="w-7 h-7 text-red-600" />
              </div>
            </div>
            <p class="text-center mt-4">Bạn chắc chắn muốn xóa <b class="text-red-600">{{ data.name }}</b> này chứ?</p>
            <div class="grid grid-cols-2 justify-center gap-3 mt-4 px-10">
              <Button variant="secondary" @click="emits('update:modelValue', false)">Đóng</Button>

              <template v-if="isLoading">
                <Button variant="danger" disabled type="button" class="inline-flex justify-center">
                  <LoaderCircle class="animate-spin w-5" />
                </Button>
              </template>
              <template v-else>
                <Button @click="emits('submit')" variant="danger" class="inline-flex justify-center">
                  Xóa ngay
                </Button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import Button from './Button.vue';
import { X, LoaderCircle, TriangleAlert } from 'lucide-vue-next';
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '500px' },
  data: { type: Object, default: {} },
  isLoading: { type: Boolean, default: false }
})

const emits = defineEmits(['update:modelValue', 'submit'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>