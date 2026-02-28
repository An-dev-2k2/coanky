<template>
  <div>
    <div class="bg-[#FFF7E0] flex items-center justify-center flex-col relative h-screen">
      <img src="/images/background.png" alt="map" class=" absolute top-0 left-0 w-full h-screen">
      <div class="z-100 w-[80%] right-14 absolute top-1/2 -translate-y-1/2">
        <img src="/images/line-dashes.png" class="" alt="line">
      </div>
    </div>
    <div class=" fixed w-full top-0 left-0 h-screen bg-[#FFF7E0]/70 z-100">
      <div class="flex justify-center items-center flex-col h-full">
        <img src="/images/logo.png" alt="logo" class="w-[650px]">
        <img src="/images/start-app.png" alt="start app" class="w-[120px]">
        <div class="flex justify-center items-center gap-5 mt-10">
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

<script>
export default {

}
</script>

<style></style>