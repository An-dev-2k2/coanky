<template>
  <header class="header-root">
    <!-- Decorative top border line -->
    <div class="header-line"></div>

    <div class="header-inner">
      <!-- LEFT: Logo -->
      <router-link to="/" class="logo-link">
        <img src="/images/logo.png" alt="logo" class="logo-img" />
      </router-link>

      <!-- RIGHT: User info + Back button -->
      <div class="header-right">
        <!-- Back button -->
        <button v-show="isBackButton" class="back-btn" @click="$router.back()">
          <img src="/images/back.png" alt="btn-back" class="back-img" />
        </button>

        <!-- User block (chỉ hiện khi đã login) -->
        <div v-if="userData" class="user-block" @mouseenter="menuOpen = true" @mouseleave="menuOpen = false">
          <!-- Trigger: avatar + username + price -->
          <div class="user-trigger" :class="{ active: menuOpen }">
            <!-- Price chip -->
            <div class="price-chip">
              <span class="price-coin">🪙</span>
              <span class="price-val">{{ formatPrice(userData.price) }}</span>
            </div>

            <!-- Divider dot -->
            <span class="trigger-sep">⬥</span>

            <!-- Username -->
            <span class="trigger-username">{{ userData.username }}</span>

            <!-- Avatar -->
            <div class="avatar-ring">
              <img
                :src="userData.avatar || `https://ui-avatars.com/api/?background=8b4513&color=f5e6c8&name=${userData.username}&bold=true`"
                :alt="userData.username" class="avatar-img" />
              <!-- Online dot -->
              <span class="avatar-dot"></span>
            </div>

            <!-- Chevron -->
            <svg class="chevron" :class="{ flipped: menuOpen }" xmlns="http://www.w3.org/2000/svg" width="12"
              height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          <!-- Dropdown Menu -->
          <transition name="menu-drop">
            <div v-if="menuOpen" class="user-menu">
              <!-- Header of menu -->
              <div class="menu-head">
                <img
                  :src="userData.avatar || `https://ui-avatars.com/api/?background=8b4513&color=f5e6c8&name=${userData.username}&bold=true`"
                  class="menu-avatar" />
                <div>
                  <p class="menu-uname">{{ userData.username }}</p>
                  <p class="menu-email">{{ userData.email }}</p>
                </div>
              </div>

              <div class="menu-divider"></div>

              <!-- Menu items -->
              <nav class="menu-nav">
                <router-link to="/profile" class="menu-item" @click="menuOpen = false">
                  <span class="menu-item-icon">👤</span>
                  <span>Hồ Sơ</span>
                </router-link>

                <router-link to="/tours" class="menu-item" @click="menuOpen = false">
                  <span class="menu-item-icon">🗺</span>
                  <span>Tour</span>
                </router-link>

                <router-link to="/icons" class="menu-item" @click="menuOpen = false">
                  <span class="menu-item-icon">🔴</span>
                  <span>Ấn Ký</span>
                </router-link>
              </nav>

              <div class="menu-divider"></div>

              <!-- Logout -->
              <button class="menu-logout" @click="handleLogout">
                <span class="menu-item-icon">⛩</span>
                <span>Đăng Xuất</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- Not logged in -->
        <div v-else class="guest-actions">
          <router-link to="/login" class="guest-btn">Đăng nhập</router-link>
        </div>
      </div>
    </div>

    <!-- Decorative bottom border -->
    <div class="header-line bottom"></div>
  </header>
</template>

<script setup>
import { onMounted, computed, ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import AuthAPI from '@/services/api/client/AuthAPI'
import { useToast } from 'vue-toastification'
import { EventBus } from '@/eventBus'

const route = useRoute()
const router = useRouter()
const store = useStore()
const toast = useToast()

const menuOpen = ref(false)

// Lấy user từ store
const userData = computed(() => store.state.user?.me || null)

const isBackButton = computed(() =>
  !['login', 'register', 'home'].includes(route.name)
)

const getMe = async () => {
  try {
    const { data } = await AuthAPI.me()
    store.commit('user/setMe', data)
  } catch (error) {
    console.error('Error fetching current user:', error)
  }
}

const handleLogout = async () => {
  menuOpen.value = false
  try {
    await AuthAPI.logout()
    sessionStorage.removeItem('token')
    store.commit('user/setMe', null)
    userData.value = null
    toast.success('Đã đăng xuất')
    router.push('/login')
  } catch (err) {
    console.error(err)
  }
}

function formatPrice(val) {
  if (!val && val !== 0) return '0 ₫'
  return Number(val).toLocaleString('vi-VN') + ' ₫'
}

onMounted(() => {
  if (sessionStorage.getItem('token')) {
    getMe()
  }
  EventBus.on('logout', () => {
    userData.value = null
  })
})

onBeforeUnmount(() => {
  EventBus.off('logout')
})
</script>

<style scoped>
/* ── ROOT ── */
.header-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background: linear-gradient(to bottom,
      rgba(20, 10, 4, 0.97) 0%,
      rgba(26, 14, 6, 0.95) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-line {
  height: 1px;
  background: linear-gradient(to right,
      transparent 0%,
      rgba(180, 120, 40, 0.6) 20%,
      rgba(220, 160, 60, 0.9) 50%,
      rgba(180, 120, 40, 0.6) 80%,
      transparent 100%);
}

.header-line.bottom {
  background: linear-gradient(to right,
      transparent 0%,
      rgba(150, 80, 20, 0.4) 30%,
      rgba(180, 100, 30, 0.6) 50%,
      rgba(150, 80, 20, 0.4) 70%,
      transparent 100%);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 40px;
}

/* ── LOGO ── */
.logo-link {
  display: flex;
  align-items: center;
}

.logo-img {
  width: 120px;
}

/* ── RIGHT ── */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ── BACK BUTTON ── */
.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  opacity: 0.85;
  transition: opacity 0.2s, transform 0.2s;
}

.back-btn:hover {
  opacity: 1;
  transform: translateX(-2px);
}

.back-img {
  width: 36px;
}

/* ── USER BLOCK ── */
.user-block {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 12px;
  border-radius: 40px;
  border: 1px solid rgba(180, 120, 40, 0.25);
  background: rgba(180, 120, 40, 0.06);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  user-select: none;
}

.user-trigger:hover,
.user-trigger.active {
  border-color: rgba(220, 160, 60, 0.5);
  background: rgba(180, 120, 40, 0.12);
}

.price-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(192, 57, 43, 0.15);
  border: 1px solid rgba(192, 57, 43, 0.3);
  border-radius: 20px;
  padding: 2px 8px;
}

