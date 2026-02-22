<template>
  <div class="flex flex-col gap-2 items-center justify-center h-[24rem] w-full">
    <Frown class="w-14 h-14 text-red-500" />
    <span class="text-[var(--color-text)] font-bold text-lg">Không tìm thấy dữ liệu</span>
  </div>
</template>

<script setup>
import { Frown } from 'lucide-vue-next';
defineOptions({
  name: 'AppNoData'
})
</script>