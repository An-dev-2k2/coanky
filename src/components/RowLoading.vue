<template>
  <tr>
    <td :colspan="colSpan" class="text-center py-5">
      <ProgressCircular color="fill-[color:var(--primary-color)]" size="30" />
    </td>
  </tr>
</template>

<script setup>
import ProgressCircular from './ProgressCircular.vue';
defineProps({
  colSpan: {
    type: Number,
    default: 9
  }
})
</script>

<style>

</style>