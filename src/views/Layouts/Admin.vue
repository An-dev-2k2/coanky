<template>
  <div class="flex min-h-screen bg-slate-100">
    <!-- Sidebar -->
    <Sidebar v-model:collapsed="isCollapsed" />

    <!-- Content -->
    <div :class="[
      'flex-1 flex flex-col transition-all duration-300',
      isCollapsed ? 'pl-16' : 'pl-64'
    ]">
      <!-- Header -->
      <header class="bg-white border-l border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-700">
          Travel Admin
        </h1>

        <div class="flex items-center gap-4">
          <div class="flex justify-end items-end flex-col">
            <b class="text-sm text-gray-600">Admin</b>
            <p class="text-xs text-gray-400">Email: <b>admin@gmail.com</b></p>
          </div>
          <div class="w-9 h-9 rounded-full border-[1.5px] border-blue-500 grid place-items-center">
            <User class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </header>

      <!-- Router View -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { User } from 'lucide-vue-next';

const isCollapsed = ref(false)
</script>