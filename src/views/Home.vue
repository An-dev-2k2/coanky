<template>
  <div class="font-rowdies">
    <div class="bg-[#FFF7E0] flex items-center justify-center overflow-hidden flex-col relative h-screen">
      <img src="/images/background.png" alt="map" class=" absolute top-0 left-0 w-full h-screen">
      <div
        class="z-100 w-full xl:pr-20 xl:pl-[250px] lg:pr-20 lg:pl-[200px] pr-5 pl-10 absolute 3xl:top-[450px] top-[400px] -translate-y-1/2">
        <img src="/images/line-dashes.png" class="w-full" alt="line">
      </div>
      <img src="/images/mountain1.png"
        class="absolute 3xl:left-20 xl:left-20 lg:left-20 left-3 bottom-20 z-10 3xl:w-[816px] xl:w-[600px] lg:w-[600px] w-[200px] opacity-30"
        alt="mountain1">
      <img src="/images/mountain2.png"
        class=" absolute 3xl:right-20 lg:right-10 right-3 bottom-20 z-10 3xl:w-[1000px] xl:w-[750px] lg:w-[750px] w-[250px] opacity-30"
        alt="mountain2">
      <img data-aos="zoom-in-up" data-aos-delay="500" data-aos-duration="500" src="/images/mountain-line1.png"
        class=" absolute xl:left-32 left-6 top-40 z-10 3xl:w-[216px] xl:w-[180px] w-[60px] opacity-30"
        alt="mountain-line1">
      <img data-aos="zoom-in-up" data-aos-delay="500" data-aos-duration="500" src="/images/mountain-line4.png"
        class=" absolute xl:left-[213px] left-7 3xl:bottom-[290px] bottom-[250px] z-10 3xl:w-[120px] w-[80px] opacity-30"
        alt="mountain-line1">
      <img data-aos="zoom-in-up" data-aos-delay="500" data-aos-duration="500" src="/images/mountain-line3.png"
        class=" absolute 3xl:left-[590px] xl:left-[500px] left-32 3xl:top-[500px] top-[400px] z-10 xl:w-[150px] w-[70px] opacity-30"
        alt="mountain-line1">
      <img data-aos="zoom-in-up" data-aos-delay="500" data-aos-duration="500" src="/images/mountain-line2.png"
        class=" absolute 3xl:left-[917px] xl:left-[750px] left-[170px] 3xl:top-[138px] top-[100px] z-10 3xl:w-[232px] xl:w-[180px] w-[60px] opacity-30"
        alt="mountain-line1">
      <img data-aos="zoom-in-up" data-aos-delay="500" data-aos-duration="500" src="/images/mountain-line4.png"
        class=" absolute 3xl:left-[1200px] xl:left-[1000px] left-[250px] 3xl:top-[540px] top-[400px] z-10 3xl:w-[120px] xl:w-[90px] w-[40px] opacity-30"
        alt="mountain-line1">
      <img data-aos="zoom-in-up" data-aos-delay="500" data-aos-duration="500" src="/images/mountain-line1.png"
        class=" absolute 3xl:left-[1565px] xl:left-[1200px] left-[280px] 3xl:top-[258px] top-[200px] z-10 3xl:w-[216px] xl:w-[180px] w-[60px] opacity-30"
        alt="mountain-line1">
      <img src="/images/icon1.png" data-aos="zoom-in" data-aos-delay="500" data-aos-duration="700"
        class="map-icon transition-all duration-500 absolute 3xl:left-[250px] xl:left-[240px] lg:left-[200px] xs:left-[30px] xss:left-[25px] 3xl:top-[390px] lg:top-[340px] top-[370px] z-10 3xl:w-[120px] lg:w-[90px] w-[40px] opacity-30"
        alt="icon">
      <img src="/images/icon2.png" data-aos="zoom-in" data-aos-delay="700" data-aos-duration="700"
        class="map-icon transition-all duration-500 absolute xl:left-[520px] lg:left-[420px] xs:left-[130px] xss:left-[120px] 3xl:top-[160px] xl:top-[160px] lg:top-[180px] xs:top-[300px] xss:top-[310px] z-10 3xl:w-[120px] lg:w-[90px] w-[40px] opacity-30"
        alt="icon">
      <img src="/images/icon3.png" data-aos="zoom-in" data-aos-delay="900" data-aos-duration="700"
        class="map-icon transition-all duration-500 absolute 3xl:left-[900px] xl:left-[800px] lg:left-[620px] xs:left-[200px] xss:left-[180px] 3xl:top-[246px] xl:top-[246px] lg:top-[250px] top-[340px] z-10 3xl:w-[120px] lg:w-[90px] w-[40px] opacity-30"
        alt="icon">
      <img src="/images/icon4.png" data-aos="zoom-in" data-aos-delay="1100" data-aos-duration="700"
        class="map-icon transition-all duration-500 absolute 3xl:left-[1345px] xl:left-[1100px] lg:left-[850px] xs:left-[290px] xss:left-[270px] 3xl:top-[128px] xl:top-[130px] lg:top-[150px] top-[290px] z-10 3xl:w-[120px] lg:w-[90px] w-[35px] opacity-30"
        alt="icon">
      <img src="/images/icon5.png" data-aos="zoom-in" data-aos-delay="1300" data-aos-duration="700"
        class="map-icon transition-all duration-500 absolute 3xl:left-[1540px] xl:left-[1250px] lg:left-[1000px] xs:left-[340px] xss:left-[320px] 3xl:top-[450px] top-[400px] z-10 3xl:w-[120px] lg:w-[90px] w-[40px] opacity-30"
        alt="icon">
      <!-- <img src="/images/icon5.png" data-aos="zoom-in" data-aos-delay="1300" data-aos-duration="700"
        :class="isStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
        class="map-icon transition-all duration-500 absolute 3xl:left-[1540px] xl:left-[1250px] left-[300px] 3xl:top-[450px] top-[400px] z-10 3xl:w-[120px] xl:w-[90px] w-[50px] opacity-30"
        alt="icon"> -->
      <div :class="isStarted ? 'z-[200]' : 'z-0'"
        class="3xl:bottom-[250px] bottom-[200px] absolute w-full flex items-center justify-center gap-10">
        <router-link to="/tours" class="hover:brightness-110 transition-all duration-700"
          :class="isStarted ? 'translate-x-0 opacity-100 visible' : '-translate-x-40 opacity-0 invisible'">
          <img src="/images/lotrinh.png" class="3xl:w-[250px] xl:w-[180px] w-[100px]" />
        </router-link>

        <router-link to="/icons" class="hover:brightness-110 transition-all duration-700"
          :class="isStarted ? 'translate-x-0 opacity-100' : 'translate-x-40 opacity-0 invisible'">
          <img src="/images/sotay.png" class="3xl:w-[250px] xl:w-[180px] w-[100px]" />
        </router-link>
      </div>
    </div>
    <div :class="!isStarted ? 'bg-[#FFF7E0]/70' : 'bg-transparent'" class=" fixed w-full top-0 left-0 h-screen z-[100]">
      <div class="flex justify-center items-center flex-col h-full">
        <img data-aos="zoom-in" data-aos-delay="500" data-aos-duration="500" src="/images/logo.png" ref="logoRef"
          alt="logo" class="3xl:w-[650px] xl:w-[500px] w-[270px]">
        <div data-aos="flip-left" data-aos-delay="1000" data-aos-duration="1000" ref="startBtnRef"
          class=" relative cursor-pointer flex justify-center items-center group xl:-translate-y-10 hover:-translate-y-12 transition-all duration-300"
          @click="startApp">
          <img src="/images/start-app.png" alt="start app" class="3xl:w-[120px] xl:w-[120px] w-[90px]">
          <p
            class="absolute top-0 left-0 text-[#980000] group-hover:text-[#FF4D00] transition-all duration-300 xl:text-2xl text-base xl:pt-20 pt-16 px-5 text-center">
            Bắt đầu
            hành
            trình
          </p>
        </div>
        <div v-if="!token" ref="actionBtnsRef" class="flex justify-center items-center gap-5 xl:mt-5 mt-10">
          <router-link data-aos="fade-right" data-aos-delay="1500" data-aos-duration="700" to="/login"
            class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
            <img src="/images/btn.png" class="w-full absolute" alt="">
            <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Nhập</span>
          </router-link>
          <router-link data-aos="fade-left" data-aos-delay="1500" data-aos-duration="700" to="/register"
            class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
            <img src="/images/btn.png" class="w-full absolute" alt="">
            <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Ký</span>
          </router-link>
        </div>
        <div v-else ref="actionBtnsRef" data-aos="fade-up" data-aos-delay="1500" data-aos-duration="700"
          class="flex justify-center items-center gap-5 mt-10">
          <button @click="logout"
            class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
            <img src="/images/btn.png" class="w-full absolute" alt="">
            <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Xuất</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import AuthAPI from '@/services/api/client/AuthAPI'
