<template>
  <div>
    <img class="h-screen w-full absolute" src="/images/bg-tour.png" alt="">
    <img class="h-screen w-full absolute" src="/images/bg-icon.png" alt="">
    <div class=" relative flex justify-center items-center flex-col top-10">
      <img src="/images/so-tay-an-ky.png" class="3xl:w-[600px] w-[400px]" alt="Lo Trinh Tam An">
      <div class=" relative inline-block">
        <img src="/images/book.png" class="3xl:w-[1380px] w-[1200px] block" alt="">
        <div class="absolute inset-0
         ml-20 mr-36 mt-20 mb-16
         grid grid-cols-6
         auto-rows-max
         content-start
         gap-4
         overflow-y-auto">
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 text-sm">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import IconAPI from '@/services/api/client/IconAPI';

const icons = ref([])
const getIcons = async () => {
  // Gọi API để lấy danh sách icons
  try {
    const { data } = await IconAPI.getIcons()
    icons.value = data
  }
  catch (error) {
    console.error('Lỗi khi lấy danh sách icons:', error);
  }
}
onMounted(() => {
  getIcons()
})
</script>

<style></style>