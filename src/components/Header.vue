<template>
  <header class="w-full fixed z-[100000] top-0 flex items-center justify-between px-10 py-2">
    <router-link to="/">
      <img src="/images/logo.png" alt="logo" class="w-32 3xl:w-48">
    </router-link>
  </header>
</template>

<script setup>
import AuthAPI from '@/services/api/client/AuthAPI';
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
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
