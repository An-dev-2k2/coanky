<template>
  <button
    :class="[classes[props.variant], props.disabled ? 'cursor-no-drop opacity-60' : 'hover:shadow-lg hover:-translate-y-0.5 shadow-md cursor-pointer ' + hoverClasses[props.variant]]"
    :disabled="props.disabled" class="px-4 py-2.5 rounded-lg text-sm transition">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})


const classes = {
  primary: 'bg-blue-500 text-white shadow-blue-500/40 hover:shadow-blue-500/70 text-white',
  success: 'bg-green-500 text-white shadow-green-500/40 hover:shadow-green-500/70 text-white',
  secondary: 'bg-gray-500 text-white shadow-gray-500/40 hover:shadow-gray-500/70 text-white',
  danger: 'bg-red-500 text-white shadow-red-500/40 hover:shadow-red-500/70 text-white'
}
const hoverClasses = {
  primary: 'hover:bg-blue-600',
  success: 'hover:bg-green-600',
  secondary: 'hover:bg-gray-600',
  danger: 'hover:bg-red-600'
}
</script>