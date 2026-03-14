<template>
  <div class="">
    <img class="h-screen w-full fixed" src="/images/bg-tour.png" alt="">

    <Map :isAuthorized="isAuthorized" :me="me" :tour="tour" :progress="progress" :errorMessage="errorMessage"
      :locations="locations" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppAPI from '@/services/api/client/TourAPI'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Map from '@/components/Map.vue';

const store = useStore()
const route = useRoute()
const isAuthorized = ref(false)
const errorMessage = ref('')
const locations = ref([])
const tour = ref(null)
const progress = ref(null)
const me = computed(() => store.state.user.me)

const fetchTourMap = async () => {
  try {
    const slug = route.params.slug
    const { data } = await AppAPI.getMap(slug)
    locations.value = data.tour.diadiem
    tour.value = data.tour
    progress.value = data.tourProcess
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