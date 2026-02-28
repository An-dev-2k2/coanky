<template>
  <div>
    <Map :isAuthorized="isAuthorized" :errorMessage="errorMessage" :locations="locations" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppAPI from '@/services/api/client/TourAPI'
import { useRoute } from 'vue-router';
import Map from '@/components/Map.vue';

const route = useRoute()
const isAuthorized = ref(false)
const errorMessage = ref('')
const locations = ref([])

const fetchTourMap = async () => {
  try {
    const slug = route.params.slug
    const { data } = await AppAPI.getMap(slug)
    locations.value = data.tour.diadiem
    isAuthorized.value = true
  } catch (err) {
    console.error("Error fetching tour map:", err)
    if (err?.statusCode === 404) {
      isAuthorized.value = false
      errorMessage.value = "Bạn chưa đặt tour này"
    } else if (err?.statusCode === 401) {
      isAuthorized.value = false
      errorMessage.value = "Vui lòng đăng nhập"
    }
  }
}

onMounted(() => {
  fetchTourMap()
})
</script>

<style></style>