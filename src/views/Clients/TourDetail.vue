<template>
  <div>
    <div class="fixed bottom-0 left-0 right-0 z-20">
      <img src="/images/bg-footer-price.png" class="xl:block hidden" alt="bg footer price">
      <div
        class=" xl:absolute xl:bg-transparent bg-[#F4DBAB] xl:py-0 py-2 flex justify-center items-center gap-5 top-0 left-0 w-full h-full">
        <p class="text-[#980000] xl:text-lg text-sm"><span class="text-[#B06C0380]">Giá: </span><b>{{
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
    <img class="h-screen w-full fixed top-0 left-0 right-0" src="/images/bg-detail-tour.jpg" alt="">
    <div class="relative xl:pt-24 xl:px-40 pt-24">
      <img src="/images/cuon-tren.png" class="relative z-10" />
      <div class="3xl:px-[63px] xl:px-[48px] px-[15px] 3xl:-translate-y-7 -translate-y-5 relative z-5">
        <div
          class="bg-[url('/images/cuon-giua.png')] bg-cover bg-center bg-no-repeat 3xl:px-36 xl:px-28 px-10 pt-5 xl:pb-5 pb-10">
          <!--<p class="text-[#B06C03] flex items-center gap-1 xl:text-xs text-[10px]">
            <Clock class="xl:w-4 w-2.5" />
            <span>Ngày đăng: {{ formatDate(tour?.createdAt) }} {{ formatTimeOnly(tour?.createdAt) }}</span>
          </p> -->
          <p class="text-center xl:pt-5 pt-3 xl:text-3xl text-lg text-[#B06C03] uppercase">{{ tour?.title }}</p>
          <p class="text-center xl:text-sm text-[11px] xl:mt-4 text-[#B06C03]">"{{ tour?.description }}"</p>
          <div class="flex justify-center xl:mt-5 mt-2">
            <img src="/images/line.png" class="xl:w-[200px] w-[100px]" alt="line">
          </div>
          <div class="xl:mt-3 mt-2 tour-content" v-html="formattedContent"></div>
        </div>
      </div>
      <img src="/images/cuon-duoi.png" class="relative z-0 3xl:-translate-y-24 -translate-y-14" />
      <!-- <button v-if="!tour?.isMap" @click="showPopup = true" class="px-6 py-3 bg-green-700 text-white rounded-lg">
        Đặt tour
      </button>
      <router-link v-else :to="tour?.slug + '/map'">
        Map
      </router-link> -->

      <Modal :is-title="false" :class-form="''" width="1000px" :model-value="showPopup"
        @update:modelValue="showPopup = $event" title="Thông tin thanh toán">
        <img src="/images/bg-pay.png" class="xl:block hidden" alt="">
        <div
          class=" xl:absolute top-0 xl:bg-transparent bg-white xl:rounded-none rounded-xl left-0 xl:pt-28 pt-3 xl:pb-24 pb-3 xl:pl-28 pl-3 xl:pr-24 pr-3 w-full h-full font-rowdies">
          <div class="flex items-center gap-1">
            <img src="/images/hoavan.png" class="w-6" />
            <span class="text-[#B06C03] text-xl">Thông tin thanh toán</span>
          </div>
          <div class="grid grid-cols-12 xl:gap-0 gap-4">
            <div
              class="xl:col-span-7 col-span-12 border-b-[1px] border-[#B06C03] pt-10 xl:pb-0 pb-5 flex flex-col gap-4">
              <div class="flex items-center gap-5 xl:text-2xl text-xl">
                <span class="text-[#B06C03]">Tour:</span>
                <h2 class="font-bold text-[#00634F]">{{ tour.title }}</h2>
              </div>
              <div class="flex items-center gap-5 text-2xl">
                <span class="text-[#B06C03]">Giá:</span>
                <h2 class="font-bold text-[#00634F]">{{ formatPrice(tour?.finalPrice) }} VNĐ</h2>
              </div>
              <div class="flex justify-center items-center flex-col xl:mt-10 mt-5">
                <button v-if="isToken" :disabled="user?.price < tour.finalPrice || isLoadingPay" @click="payTour"
                  :class="[
                    user?.price < tour.finalPrice ? 'grayscale' : '',
                    (user?.price < tour.finalPrice || isLoadingPay)
                      ? 'cursor-no-drop opacity-40'
                      : 'hover:brightness-110'
                  ]" class=" relative flex justify-center items-center transition-all duration-300">
                  <img src="/images/btn-green.png" class="xl:w-52 w-44" alt="btn green">
                  <Loader v-if="isLoadingPay" class="w-4 absolute animate-spin text-white" />
                  <p v-else class=" absolute text-white xl:text-2xl text-lg">Thanh toán</p>
                </button>
                <a href="/login" v-else
                  class="relative flex justify-center items-center transition-all duration-300 hover:brightness-110">
                  <img src="/images/btn-green.png" class="xl:w-52 w-44" alt="btn green">
                  <p class=" absolute text-white xl:text-2xl text-lg">Đăng nhập</p>
                </a>
                <p class="text-[#B06C03] mt-10 text-sm">*Lưu ý: Nạp tiền trước để đủ số dư thanh toán</p>
              </div>
            </div>
            <div class="xl:col-span-5 col-span-12 flex flex-col items-center">
              <div class="flex justify-center items-center relative">
                <img src="/images/btn-balance.png" alt="btn balance" class="w-[280px]">
                <p class=" absolute font-bold text-[#B06C03] text-lg">Số dư: {{ formatPrice(user?.price) }} VNĐ</p>
              </div>
              <div class="flex justify-center items-center relative pt-4">
                <img src="/images/bg-qr.png" class="w-[280px]" alt="">
                <template v-if="descQR">
                  <img
                    :src="`https://img.vietqr.io/image/MB-0150320032628-qr_only.jpg?addInfo=${descQR}&accountName=NGUYEN PHUONG THAO`"
                    alt="" class="w-40 absolute">
                </template>
                <template v-else>
                  <p class=" absolute text-sm text-[#B06C03] px-8 text-center">Bạn không có QR. Vui lòng liên hệ admin
                  </p>
                </template>
              </div>
              <p class="mt-3 text-[#B06C03] xl:text-base text-sm">Quét QR để nạp tiền</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    <div v-if="tour?.diadiem?.length"
      class="tour-map-timeline relative flex gap-[var(--gap)] justify-center items-start mt-10 mb-40"
      :class="{ 'no-line': tour.diadiem.length === 1 }">
      <div v-for="(location, index) in tour.diadiem" :key="index"
        class="timeline-item relative flex flex-col items-center" :class="{ collected: location.collected }">
        <div class="timeline-dot bg-white z-10 w-5 h-5 rounded-full border-2 border-[#B06C03] relative"></div>

        <div class="timeline-card">
          <img :src="location.icon?.image"
            class="timeline-icon w-28 container grayscale opacity-50 transition-all duration-300" />
          <p class="timeline-name">
            {{ location.icon?.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TourAPI from '@/services/api/client/TourAPI'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { Clock, Loader } from 'lucide-vue-next'
import Modal from '@/components/Modal.vue'
import { useFormat } from '@/composables/useFormat';
import socket from '@/services/socket'

const { formatPrice, formatDate, formatTimeOnly } = useFormat()
const toast = useToast()
const store = useStore()
const me = computed(() => store.state.user.me)
const user = ref(null)
const route = useRoute()
const tourSlug = route.params.slug
const descQR = ref('')
const isToken = computed(() => !!sessionStorage.getItem('token'))

const tour = ref({});
const showPopup = ref(false);
const isLoadingPay = ref(false)

const formattedContent = computed(() => {
  if (!tour.value?.content) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(tour.value.content, 'text/html')

  // ✅ Xử lý h3 TRƯỚC h2
  doc.querySelectorAll('h3').forEach((h3, index, list) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'h3-custom-block'
    if (index === list.length - 1) {
      wrapper.classList.add('h3-last')
    }

    h3.parentNode.insertBefore(wrapper, h3)
    wrapper.appendChild(h3)

    // Gom các element phía sau cho đến h3/h2 tiếp theo
    let next = wrapper.nextSibling
    while (next && next.nodeName !== 'H3' && next.nodeName !== 'H2') {
      const toMove = next
      next = next.nextSibling
      wrapper.appendChild(toMove)
    }

    const dot = document.createElement('span')
    dot.className = 'h3-dot'
    h3.insertBefore(dot, h3.firstChild)
  })

  // Xử lý h2 SAU
  // Xử lý h2 SAU
  doc.querySelectorAll('h2').forEach(h2 => {
    const wrapper = document.createElement('div')
    wrapper.className = 'h2-custom-block'

    h2.parentNode.insertBefore(wrapper, h2)
    wrapper.appendChild(h2)

    let next = wrapper.nextSibling
    while (next && next.nodeName !== 'H2') {
      const toMove = next
      next = next.nextSibling
      wrapper.appendChild(toMove)
    }

    const imgLeft = document.createElement('img')
    imgLeft.src = '/images/hoavan.png'
    imgLeft.className = 'h2-icon-left'
    h2.insertBefore(imgLeft, h2.firstChild)

    // ✅ Wrap tất cả h3-custom-block vào 1 timeline container
    const h3Blocks = wrapper.querySelectorAll('.h3-custom-block')
    if (h3Blocks.length > 0) {
      const timeline = document.createElement('div')
      timeline.className = 'h3-timeline'
      h3Blocks[0].parentNode.insertBefore(timeline, h3Blocks[0])
      h3Blocks.forEach(block => {
        block.classList.remove('h3-last') // reset, không cần nữa
        timeline.appendChild(block)
      })
    }
  })

  return doc.body.innerHTML
})
watch(me, (val) => {
  if (val) {
    user.value = val
    descQR.value = val?.deposit_identifier ? 'NAP TIEN ' + val?.deposit_identifier : ''
    socket.emit("join_user_room", val._id);
  }
}, { immediate: true })
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
  if (isLoadingPay.value) return
  isLoadingPay.value = true
  if (user.value?.price < tour.value?.finalPrice) {
    isLoadingPay.value = false
    toast.error("Vui lòng nạp tiền trước khi thanh toán")
    return
  }
  try {
    const { data } = await TourAPI.pay(tour.value.slug);
    store.commit('user/setPrice', data.price)
    toast.success("Thanh toán thành công");
    tour.value.isMap = true
    showPopup.value = false;
  } catch (err) {
    toast.error(err?.message || "Thanh toán thất bại");
  } finally {
    isLoadingPay.value = false
  }
};
onMounted(() => {
  getTourDetail()

  if (user.value?._id) {
    socket.emit("join_user_room", user.value._id);
  }

  socket.on("deposit_success", (data) => {
    store.commit("user/setPrice", data.newBalance);

    toast.success(
      `Nạp tiền thành công +${formatPrice(data.amount)} VNĐ`
    );
  });
})
</script>

<style>
/* .tour-content .h2-custom-block {
  display: flex;
  flex-direction: column;
  margin: 1.5em 0 0.5em;
} */

:root {
  --gap: 40px;
}

.tour-content h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4em;
  font-weight: bold;
  color: #00634F;
  text-align: center;
  width: 100%;
}

