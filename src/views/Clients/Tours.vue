<template>
  <div>
    <img class="h-screen w-full fixed" src="/images/bg-tour.png" alt="">
    <ResponsiveContainer>
      <div class=" relative flex justify-center flex-col items-center top-10">
        <img src="/images/lo-trinh-tam-an.png" class="3xl:w-[600px] w-[400px]" alt="Lo Trinh Tam An">
        <div class="grid 3xl:grid-cols-5 grid-cols-4 w-full gap-16 px-10 mt-10">
          <router-link :to="'/tours/' + tour.slug"
            class="relative w-full transition-all duration-300 hover:-translate-y-1" v-for="tour in tours"
            :key="tour.id">
            <img src="/images/bg-card.png" alt="Card Background" class="w-full absolute top-0 left-0">
            <div class="pt-28 px-6 relative z-10">
              <p class="text-center text-[50px] line-clamp-2
         bg-gradient-to-r
         to-[#1d3c06]
         via-[#546310]
         from-[#8b8e01]
         bg-clip-text
         text-transparent font-title">
                {{ tour.title }}
              </p>
              <p class="text-center text-sm bg-gradient-to-r
         to-[#1d3c06]
         via-[#546310]
         from-[#8b8e01]
         bg-clip-text
         text-transparent uppercase line-clamp-2">
                {{ tour.description }}
              </p>
              <div class="mt-5 flex flex-col gap-2 border-b border-[#1d3c06] pb-3 font-cafeta">
                <div class="flex items-center gap-3">
                  <img src="/images/time.png" alt="Vai trò" class="w-6">
                  <span class="text-sm text-[#700001] uppercase line-clamp-1">{{ tour.days }} ngày {{ tour.nights }}
                    đêm</span>
                </div>
                <div class="flex items-center gap-3">
                  <img src="/images/count.png" alt="Vai trò" class="w-6">
                  <span class="text-sm text-[#700001] uppercase line-clamp-1">{{ tour.diadiem }} Điểm</span>
                </div>
                <div class="flex items-center gap-3">
                  <img src="/images/role.png" alt="Vai trò" class="w-6">
                  <span class="text-sm text-[#700001] uppercase line-clamp-1">{{ tour.role }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <img src="/images/master.png" alt="Master Seal" class="w-6">
                  <span class="text-sm text-[#700001] uppercase line-clamp-1">{{ tour.master }}</span>
                </div>
              </div>
              <div class="grid grid-cols-6 gap-2 mt-1">
                <div v-for="(i, index) in tour.diadiem" :key="index">
                  <img src="/images/flower.png" alt="Flower" class="w-full">
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </ResponsiveContainer>
  </div>
</template>

<script setup>
import TourAPI from '@/services/api/client/TourAPI';
import ResponsiveContainer from '@/components/ResponsiveContainer.vue';
import { onMounted, ref } from 'vue';
import { Star, Crown, Flag } from 'lucide-vue-next';

const tours = ref([])
const getTours = async () => {
  try {
    const { data } = await TourAPI.getTours()
    tours.value = data
  }
  catch (error) {
    console.error('Error fetching tours:', error)
  }
}

onMounted(() => {
  getTours()
})
</script>