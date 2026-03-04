<template>
  <header class="w-full fixed z-[90] top-0 flex items-center justify-between px-10 py-2">
    <router-link to="/">
      <img src="/images/logo.png" alt="logo" class="w-32 3xl:w-48">
    </router-link>
    <img v-show="isBackButton" src="/images/back.png" @click="$router.back()" alt="btn-back"
      class="w-10 cursor-pointer">
  </header>
</template>

<script setup>
import AuthAPI from '@/services/api/client/AuthAPI';
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const route = useRoute()
const store = useStore()
const isBackButton = computed(() => {
  return !['login', 'register'].includes(route.name)
})
const getMe = async () => {
  try {
    const { data } = await AuthAPI.me()
    store.commit('user/setMe', data)
  } catch (error) {
    console.error('Error fetching current user:', error)
  }
}

onMounted(() => {
  getMe()
})
</script>