.tour-content .h2-icon-left {
  width: 20px;
  height: auto;
  flex-shrink: 0;
}

.tour-content .h2-icon-right {
  width: 20px;
  height: auto;
  flex-shrink: 0;
  transform: scaleX(-1);
}

.tour-content .h2-line {
  width: 150px;
  display: block;
  margin: 6px auto 0;
}

.tour-content p {
  padding: 0 2em;
  line-height: 1.8;
}

.tour-content .h2-custom-block {
  padding-left: 0;
  margin: 1.5em 0 0.5em;
}

/* Timeline container — chứa đường line dọc duy nhất */
.tour-content .h3-timeline {
  position: relative;
  padding-left: 1.8em;
  margin-top: 0.5em;
}

/* 1 đường line dọc duy nhất chạy suốt từ trên xuống dưới */
.tour-content .h3-timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  /* căn giữa dot: 12px/2 - 1px border = 5px */
  top: 8px;
  /* bắt đầu từ tâm dot đầu tiên */
  bottom: 8px;
  /* kết thúc tại tâm dot cuối */
  width: 2px;
  background-color: #B06C03;
  opacity: 0.3;
}

.tour-content .h3-custom-block {
  display: block;
  position: relative;
  padding: 0 0 0.8em 0;
}

.tour-content h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1em;
  font-weight: bold;
  color: #B06C03;
  margin-left: -1.8em;
}

