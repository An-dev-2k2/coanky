<template>
  <div>
    <img class="h-screen w-full fixed" src="/images/bg-tour.png" alt="">
    <ResponsiveContainer>
      <div class=" relative flex justify-center flex-col items-center xl:top-28 top-24">
        <img data-aos="zoom-out" data-aos-delay="700" data-aos-duration="200" src="/images/lo-trinh-tam-an.png"
          class="3xl:w-[600px] xl:w-[400px] w-[280px]" alt="Lo Trinh Tam An">
        <div v-if="tours.length > 0" class="grid 3xl:grid-cols-5 xl:grid-cols-4 grid-cols-1 w-full gap-16 px-10 mt-10">
          <router-link :to="'/tours/' + tour.slug"
            class="relative w-full transition-all duration-300 hover:-translate-y-1" v-for="(tour, index) in tours"
            :key="tour.id">
            <img src="/images/bg-card.png" alt="Card Background" class="w-full absolute top-0 left-0">
            <!-- Tags Trạng thái -->
            <div class="absolute top-16 right-8 z-20 flex flex-col gap-1 items-end pointer-events-none">
              <div v-if="tour.isCompleted"
                class="bg-gradient-to-r from-[#8b8e01] to-[#1d3c06] text-white text-[10px] px-3 py-1 rounded-bl-xl rounded-tr-xl font-cafeta uppercase shadow-md border border-[#f5e1a4]/30 backdrop-blur-sm">
                Đã hoàn thành
              </div>
              <div v-if="tour.isInProgress"
                class="bg-gradient-to-r from-[#b06c03] to-[#700001] text-white text-[10px] px-3 py-1 rounded-bl-xl rounded-tr-xl font-cafeta uppercase shadow-md border border-[#f5e1a4]/30 backdrop-blur-sm animate-pulse">
                Đang tham gia
              </div>
            </div>
            <div class="3xl:pt-24 pt-28 px-6 relative z-10">
              <p class="text-center text-[40px] leading-none line-clamp-2
         bg-gradient-to-r
         to-[#1d3c06]
         via-[#546310]
         from-[#8b8e01]
         bg-clip-text
         text-transparent font-title">
                {{ tour.title }}
              </p>
              <p class="text-center text-xs bg-gradient-to-r
         to-[#1d3c06]
         via-[#546310]
         from-[#8b8e01]
         bg-clip-text
         text-transparent uppercase line-clamp-1">
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
                  <span class="text-sm text-[#700001] uppercase line-clamp-1">{{ tour.diadiem.length }} Điểm</span>
                </div>
                <div class="flex items-center gap-3">
                  <img src="/images/role.png" alt="Vai trò" class="w-6">
                  <span class="text-sm text-[#700001] uppercase line-clamp-1">{{ tour.role }}</span>
                </div>
              </div>
              <div class="grid grid-cols-6 gap-2 mt-1">
                <div v-for="(i, index) in tour.diadiem" :key="index">
                  <img src="/images/flower.png" alt="Flower" :class="!i.collected ? 'grayscale' : ''" class="w-full">
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <p v-else class="text-center text-[30px] text-[#B06C03] pt-20">Không có tour nào.</p>
        <div class="mt-10 pb-20 w-full flex justify-center">
          <BasePagination :total="pagination.total" :limit="pagination.limit" :currentPage="pagination.page"
            @change="handlePageChange" />
        </div>
      </div>
    </ResponsiveContainer>
  </div>
</template>

<script setup>
import TourAPI from '@/services/api/client/TourAPI';
import ResponsiveContainer from '@/components/ResponsiveContainer.vue';
import BasePagination from '@/components/BasePagination.vue';
import { onMounted, reactive, ref } from 'vue';
import { Star, Crown, Flag } from 'lucide-vue-next';

const tours = ref([])
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 10
})
const getTours = async () => {
  try {
    const res = await TourAPI.getTours({
      page: pagination.page,
      limit: pagination.limit
    })
    tours.value = res.data
    pagination.total = res.pagination.total
  }
  catch (error) {
    console.error('Error fetching tours:', error)
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  getTours()
}

onMounted(() => {
  getTours()
})
</script>