import AOS from 'aos'

const toast = useToast()
const store = useStore()
const router = useRouter()

const showHeader = inject('showHeader')

const logoRef = ref(null)
const startBtnRef = ref(null)
const actionBtnsRef = ref(null)
const isStarted = ref(false)
const token = ref(sessionStorage.getItem('token'))

const startApp = async () => {
  if (isStarted.value) return
  isStarted.value = true
  const logo = logoRef.value
  const rect = logo.getBoundingClientRect()

  // Vị trí logo header (giả lập)
  const targetTop = 20
  const targetLeft = 40
  const targetWidth = 128

  const scale = targetWidth / rect.width
  const translateX = targetLeft - rect.left
  const translateY = targetTop - rect.top

  logo.style.transition = 'transform 0.8s ease'
  logo.style.transformOrigin = 'top left'
  logo.style.transform = `
    translate(${translateX}px, ${translateY}px)
    scale(${scale})
  `

  // Ẩn start button
  startBtnRef.value.style.transition = 'opacity 0.2s'
  startBtnRef.value.style.opacity = 0
  startBtnRef.value.style.visibility = 'hidden'

  // Login / register bay ra
  actionBtnsRef.value.style.transition = 'all 0.6s ease'
  actionBtnsRef.value.style.transform = 'translateY(50px)'
  actionBtnsRef.value.style.opacity = 0

  await new Promise(r => setTimeout(r, 800))

  showHeader.value = true
}

const logout = async () => {
  try {
    await AuthAPI.logout()
    sessionStorage.removeItem('token')
    // router.push('/login')
    token.value = null
    store.commit('user/setMe', {})
    toast.success('Đăng xuất thành công')
    await nextTick()
    AOS.refreshHard()
  }
  catch (err) {
    console.log(err)
  }
}
</script>