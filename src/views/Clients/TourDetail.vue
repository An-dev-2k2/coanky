<template>
  <div class="mt-20">
    <button @click="showPopup = true" class="px-6 py-3 bg-green-700 text-white rounded-lg">
      Đặt tour
    </button>

    <!-- Popup -->
    <Modal :model-value="showPopup" @update:modelValue="showPopup = $event" title="Thông tin thanh toán">
      <h2 class="text-xl font-bold mb-4">{{ tour.title }}</h2>

      <p>Giá tour: {{ tour.finalPrice }} VND</p>
      <p>Số dư của bạn: {{ user.price }} VND</p>

      <div class="mt-6 flex justify-end gap-3">

        <!-- Nếu thiếu tiền -->
        <router-link to="/nap-tien" v-if="user.price < tour.finalPrice"
          class="px-4 py-2 bg-yellow-500 text-white rounded">
          Nạp tiền
        </router-link>

        <!-- Nếu đủ tiền -->
        <button v-else class="px-4 py-2 bg-green-600 text-white rounded" @click="payTour">
          Thanh toán
        </button>

        <button class="px-4 py-2 bg-gray-400 text-white rounded" @click="showPopup = false">
          Đóng
        </button>

      </div>
    </Modal>
  </div>
</template>

<script setup>
import TourAPI from '@/services/api/client/TourAPI'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import Modal from '@/components/Modal.vue'

const toast = useToast()
const store = useStore()
const me = computed(() => store.state.user.me)
const user = ref(null)
const route = useRoute()
const tourSlug = route.params.slug

const tour = ref({});
const showPopup = ref(false);

watch(me, (val) => {
  if (val) {
    user.value = val
  }
})
const getTourDetail = async () => {
  try {
    const { data } = await TourAPI.getDetail(tourSlug)
    tour.value = data
  }
  catch (error) {
    console.error('Error fetching tour detail:', error)
  }
}
const payTour = async () => {
  try {
    const { data } = await TourAPI.pay(tour.value.slug);
    store.commit('user/setPrice', data.price)
    toast.success("Thanh toán thành công");
    showPopup.value = false;
  } catch (err) {
    toast.error("Thanh toán thất bại");
  }
};
onMounted(() => {
  getTourDetail()
})
</script>

<style></style>