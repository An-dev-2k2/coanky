<template>
  <div>
    <div class="bg-[#FFF7E0] flex items-center justify-center flex-col relative h-screen">
      <img src="/images/background.png" alt="map" class=" absolute top-0 left-0 w-full h-screen">
      <div class="z-100 3xl:w-[1500px] w-[1200px] left-[246px] absolute 3xl:top-[450px] top-[400px] -translate-y-1/2">
        <img src="/images/line-dashes.png" class="" alt="line">
      </div>
      <img src="/images/mountain1.png" class=" absolute left-20 bottom-20 z-10 3xl:w-[816px] w-[600px] opacity-30"
        alt="mountain1">
      <img src="/images/mountain2.png" class=" absolute right-20 bottom-20 z-10 3xl:w-[1000px] w-[750px] opacity-30"
        alt="mountain2">
      <img src="/images/mountain-line1.png" class=" absolute left-32 top-40 z-10 3xl:w-[216px] w-[180px] opacity-30"
        alt="mountain-line1">
      <img src="/images/mountain-line4.png"
        class=" absolute left-[213px] 3xl:bottom-[290px] bottom-[250px] z-10 w-[120px] opacity-30" alt="mountain-line1">
      <img src="/images/mountain-line3.png"
        class=" absolute 3xl:left-[590px] left-[500px] 3xl:top-[500px] top-[400px] z-10 w-[150px] opacity-30"
        alt="mountain-line1">
      <img src="/images/mountain-line2.png"
        class=" absolute 3xl:left-[917px] left-[750px] 3xl:top-[138px] top-[100px] z-10 3xl:w-[232px] w-[180px] opacity-30"
        alt="mountain-line1">
      <img src="/images/mountain-line4.png"
        class=" absolute 3xl:left-[1200px] left-[1000px] 3xl:top-[540px] top-[400px] z-10 3xl:w-[120px] w-[90px] opacity-30"
        alt="mountain-line1">
      <img src="/images/mountain-line1.png"
        class=" absolute 3xl:left-[1565px] left-[1200px] 3xl:top-[258px] top-[200px] z-10 3xl:w-[216px] w-[180px] opacity-30"
        alt="mountain-line1">
      <img src="/images/icon.png" :class="isStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
        class="map-icon transition-all duration-500 absolute 3xl:left-[250px] left-[240px] 3xl:top-[390px] top-[370px] z-10 3xl:w-[120px] w-[90px] opacity-30"
        alt="icon">
      <img src="/images/icon.png" :class="isStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
        class="map-icon transition-all duration-500 absolute left-[497px] top-[130px] z-10 3xl:w-[120px] w-[90px] opacity-30"
        alt="icon">
      <img src="/images/icon.png" :class="isStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
        class="map-icon transition-all duration-500 absolute 3xl:left-[900px] left-[800px] top-[246px] z-10 3xl:w-[120px] w-[90px] opacity-30"
        alt="icon">
      <img src="/images/icon.png" :class="isStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
        class="map-icon transition-all duration-500 absolute 3xl:left-[1345px] left-[1100px] 3xl:top-[128px] top-[170px] z-10 3xl:w-[120px] w-[90px] opacity-30"
        alt="icon">
      <img src="/images/icon.png" :class="isStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
        class="map-icon transition-all duration-500 absolute 3xl:left-[1540px] left-[1250px] 3xl:top-[450px] top-[400px] z-10 3xl:w-[120px] w-[90px] opacity-30"
        alt="icon">
      <div :class="isStarted ? 'z-[200]' : 'z-0'"
        class="3xl:bottom-[250px] bottom-[200px] absolute flex items-center gap-10">
        <router-link to="/tours" class="hover:brightness-110 transition-all duration-700"
          :class="isStarted ? 'translate-x-0 opacity-100 visible' : '-translate-x-40 opacity-0 invisible'">
          <img src="/images/lotrinh.png" class="3xl:w-[250px] w-[180px]" />
        </router-link>

        <router-link to="/icons" class="hover:brightness-110 transition-all duration-700"
          :class="isStarted ? 'translate-x-0 opacity-100' : 'translate-x-40 opacity-0 invisible'">
          <img src="/images/sotay.png" class="3xl:w-[250px] w-[180px]" />
        </router-link>
      </div>
    </div>
    <div :class="!isStarted ? 'bg-[#FFF7E0]/70' : 'bg-transparent'" class=" fixed w-full top-0 left-0 h-screen z-[100]">
      <div class="flex justify-center items-center flex-col h-full">
        <img src="/images/logo.png" ref="logoRef" alt="logo" class="w-[650px]">
        <img src="/images/start-app.png" ref="startBtnRef" @click="startApp" alt="start app"
          class="w-[120px] cursor-pointer">
        <div ref="actionBtnsRef" class="flex justify-center items-center gap-5 mt-10">
          <router-link to="/login"
            class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
            <img src="/images/btn.png" class="w-full absolute" alt="">
            <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Nhập</span>
          </router-link>
          <router-link to="/register"
            class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
            <img src="/images/btn.png" class="w-full absolute" alt="">
            <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Ký</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick } from 'vue'

const showHeader = inject('showHeader')

const logoRef = ref(null)
const startBtnRef = ref(null)
const actionBtnsRef = ref(null)
const isStarted = ref(false)

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
  startBtnRef.value.style.transition = 'opacity 0.5s'
  startBtnRef.value.style.opacity = 0
  startBtnRef.value.style.visibility = 'hidden'

  // Login / register bay ra
  actionBtnsRef.value.style.transition = 'all 0.6s ease'
  actionBtnsRef.value.style.transform = 'translateY(50px)'
  actionBtnsRef.value.style.opacity = 0

  await new Promise(r => setTimeout(r, 800))

  showHeader.value = true
}
</script>

<style></style>