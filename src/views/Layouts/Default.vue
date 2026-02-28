<template>
  <div>
    <Header v-if="showHeader" />
    <div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showHeader = computed(() => !route.meta.hideHeader)
provide('showHeader', showHeader)
</script>

<style></style>