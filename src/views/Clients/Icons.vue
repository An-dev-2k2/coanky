<template>
  <div>
    <img class="h-screen w-full absolute" src="/images/bg-tour.png" alt="">
    <img class="h-screen w-full absolute" src="/images/bg-icon.png" alt="">
    <div class=" relative flex justify-center items-center flex-col xl:top-10 top-20">
      <img data-aos="zoom-out" data-aos-delay="700" data-aos-duration="200" src="/images/so-tay-an-ky.png"
        class="3xl:w-[600px] xl:w-[400px] w-[280px]" alt="Lo Trinh Tam An">
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
          <div @click="showPopup(icon)" data-aos="zoom-in" :data-aos-delay="(index + 1) * 800" data-aos-duration="500"
            v-for="(icon, index) in icons" :key="icon._id"
            class="bg-black/30 group cursor-pointer grid place-content-center">
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
    <Modal :model-value="isPopup" title="Thông tin ấn ký" class="font-rowdies" @update:modelValue="isPopup = $event">
      <div class="absolute top-0 left-0 w-12 h-12 pointer-events-none">
        <div class="absolute top-2 left-2 w-4 h-[1px]" style="background:#D4A017;"></div>
        <div class="absolute top-2 left-2 w-[1px] h-4" style="background:#D4A017;"></div>
      </div>
      <div class="absolute top-0 right-0 w-12 h-12 pointer-events-none">
        <div class="absolute top-2 right-2 w-4 h-[1px]" style="background:#D4A017;"></div>
        <div class="absolute top-2 right-2 w-[1px] h-4" style="background:#D4A017;"></div>
      </div>
      <div class="absolute bottom-0 left-0 w-12 h-12 pointer-events-none">
        <div class="absolute bottom-2 left-2 w-4 h-[1px]" style="background:#D4A017;"></div>
        <div class="absolute bottom-2 left-2 w-[1px] h-4" style="background:#D4A017;"></div>
      </div>
      <div class="absolute bottom-0 right-0 w-12 h-12 pointer-events-none">
        <div class="absolute bottom-2 right-2 w-4 h-[1px]" style="background:#D4A017;"></div>
        <div class="absolute bottom-2 right-2 w-[1px] h-4" style="background:#D4A017;"></div>
      </div>

      <!-- Content -->
      <div class="p-6 flex flex-col items-center gap-4">
        <!-- Title -->
        <p class="text-xs tracking-[0.3em] uppercase font-rowdies text-[#D4A017]">Ấn Ký</p>

        <!-- Image container -->
        <div class="relative">
          <!-- Glow effect for collected -->
          <div v-if="selectedIcon?.collected" class="absolute inset-0 rounded-lg blur-xl opacity-40 animate-pulse"
            style="background: radial-gradient(circle, #D4A017, transparent);"></div>
          <div class="relative w-36 h-36 rounded-lg flex items-center justify-center"
            style="background: radial-gradient(circle, rgba(212,160,23,0.15) 0%, rgba(0,0,0,0.4) 100%); border: 1px solid rgba(212,160,23,0.3);">
            <img :src="selectedIcon?.image" :class="!selectedIcon?.collected ? 'grayscale' : ''"
              class="w-28 h-28 object-contain transition-all duration-500" alt="Icon">
          </div>
        </div>

        <!-- Name -->
        <div class="text-center">
          <h3 class="text-xl font-semibold tracking-wide font-rowdies text-[#FFF3C5]">
            {{ selectedIcon?.name }}
          </h3>
        </div>

        <!-- Divider -->
        <div class=" w-full flex items-center gap-3">
          <div class="flex-1 h-[1px]" style="background: linear-gradient(90deg, transparent, rgba(212,160,23,0.4));">
          </div>
          <div class="w-1 h-1 rounded-full" style="background: #D4A017;"></div>
          <div class="flex-1 h-[1px]" style="background: linear-gradient(90deg, rgba(212,160,23,0.4), transparent);">
          </div>
        </div>

        <!-- Collected info -->
        <div v-if="selectedIcon?.collected" class="w-full rounded-xl p-3 text-center"
          style="background: rgba(212,160,23,0.08); border: 1px solid rgba(212,160,23,0.2);">
          <p class="text-xs mb-1 font-rowdies" style="color: rgba(255,243,197,0.5);">Ngày hoàn thành</p>
          <p class="text-sm font-medium font-rowdies text-[#FFF3C5]">
            {{ formatDate(selectedIcon?.stampedAt) }}
          </p>
          <div class="mt-2 flex items-center justify-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500"></span>
            <span class="text-xs font-rowdies text-[#4ade80]">Đã thu thập</span>
          </div>
        </div>

        <div v-else class="w-full rounded-xl p-3 text-center"
          style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">
          <div class="flex items-center justify-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#9ca3af]"></span>
            <span class="text-xs font-rowdies text-[#9ca3af]">Chưa thu thập</span>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import IconAPI from '@/services/api/client/IconAPI';
import Modal from '@/components/Modal.vue';
import { useFormat } from '@/composables/useFormat';

const { formatDate } = useFormat()
const icons = ref([])
const isPopup = ref(false)
const selectedIcon = ref(null)

const showPopup = (icon) => {
  selectedIcon.value = icon
  isPopup.value = true
}
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