.price-coin {
  font-size: 12px;
}

.price-val {
  font-size: 12px;
  font-weight: 700;
  color: #e8c87a;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.trigger-sep {
  font-size: 8px;
  color: rgba(180, 120, 40, 0.4);
}

.trigger-username {
  font-size: 13px;
  font-weight: 600;
  color: #e8d5a8;
  letter-spacing: 0.04em;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-ring {
  position: relative;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(220, 160, 60, 0.6);
  filter: sepia(10%);
}

.avatar-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  border: 1.5px solid #1a0e06;
}

.chevron {
  color: rgba(220, 160, 60, 0.6);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.chevron.flipped {
  transform: rotate(180deg);
}

/* ── DROPDOWN MENU ── */
.user-menu {
  position: absolute;
  top: calc(100%);
  right: 0;
  width: 240px;
  background: linear-gradient(160deg, #26160a 0%, #1e0f06 100%);
  border: 1px solid rgba(180, 120, 40, 0.35);
  border-radius: 6px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(100, 60, 10, 0.2),
    inset 0 1px 0 rgba(220, 160, 60, 0.1);
  overflow: hidden;
  transform-origin: top right;
}

/* Arrow tip */
.user-menu::before {
  content: '';
  position: absolute;
  top: -5px;
  right: 20px;
  width: 10px;
  height: 10px;
  background: #26160a;
  border-left: 1px solid rgba(180, 120, 40, 0.35);
  border-top: 1px solid rgba(180, 120, 40, 0.35);
  transform: rotate(45deg);
}

/* Menu head */
.menu-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(180, 120, 40, 0.06);
}

.menu-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(220, 160, 60, 0.5);
  flex-shrink: 0;
  filter: sepia(10%);
}

.menu-uname {
  font-size: 13px;
  font-weight: 700;
  color: #e8d5a8;
  margin: 0 0 2px;
  letter-spacing: 0.03em;
}

.menu-email {
  font-size: 11px;
  color: rgba(180, 140, 80, 0.7);
  margin: 0;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

/* Divider */
.menu-divider {
  height: 1px;
  background: linear-gradient(to right,
      transparent,
      rgba(180, 120, 40, 0.3),
      transparent);
  margin: 0 12px;
}

/* Nav items */
.menu-nav {
  padding: 6px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  color: #c8a96e;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-decoration: none;
  transition: background 0.15s, color 0.15s, padding-left 0.15s;
  position: relative;
  cursor: pointer;
}

.menu-item:hover {
  background: rgba(180, 120, 40, 0.1);
  color: #e8d5a8;
  padding-left: 20px;
}

.menu-item-icon {
  font-size: 15px;
  flex-shrink: 0;
}


/* Logout */
.menu-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  color: rgba(192, 100, 80, 0.8);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
}

.menu-logout:hover {
  background: rgba(192, 57, 43, 0.1);
  color: #e57373;
}

/* ── GUEST ── */
.guest-actions {
  display: flex;
  align-items: center;
}

.guest-btn {
  font-size: 13px;
  font-weight: 600;
  color: #c8a96e;
  text-decoration: none;
  padding: 6px 16px;
  border: 1px solid rgba(180, 120, 40, 0.35);
  border-radius: 3px;
  transition: background 0.2s, color 0.2s;
  letter-spacing: 0.05em;
}

.guest-btn:hover {
  background: rgba(180, 120, 40, 0.15);
  color: #e8d5a8;
}

/* ── TRANSITION ── */
.menu-drop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.menu-drop-enter-from {
  opacity: 0;
  transform: scale(0.94) translateY(-6px);
}

.menu-drop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}

/* ── RESPONSIVE ── */
@media (max-width: 640px) {
  .header-inner {
    padding: 8px 16px;
  }

  .trigger-username {
    display: none;
  }

  .trigger-sep {
    display: none;
  }

  .price-chip {
    display: none;
  }

  .user-trigger {
    padding: 4px;
    border: none;
    background: none;
  }

  .avatar-ring {
    width: 36px;
    height: 36px;
  }

  .avatar-img {
    width: 36px;
    height: 36px;
  }

  .user-menu {
    right: -8px;
    width: 220px;
  }
}
</style>