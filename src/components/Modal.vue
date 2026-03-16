<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" :class="classDialog" class="fixed inset-0 flex items-center justify-center bg-black/50"
        @mousedown.self="$emit('update:modelValue', false)">
        <div :class="classForm" class="w-full flex flex-col" :style="{ maxWidth: width, maxHeight: '90vh' }">
          <!-- Header -->
          <div v-if="isTitle" class="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
            <h5 class="font-semibold text-base">{{ title }}</h5>
            <button type="button" @click="$emit('update:modelValue', false)"
              class="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div :class="classBody" class="flex-1 relative">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-5 py-4 border-t border-slate-200 shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '500px' },
  isTitle: { type: Boolean, default: true },
  classForm: { type: String, default: 'bg-white rounded-xl shadow-2xl' },
  classDialog: { type: String, default: 'z-[1000]' },
  classBody: { type: String, default: 'px-5 py-4' }
})

defineEmits(['update:modelValue'])
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