<template>
  <div class="rounded-[10px] shadow-sm p-4 relative" :class="`${background}`">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  background: {
    type: String,
    default: 'bg-white'
  }
})
</script>