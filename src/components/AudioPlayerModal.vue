<template>
  <Modal :is-title="false" width="360px" class-form="overflow-hidden p-0 font-rowdies" :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)">
    <div class="ap-wrap">
      <!-- Close button -->
      <button class="ap-close" @click="$emit('update:modelValue', false)">✕</button>

      <!-- Art zone -->
      <div class="ap-art-zone">
        <div class="ap-bg-art" :style="audio?.background ? `background-image: url(${audio.background})` : ''"></div>
        <!-- <div class="ap-bg-bars">
          <div v-for="i in 12" :key="i" class="ap-bar"
            :style="{ height: barHeights[i - 1] + '%', animationPlayState: isPlaying ? 'running' : 'paused' }">
          </div>
        </div> -->
        <div class="ap-cover-wrap" :class="{ playing: isPlaying }">
          <div class="ap-vinyl">
            <img v-if="audio?.icon" :src="audio.icon" class="ap-label-img" />
            <div v-else class="ap-label">{{ audio?.title?.slice(0, 2)?.toUpperCase() }}</div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="ap-body">
        <div class="ap-meta">
          <p class="ap-title">{{ audio?.title }}</p>
          <!-- <p class="ap-artist">{{ audio?.artist ?? 'Unknown Artist' }}</p> -->
        </div>

        <!-- Waveform -->
        <div class="ap-waveform">
          <div v-for="(h, i) in waveHeights" :key="i" class="ap-wv"
            :class="{ played: i < Math.round(waveHeights.length * progress / 100) }" :style="{ height: h + 'px' }">
          </div>
        </div>

        <!-- Progress -->
        <div class="ap-progress-wrap">
          <div class="ap-track" ref="progressBar" @click="seekTo">
            <div class="ap-fill" :style="{ width: progress + '%' }"></div>
            <div class="ap-knob" :style="{ left: progress + '%' }" @mousedown="startDrag"></div>
          </div>
          <div class="ap-times">
            <span>{{ currentTime }}</span>
            <span>{{ duration }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="ap-controls">
          <button class="ap-btn-skip" @click="seek(-10)">-10s</button>
          <button class="ap-btn-play" @click="togglePlay">
            <Play v-if="!isPlaying" :size="22" color="#fff" />
            <Pause v-else :size="22" color="#fff" />
          </button>
          <button class="ap-btn-skip" @click="seek(10)">+10s</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from "vue"
import Modal from "./Modal.vue"
import { Play, Pause } from "lucide-vue-next"

const props = defineProps({ modelValue: Boolean, audio: Object })
const emit = defineEmits(["update:modelValue"])

let player = null
const progress = ref(0)
const isPlaying = ref(false)
const currentTime = ref("0:00")
const duration = ref("0:00")
const progressBar = ref(null)
const isDragging = ref(false)

// Pre-generate random heights once
const barHeights = Array.from({ length: 12 }, () => 30 + Math.round(Math.random() * 60))
const waveHeights = Array.from({ length: 48 }, (_, i) =>
  Math.round(20 + Math.sin(i * 0.4) * 10 + Math.random() * 20)
)

function format(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function togglePlay() {
  if (!player) return
  isPlaying.value ? player.pause() : player.play()
  isPlaying.value = !isPlaying.value
}

function seek(sec) {
  if (!player) return
  player.currentTime = Math.max(0, player.currentTime + sec)
}

function seekTo(e) {
  if (!player || !progressBar.value) return
  const rect = progressBar.value.getBoundingClientRect()
  player.currentTime = ((e.clientX - rect.left) / rect.width) * player.duration
}

function startDrag() {
  isDragging.value = true
  window.addEventListener("mousemove", onDrag)
  window.addEventListener("mouseup", stopDrag)
}

function stopDrag() {
  isDragging.value = false
  window.removeEventListener("mousemove", onDrag)
  window.removeEventListener("mouseup", stopDrag)
}

function onDrag(e) {
  if (!player || !progressBar.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  progress.value = percent * 100
  player.currentTime = percent * player.duration
}

watch(() => props.audio, (val) => {
  if (!val) return
  if (player) { player.pause(); isPlaying.value = false }

  player = new Audio(val.url)
  player.ontimeupdate = () => {
    if (isDragging.value) return
    progress.value = (player.currentTime / player.duration) * 100
    currentTime.value = format(player.currentTime)
  }
  player.onloadedmetadata = () => { duration.value = format(player.duration) }
  player.onended = () => {
    isPlaying.value = false
    progress.value = 0
    player.currentTime = 0
    currentTime.value = "0:00"
  }
})

watch(() => props.modelValue, (val) => {
  if (!val && player) { player.pause(); isPlaying.value = false }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@300;400&display=swap');

.ap-wrap {
  width: 100%;
  background: #111;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.ap-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #aaa;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
}

.ap-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.ap-art-zone {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #000;
}

.ap-bg-art {
  position: absolute;
  inset: -20px;
  background: linear-gradient(135deg, #1e3a5f, #0d1b2a, #2d1b4e);
  background-size: cover;
  background-position: center;
  filter: blur(8px) brightness(0.5);
}

.ap-bg-bars {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  padding: 0 24px;
  opacity: 0.2;
}

.ap-bar {
  width: 4px;
  background: #7eb8f7;
  border-radius: 2px 2px 0 0;
  animation: barPulse 1.4s ease-in-out infinite;
}

@keyframes barPulse {

  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(1.5);
  }
}

.ap-cover-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: spin 8s linear infinite paused;
}

.ap-cover-wrap.playing {
  animation-play-state: running;
}

@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.ap-vinyl {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: conic-gradient(from 0deg,
      #1a1a1a 0%, #2a2a2a 10%, #111 20%, #2a2a2a 30%,
      #111 40%, #2a2a2a 50%, #111 60%, #2a2a2a 70%,
      #111 80%, #2a2a2a 90%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.6);
}

.ap-label-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.ap-label {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  letter-spacing: .08em;
}

.ap-body {
  padding: 20px 22px 22px;
  background: #111;
}

.ap-meta {
  margin-bottom: 14px;
}

.ap-title {
  font-size: 20px;
  color: #f0f0f0;
  margin: 0 0 4px;
  line-height: 1.2;
}

.ap-artist {
  font-size: 11px;
  color: #555;
  letter-spacing: .1em;
  text-transform: uppercase;
  margin: 0;
}

.ap-waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  margin-bottom: 14px;
}

.ap-wv {
  flex: 1;
  background: #222;
  border-radius: 1px;
  transition: background .1s;
  min-height: 4px;
}

.ap-wv.played {
  background: #2563eb;
}

.ap-track {
  height: 2px;
  background: #222;
  border-radius: 1px;
  position: relative;
  cursor: pointer;
  margin-bottom: 8px;
}

.ap-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  border-radius: 1px;
  transition: width .1s linear;
}

.ap-knob {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);
  transition: left .1s linear;
}

.ap-times {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #555;
}

.ap-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.ap-btn-skip {
  font-size: 10px;
  background: none;
  border: 1px solid #222;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  color: #777;
  transition: all .15s;
}

.ap-btn-skip:hover {
  border-color: #444;
  color: #ccc;
}

.ap-btn-play {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform .15s;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);
}

.ap-btn-play:hover {
  transform: scale(1.06);
}

.ap-btn-play:active {
  transform: scale(0.97);
}
</style>