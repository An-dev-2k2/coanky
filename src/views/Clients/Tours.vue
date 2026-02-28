<template>
  <div>
    <h1>Tour List</h1>
    <!-- Tour list content goes here -->
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
  getTours()
})
</script>