.tour-content .h3-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #B06C03;
  background: #ede0c4;
  /* khớp màu nền cuon-giua */
  flex-shrink: 0;
  display: inline-block;
  position: relative;
  z-index: 1;
  /* dot nổi trên line */
}

.tour-content .h3-custom-block p {
  padding: 0;
  line-height: 1.8;
  margin-left: 0;
}

/* Xóa ::before cũ trên từng block */
.tour-content .h3-custom-block::before {
  display: none;
}

/* ========== RESPONSIVE ========== */

/* Large tablet (< 1280px) */
@media (max-width: 1280px) {
  .tour-content h2 {
    font-size: 1.3em;
  }

  .tour-content p {
    padding: 0 1.5em;
  }

  .tour-content img[style*="float"] {
    width: 45% !important;
  }
}

/* Tablet (< 1024px) */
@media (max-width: 1024px) {
  .tour-content h2 {
    font-size: 1.15em;
    gap: 8px;
  }

  .tour-content .h2-icon-left,
  .tour-content .h2-icon-right {
    width: 16px;
  }

  .tour-content h3 {
    font-size: 0.95em;
    margin-left: -1.5em;
  }

  .tour-content p {
    padding: 0 1em;
    font-size: 0.93em;
  }

  .tour-content .h3-timeline {
    padding-left: 1.5em;
  }

  .tour-content .h3-timeline::before {
    left: 4px;
    /* dot 10px / 2 - 1px border = 4px */
  }

  .tour-content img[style*="float"] {
    width: 40% !important;
  }
}

