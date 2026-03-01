<template>
  <div>
    <div class="fixed bottom-0 left-0 z-10">
      <img src="/images/bg-footer-price.png" alt="">
      <div class=" absolute flex justify-center items-center gap-5 top-0 left-0 w-full h-full">
        <p class="text-[#980000] text-lg"><span class="text-[#B06C0380]">Giá: </span><b>{{
          formatPrice(tour?.price) }}
            VNĐ</b></p>
        <span class="text-[#B06C0380] line-through">-{{ tour?.percent }}%</span>
        <button v-if="!tour?.isMap" @click="showPopup = true" class="flex justify-center items-center relative z-20">
          <img src="/images/btn-green.png" alt="" class="w-[150px]">
          <p class=" absolute text-white">Đặt tour</p>
        </button>
        <router-link v-else :to="tour?.slug + '/map'" class="flex justify-center items-center relative z-20">
          <img src="/images/btn-green.png" alt="" class="w-[150px]">
          <p class=" absolute text-white">Map</p>
        </router-link>
      </div>
    </div>
    <img class="h-screen w-full absolute" src="/images/bg-detail-tour.jpg" alt="">
    <div class="relative pt-20 px-40">
      <img src="/images/cuon-tren.png" class="relative z-10" />
      <div class="px-[48px] -translate-y-5 relative z-5">
        <div class="bg-[url('/images/cuon-giua.png')] bg-cover bg-center bg-no-repeat px-28 py-5">
          <p class="text-[#B06C03] flex items-center gap-1 text-xs">
            <Clock class="w-4" />
            <span>Ngày đăng: {{ formatDate(tour?.createdAt) }} {{ formatTimeOnly(tour?.createdAt) }}</span>
          </p>
          <p class="text-center pt-5 text-3xl text-[#B06C03] uppercase">{{ tour?.title }}</p>
          <p class="text-center text-sm mt-4 text-[#B06C03]">"{{ tour?.description }}"</p>
          <div class="flex justify-center mt-5">
            <img src="/images/line.png" class="w-[200px]" alt="line">
          </div>
        </div>
      </div>
      <img src="/images/cuon-duoi.png" class="relative z-0 -translate-y-14" />
      <!-- <button v-if="!tour?.isMap" @click="showPopup = true" class="px-6 py-3 bg-green-700 text-white rounded-lg">
        Đặt tour
      </button>
      <router-link v-else :to="tour?.slug + '/map'">
        Map
      </router-link> -->

      <Modal :is-title="false" :class-form="''" width="1000px" :model-value="showPopup"
        @update:modelValue="showPopup = $event" title="Thông tin thanh toán">
        <img src="/images/bg-pay.png" alt="">
        <div class=" absolute top-0 left-0 pt-28 pb-24 pl-28 pr-24 w-full h-full font-rowdies">
          <div class="flex items-center gap-1">
            <img src="/images/hoavan.png" class="w-6" />
            <span class="text-[#B06C03] text-xl">Thông tin thanh toán</span>
          </div>
          <div class="grid grid-cols-12">
            <div class="col-span-7 pt-10 flex flex-col gap-4">
              <div class="flex items-center gap-5 text-2xl">
                <span class="text-[#B06C03]">Tour:</span>
                <h2 class="font-bold text-[#00634F]">{{ tour.title }}</h2>
              </div>
              <div class="flex items-center gap-5 text-2xl">
                <span class="text-[#B06C03]">Giá:</span>
                <h2 class="font-bold text-[#00634F]">{{ formatPrice(tour?.finalPrice) }} VNĐ</h2>
              </div>
              <div class="flex justify-center items-center flex-col mt-10">
                <button :disabled="user?.price < tour.finalPrice" @click="payTour"
                  :class="user?.price < tour.finalPrice ? ' grayscale cursor-no-drop' : 'hover:brightness-110'"
                  class=" relative flex justify-center items-center transition-all duration-300">
                  <img src="/images/btn-green.png" class="w-52" alt="btn green">
                  <p class=" absolute text-white text-2xl">Thanh toán</p>
                </button>
                <p class="text-[#B06C03] mt-10 text-sm">*Lưu ý: Nạp tiền trước để đủ số dư thanh toán</p>
              </div>
            </div>
            <div class="col-span-5 flex flex-col items-center">
              <div class="flex justify-center items-center relative">
                <img src="/images/btn-balance.png" alt="btn balance" class="w-[280px]">
                <p class=" absolute font-bold text-[#B06C03] text-lg">Số dư: {{ formatPrice(user?.price) }} VNĐ</p>
              </div>
              <div class="flex justify-center items-center relative pt-4">
                <img src="/images/bg-qr.png" class="w-[280px]" alt="">
                <img
                  src="https://img.vietqr.io/image/acb-44412187-print.jpg?addInfo=${'ok'}&accountName=Nguyen tan hung"
                  alt="" class="w-32 absolute">
              </div>
              <p class="mt-3 text-[#B06C03]">Quét QR để nạp tiền</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import TourAPI from '@/services/api/client/TourAPI'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { Clock } from 'lucide-vue-next'
import Modal from '@/components/Modal.vue'
import { useFormat } from '@/composables/useFormat';


const { formatPrice, formatDate, formatTimeOnly } = useFormat()
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
  if (user.value?.price < tour.value?.finalPrice) {
    toast.error("Vui lòng nạp tiền trước khi thanh toán")
    return
  }
  try {
    const { data } = await TourAPI.pay(tour.value.slug);
    store.commit('user/setPrice', data.price)
    toast.success("Thanh toán thành công");
    showPopup.value = false;
  } catch (err) {
    toast.error(err?.message || "Thanh toán thất bại");
  }
};
onMounted(() => {
  getTourDetail()
})
</script>

<style></style>