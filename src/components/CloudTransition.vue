<template>
  <div v-show="visible" class="cloud-wrapper">
    <img src="/images/cloud.png" class="cloud left scale-200" :class="phase" />
    <img src="/images/cloud.png" class="cloud right scale-200" :class="phase" />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const visible = ref(false)
const phase = ref('')

const wait = (ms) => new Promise(r => setTimeout(r, ms))

const enter = async () => {
  visible.value = true
  phase.value = ''   // trạng thái ban đầu (ở ngoài màn hình)

  await nextTick()   // chờ DOM render
  await wait(20)     // chờ 1 frame

  phase.value = 'enter' // bắt đầu bay vào
  await wait(700)
}

const leave = async () => {
  phase.value = 'leave'
  await wait(700)
  visible.value = false
}

defineExpose({ enter, leave })
</script>

<style scoped>
.cloud-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  pointer-events: none;
}

/* cloud chung */
.cloud {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100%;
  object-fit: cover;
  transition: transform 0.7s ease-in-out;
}

/* mặc định: nằm ngoài màn hình */
.left {
  left: 0;
  transform: translateX(-100%);
}

.right {
  right: 0;
  transform: translateX(100%) scaleX(-1);
}

/* bay vào */
.enter.left {
  transform: translateX(0%);
}

.enter.right {
  transform: translateX(0%) scaleX(-1);
}

/* bay ra */
.leave.left {
  transform: translateX(-100%);
}

.leave.right {
  transform: translateX(100%) scaleX(-1);
}
</style>