/* Mobile landscape + small tablet (< 768px) */
@media (max-width: 768px) {
  .tour-content h2 {
    font-size: 1em;
    gap: 6px;
  }

  .tour-content .h2-icon-left,
  .tour-content .h2-icon-right {
    width: 14px;
  }

  .tour-content .h2-custom-block {
    margin: 1em 0 0.3em;
  }

  .tour-content h3 {
    font-size: 0.9em;
    margin-left: -1.2em;
  }

  .tour-content p {
    padding: 0 0.5em;
    font-size: 0.88em;
    line-height: 1.7;
  }

  .tour-content .h3-timeline {
    padding-left: 1.2em;
  }

  .tour-content .h3-timeline::before {
    left: 3px;
    /* dot 9px / 2 - 1px border = 3.5px ~ 3px */
    top: 6px;
    bottom: 6px;
  }

  .tour-content .h3-dot {
    width: 10px;
    height: 10px;
  }

  .tour-content .h3-custom-block {
    padding-bottom: 0.5em;
  }

  /* Ảnh float: bỏ float, full width */
  .tour-content img[style*="float: left"],
  .tour-content img[style*="float: right"],
  .tour-content img[style*="float:left"],
  .tour-content img[style*="float:right"] {
    float: none !important;
    width: 100% !important;
    margin: 0.5em 0 !important;
    display: block;
    border-radius: 6px;
  }
}

/* Mobile portrait (< 480px) */
@media (max-width: 480px) {
  .tour-content h2 {
    font-size: 0.95em;
  }

  .tour-content .h2-icon-left,
  .tour-content .h2-icon-right {
    width: 12px;
  }

  .tour-content h3 {
    font-size: 0.85em;
    margin-left: -1.2em;
  }

  .tour-content p {
    padding: 0 0.3em;
    font-size: 0.85em;
    line-height: 1.65;
  }

  .tour-content .h3-timeline {
    padding-left: 1.2em;
  }

  .tour-content .h3-dot {
    width: 9px;
    height: 9px;
  }

  .tour-content .h3-timeline::before {
    left: 6px;
    top: 6px;
    bottom: 5px;
  }
}


/* container timeline */

/* line nối tới item tiếp theo */
.timeline-item::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 50%;
  width: calc(100% + var(--gap));
  height: 2px;
  background: #B06C03;
  opacity: .3;
  z-index: 0;
}

/* item cuối không có line */
.timeline-item:last-child::after {
  display: none;
}

/* card bên dưới */
.timeline-card {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* tên */
.timeline-name {
  font-size: 12px;
  color: #B06C03;
  margin-top: 5px;
}

/* collected state */
.timeline-item.collected .timeline-dot {
  background: #B06C03;
}

.timeline-item.collected .timeline-icon {
  filter: none;
  opacity: 1;
  transform: scale(1.1);
}

/* .tour-map-timeline.no-line::before {
  display: none;
} */
</style>