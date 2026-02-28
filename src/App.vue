<template>
  <div class="bg-[var(--color-text)]">
    <CloudTransition ref="cloudRef" />
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CloudTransition from '@/components/CloudTransition.vue'

const router = useRouter()
const cloudRef = ref(null)

onMounted(() => {
  router.beforeEach(async (to, from, next) => {
    if (cloudRef.value) {
      await cloudRef.value.enter() // mây bay vào
      next()                       // đổi route khi che kín
      await cloudRef.value.leave() // bay ra
    } else {
      next()
    }
  })
})
</script>