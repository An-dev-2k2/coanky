<template>
  <div>
    <img class="h-screen w-full absolute" src="/images/bg-tour.png" alt="">
    <div class=" relative flex justify-center items-center top-10">
      <img src="/images/lo-trinh-tam-an.png" class="3xl:w-[600px] w-[400px]" alt="Lo Trinh Tam An">
    </div>
  </div>
</template>

<script setup>
import TourAPI from '@/services/api/client/TourAPI';
import { onMounted, ref } from 'vue';

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
  // getTours()
})
</script>