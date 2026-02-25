<template>
  <PopoverRoot v-model:open="open" :disabled="disabled">
    <PopoverTrigger as-child :disabled="disabled">
      <div
        :class="[props.class, disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer bg-white px-3.5 py-1.5 rounded-lg transition-all border border-slate-300/70']"
        class="flex items-center">
        <component :is="icon" class="w-4 h-4 mr-1.5" :class="modelValueDisplay ? '' : 'text-slate-400'" v-if="icon" />
        <span class="truncate flex-1 text-left text-sm" :class="modelValueDisplay ? '' : 'text-slate-400'">
          {{ modelValueDisplay || props.placeholder }}
        </span>
        <ChevronDown class="w-4" :class="modelValueDisplay ? 'text-slate-300' : 'text-slate-400'" />
      </div>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent side="bottom" :side-offset="5"
        class="rounded-md p-3 w-[260px] max-h-[300px] bg-white border border-slate-200 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-y-auto scroll-style outline-hidden">
        <ul class="space-y-1">
          <li v-for="(item, index) in options" :key="index" @click="selectItem(item.value)"
            class="flex items-center justify-between cursor-pointer px-3 py-1.5 rounded "
            :class="isSelected(item.value) ? 'bg-blue-50 text-blue-900 font-medium' : 'text-slate-500 hover:bg-slate-100 hover:font-medium hover:text-slate-900'">
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ item.name }}</span>
            </div>
            <Check v-if="isSelected(item.value)" class="w-4 h-4 text-[var(--primary-900)]" />
          </li>
        </ul>
        <PopoverArrow class="fill-slate-200" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check, ChevronDown } from 'lucide-vue-next'

import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
} from 'radix-vue'

defineOptions({ name: 'AppSingleSelect' })

const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Array, Object, Number],
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  icon: {
    type: Function,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const open = ref(false)

function isEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((val, i) => val === b[i])
  } else if (typeof a === 'object') {
    return a === b
  }
  return a === b
}

// ✅ Hàm kiểm tra item đang được chọn
function isSelected(value) {
  return isEqual(props.modelValue, value)
}
function selectItem(item) {
  if (props.disabled) return
  emit('update:modelValue', item)
  open.value = false
}

const modelValueDisplay = computed(() => {
  return props.options.find(item => {
    if (Array.isArray(item.value) && Array.isArray(props.modelValue)) {
      return item.value.length === props.modelValue.length &&
        item.value.every((val, index) => val === props.modelValue[index])
    }
    if (
      typeof props.modelValue === 'object'
    ) {
      return item.value === props.modelValue.value
    }
    return item.value === props.modelValue
  })?.name || ''
})
</script>
