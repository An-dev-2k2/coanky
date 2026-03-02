<template>
  <div>
    <img class="h-screen w-full absolute" src="/images/bg-tour.png" alt="">
    <img class="h-screen w-full absolute" src="/images/bg-icon.png" alt="">
    <div class=" relative flex justify-center items-center flex-col xl:top-10 top-20">
      <img src="/images/so-tay-an-ky.png" class="3xl:w-[600px] xl:w-[400px] w-[280px]" alt="Lo Trinh Tam An">
      <div class=" relative xl:inline-block">
        <img src="/images/book.png" class="3xl:w-[1380px] w-[1200px] xl:block hidden" alt="">
        <div class="xl:absolute inset-0
         xl:ml-20 xl:mr-36 xl:mt-20 mt-5 ml-5 mr-5 xl:mb-16
         grid xl:grid-cols-6 grid-cols-3
         auto-rows-max
         content-start
         gap-4
         xl:h-auto
         h-[60vh]
         overflow-y-auto">
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
              {{
                icon.name }}</p>
            <img :src="icon.image" :class="!icon.collected ? ' grayscale' : ''"
              class="w-full group-hover:scale-110 transition-all duration-300" alt="Icon Image">
          </div>
          <div v-for="icon in icons" :key="icon._id" class="bg-black/30 group cursor-pointer grid place-content-center">
            <p
              class="text-center text-[#FFF3C5] group-hover:tracking-wider transition-all duration-300 mt-2 xl:text-sm text-xs">
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