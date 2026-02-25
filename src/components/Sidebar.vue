<template>
  <aside :class="[
    'bg-white h-screen fixed top-0 left-0 transition-all duration-300 sidebar-admin',
    collapsed ? 'w-16' : 'w-64'
  ]">
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div
        :class="['px-4 py-4 border-b border-gray-200 flex items-center', collapsed ? 'justify-center' : 'justify-between']">
        <div v-if="!collapsed">
          <h2 class="text-xl font-bold text-blue-600">
            🌍 Cổ Ấn Ký
          </h2>
          <!-- <p class="text-xs text-gray-400 mt-1">Travel Management</p> -->
        </div>

        <!-- Toggle button -->
        <button @click="emit('update:collapsed', !collapsed)"
          class="p-2 rounded-lg bg-gray-200 hover:bg-blue-100 hover:text-blue-900 transition cursor-pointer">
          <ChevronLeft v-if="!collapsed" class="w-5 h-5" />
          <ChevronRight v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 px-2 py-4 space-y-2">

        <router-link v-for="menu in menus" :key="menu.id" :to="menu.to" :class="[
          'py-3 rounded-lg font-semibold text-gray-600 hover:bg-blue-100 hover:text-blue-900 transition flex items-center',
          collapsed ? 'justify-center px-2' : 'gap-3 px-4'
        ]" active-class="bg-blue-100 !text-blue-900">
          <component :is="menu.icon" class="w-5 h-5" />

          <!-- Ẩn text khi collapsed -->
          <span v-if="!collapsed">
            {{ menu.name }}
          </span>
        </router-link>

      </nav>

      <!-- Logout -->
      <div class="py-4 px-2 border-t border-gray-200">
        <button @click="logout" :disabled="isLoading"
          :class="isLoading ? ' cursor-no-drop opacity-40' : ' cursor-pointer hover:opacity-90'"
          class="w-full bg-blue-500 text-white py-2.5 rounded-xl transition">
          <tempalte v-if="isLoading">
            <Loader v-if="isLoading" class="animate-spin w-5 mx-auto" />
          </tempalte>
          <template v-else>
            <span v-if="!collapsed">Đăng xuất</span>
            <LogOut v-else class="w-5 h-5 mx-auto" />
          </template>
        </button>
      </div>
    </div>


  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { LayoutDashboard, Loader, ChevronLeft, ChevronRight, LogOut, TicketsPlane, MapPinned, User, Handbag, Users, Settings, Landmark, BoomBox } from 'lucide-vue-next'
import AuthAPI from '@/services/api/admin/AuthAPI'

const props = defineProps({
  collapsed: Boolean
})
const isLoading = ref(false)
const emit = defineEmits(['update:collapsed'])
const menus = [
  { id: 1, name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { id: 2, name: 'Tour', to: '/admin/tours', icon: TicketsPlane },
  { id: 3, name: 'Ấn ký', to: '/admin/icons', icon: MapPinned },
  { id: 4, name: 'Audio', to: '/admin/audios', icon: BoomBox },
  { id: 5, name: 'Đơn hàng', to: '/admin/orders', icon: Handbag },
  { id: 6, name: 'Người dùng', to: '/admin/users', icon: Users },
  { id: 7, name: 'Lịch sử giao dịch', to: '/admin/transactions', icon: Landmark },
  { id: 8, name: 'Cài đặt', to: '/admin/settings', icon: Settings },
]

const logout = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await AuthAPI.logout()
    sessionStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }
  catch (error) {
    console.error('Logout failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.sidebar-admin::-webkit-scrollbar {
  width: 8px;
}

.sidebar-admin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.sidebar-admin::-webkit-scrollbar-thumb {
  background: rgb(181, 181, 181);
  border-radius: 10px;
}

.sidebar-admin::-webkit-scrollbar-thumb:hover {
  background: #949494;
}
</style>