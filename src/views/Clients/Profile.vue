<template>
  <div class="profile-page xl:mb-0 mb-20 font-rowdies">
    <img class="h-screen w-full fixed" src="/images/bg-tour.png" alt="">

    <div class="scroll-container xl:top-28 top-24">
      <!-- === HEADER: Avatar + Tên + Rank === -->
      <div class="scroll-header">
        <div class="seal-ring">
          <div class="avatar-wrap">
            <img :src="data?.avatar || `https://ui-avatars.com/api/?background=random&name=${data?.username}`"
              :alt="data?.username" class="avatar-img" />
            <div class="seal-stamp">
              <span>印</span>
            </div>
          </div>
        </div>

        <div class="user-headline">
          <div class="rank-badge">
            <span class="rank-icon">{{ rankMeta.icon }}</span>
            <span class="rank-label">{{ data?.rank }}</span>
          </div>
          <h1 class="username">{{ data?.username }}</h1>
          <p class="email">{{ data?.email }}</p>
        </div>
      </div>

      <!-- === DIVIDER === -->
      <div class="flex justify-center xl:my-5 my-2">
        <img src="/images/line.png" class="xl:w-[200px] w-[100px]" alt="line">
      </div>

      <!-- === STATS GRID === -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">{{ formatPrice(data?.price) }}</div>
          <div class="stat-label">Số dư</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-icon">🔴</div>
          <div class="stat-value">{{ data?.stampsCollected }}</div>
          <div class="stat-label">Ấn ký thu thập</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📜</div>
          <div class="stat-value">{{ data?.tours?.length || 0 }}</div>
          <div class="stat-label">Tour đang tham gia</div>
        </div>
      </div>
      <div class="flex justify-center xl:my-5 my-2">
        <img src="/images/line.png" class="xl:w-[200px] w-[100px]" alt="line">
      </div>

      <!-- === TOUR TABLE === -->
      <div class="section-title">
        <img src="/images/hoavan.png" class="w-6" />
        <h2>Danh Sách Tour</h2>
      </div>

      <div class="tour-table-wrap">
        <table class="tour-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên Tour</th>
              <th>Trạng thái</th>
              <th>Ngày mua</th>
              <th>Ấn ký</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tour, i) in data.tours" :key="tour.id"
              :class="{ 'row-completed': tour.status === 'completed' }">
              <td class="td-index">{{ i + 1 }}</td>
              <td class="td-name">{{ tour.name }}</td>
              <td class="td-status">
                <span class="status-badge" :class="statusClass(tour.status)">
                  {{ statusLabel(tour.status) }}
                </span>
              </td>
              <td class="td-date">{{ formatDate(tour.purchasedAt) }}</td>
              <td class="td-stamps">
                <span class="stamps-count">{{ tour.stampsCollected }}/{{ tour.totalStamps }}</span>
              </td>
            </tr>
            <tr v-if="!data?.tours?.length">
              <td colspan="5" class="td-empty">— Chưa có tour nào —</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-center xl:my-5 my-2">
        <img src="/images/line.png" class="xl:w-[200px] w-[100px]" alt="line">
      </div>

      <!-- === ACTION BUTTONS === -->
      <div class="actions">
        <a href="/change-password"
          class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
          <img src="/images/btn.png" class="w-full absolute" alt="">
          <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đổi mật khẩu</span>
        </a>
        <button @click="logout"
          class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
          <img src="/images/btn.png" class="w-full absolute" alt="">
          <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Xuất</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuthAPI from '@/services/api/client/AuthAPI'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'
import { useFormat } from '@/composables/useFormat'
import { useRouter } from 'vue-router'
import { EventBus } from '@/eventBus'

const { formatDate } = useFormat()
const store = useStore()
const router = useRouter()
const toast = useToast()
const token = ref(sessionStorage.getItem('token'))
const data = ref({
  avatar: null,
  username: '',
  email: '',
  rank: 'Người Thắp Đèn',
  price: 0,
  stampsCollected: 0,
  tours: []
})

// const props = defineProps({
//   user: {
//     type: Object,
//     default: () => ({
//       avatar: '',
//       username: 'Andev',
//       email: 'traveler@gmail.vn',
//       rank: 'Người Thắp Đèn',
//       price: 250000,
//       stampsCollected: 12,
//       tours: [
//         { id: 1, name: 'Phố Cổ Hà Nội', status: 'active', purchasedAt: '2025-01-15', stampsCollected: 5, totalStamps: 8 },
//         { id: 2, name: 'Cung Đình Huế', status: 'completed', purchasedAt: '2024-11-02', stampsCollected: 10, totalStamps: 10 },
//         { id: 3, name: 'Cung Đình Huế', status: 'completed', purchasedAt: '2024-11-02', stampsCollected: 10, totalStamps: 10 },
//       ]
//     })
//   }
// })

defineEmits(['logout', 'change-password'])

const rankMeta = computed(() => {
  const r = data.value?.rank?.toLowerCase() || ''
  if (r.includes('cao')) return { icon: '🏮' }
  if (r.includes('trung')) return { icon: '🪔' }
  return { icon: '🕯' }
})

function formatPrice(val) {
  return Number(val || 0).toLocaleString('vi-VN') + ' ₫'
}

function statusLabel(s) {
  return { 'in_progress': 'Đang đi', completed: 'Hoàn thành', pending: 'Chờ bắt đầu' }[s] || s
}

function statusClass(s) {
  return { 'in_progress': 'bg-blue-500/20 text-blue-800 border-[1px] border-blue-500', completed: 'bg-green-500/20 text-green-800 border-[1px] border-green-500', pending: 'status-pending' }[s] || ''
}

const getProfile = async () => {
  try {
    const { data: d } = await AuthAPI.profile()
    data.value = d
  }
  catch (err) {
    toast.error(err?.message)
  }
}

const logout = async () => {
  try {
    await AuthAPI.logout()
    sessionStorage.removeItem('token')
    // router.push('/login')
    token.value = null
    store.commit('user/setMe', null)
    toast.success('Đăng xuất thành công')
    router.push('/login')
  }
  catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  getProfile()
})
</script>

<style scoped>
/* ========== BASE ========== */
.profile-page {
  min-height: 100vh;
  background-color: #1a120a;
  background-image:
    radial-gradient(ellipse at 20% 10%, rgba(139, 90, 30, 0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 90%, rgba(120, 40, 10, 0.2) 0%, transparent 55%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* ========== CORNERS ========== */
.corner {
  position: fixed;
  width: 80px;
  height: 80px;
  border-color: rgba(180, 120, 40, 0.4);
  border-style: solid;
  z-index: 1;
  pointer-events: none;
}

.corner-tl {
  top: 16px;
  left: 16px;
  border-width: 2px 0 0 2px;
}

.corner-tr {
  top: 16px;
  right: 16px;
  border-width: 2px 2px 0 0;
}

.corner-bl {
  bottom: 16px;
  left: 16px;
  border-width: 0 0 2px 2px;
}

.corner-br {
  bottom: 16px;
  right: 16px;
  border-width: 0 2px 2px 0;
}

/* ========== SCROLL CONTAINER ========== */
.scroll-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 680px;
  background: linear-gradient(160deg, #f5e6c8 0%, #ede0c4 40%, #e8d5a8 100%);
  border-radius: 4px;
  padding: 48px 40px 40px;
  box-shadow:
    0 0 0 1px rgba(150, 100, 30, 0.4),
    0 0 0 3px rgba(100, 60, 10, 0.15),
    0 20px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(180, 130, 60, 0.07) 30px),
    linear-gradient(160deg, #f5e6c8 0%, #ede0c4 40%, #e8d5a8 100%);
}

.scroll-container::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(150, 100, 30, 0.25);
  border-radius: 2px;
  pointer-events: none;
}

/* ========== HEADER ========== */
.scroll-header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 28px;
}

.seal-ring {
  flex-shrink: 0;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  border: 3px solid rgba(150, 80, 20, 0.5);
  background: radial-gradient(circle, rgba(200, 150, 60, 0.2), transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 1px rgba(150, 100, 30, 0.2), 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
}

.avatar-wrap {
  position: relative;
  width: 86px;
  height: 86px;
}

.avatar-img {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(180, 120, 40, 0.6);
  filter: sepia(20%) contrast(1.05);
}

.seal-stamp {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: #c0392b;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transform: rotate(-8deg);
  color: #fff;
  font-size: 15px;
  font-weight: bold;
}

.user-headline {
  flex: 1;
  min-width: 0;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(160, 90, 20, 0.12);
  border: 1px solid rgba(160, 90, 20, 0.35);
  border-radius: 3px;
  padding: 2px 10px;
  margin-bottom: 8px;
  font-size: 11px;
  color: #8b5a1e;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rank-icon {
  font-size: 13px;
}

.username {
  font-size: 22px;
  font-weight: 700;
  color: #3b1f0a;
  margin: 0 0 4px;
  line-height: 1.2;
  letter-spacing: 0.03em;
}

.email {
  font-size: 13px;
  color: #8b6a3e;
  margin: 0;
  font-style: italic;
}

/* ========== DIVIDER ========== */
.ink-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  color: rgba(150, 100, 30, 0.4);
}

.ink-divider::before,
.ink-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(150, 100, 30, 0.35), transparent);
}

.divider-ornament {
  font-size: 18px;
  color: rgba(150, 80, 20, 0.5);
}

/* ========== STATS ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: rgba(180, 120, 40, 0.06);
  border: 1px solid rgba(150, 100, 30, 0.2);
  border-radius: 3px;
  padding: 16px 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 50, 10, 0.15);
}

.stat-card.highlight {
  background: rgba(192, 57, 43, 0.07);
  border-color: rgba(192, 57, 43, 0.3);
}

.stat-card.highlight::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, #c0392b, transparent);
}

.stat-icon {
  font-size: 22px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #3b1f0a;
  margin-bottom: 4px;
  word-break: break-all;
}

.stat-label {
  font-size: 11px;
  color: #8b6a3e;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* ========== SECTION TITLE ========== */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title h2 {
  font-size: 16px;
  font-weight: 700;
  color: #3b1f0a;
  margin: 0;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.title-ornament {
  font-size: 22px;
  color: rgba(150, 80, 20, 0.4);
}

/* ========== TOUR TABLE ========== */
.tour-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(150, 100, 30, 0.25);
  border-radius: 3px;
}

.tour-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tour-table thead tr {
  background: rgba(150, 100, 30, 0.1);
  border-bottom: 1px solid rgba(150, 100, 30, 0.25);
}

.tour-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: #6b3f10;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.tour-table tbody tr {
  border-bottom: 1px solid rgba(150, 100, 30, 0.12);
  transition: background 0.15s;
}

.tour-table tbody tr:last-child {
  border-bottom: none;
}

.tour-table tbody tr:hover {
  background: rgba(150, 100, 30, 0.05);
}

.tour-table tbody tr.row-completed {
  opacity: 0.7;
}

.tour-table td {
  padding: 10px 12px;
  color: #4a2e10;
  vertical-align: middle;
}

.td-index {
  color: #9b7445;
  font-size: 12px;
}

.td-name {
  font-weight: 600;
  color: #3b1f0a;
}

.td-date {
  color: #9b7445;
  font-style: italic;
  font-size: 12px;
  white-space: nowrap;
}

.td-empty {
  text-align: center;
  color: #9b7445;
  padding: 24px;
  font-style: italic;
}

.stamps-count {
  font-size: 12px;
  color: #c0392b;
}

/* STATUS BADGES */
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.status-pending {
  background: rgba(150, 100, 30, 0.1);
  border: 1px solid rgba(150, 100, 30, 0.3);
  color: #7d6608;
}

/* ========== ACTIONS ========== */
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 3px;
  border: 1px solid;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
  position: relative;
  overflow: hidden;
}

.btn-action::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), transparent);
  pointer-events: none;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.btn-action:active {
  transform: translateY(0);
}

.btn-change-pw {
  background: linear-gradient(135deg, #4a2e10, #7d4a1a);
  border-color: rgba(180, 120, 40, 0.5);
  color: #f5e6c8;
}

.btn-logout {
  background: linear-gradient(135deg, #6b1a1a, #c0392b);
  border-color: rgba(192, 57, 43, 0.5);
  color: #fde8e4;
}

.btn-icon {
  font-size: 16px;
}

/* ========== BOTTOM SEAL ========== */
.bottom-seal {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.seal-circle {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid rgba(192, 57, 43, 0.5);
  background: rgba(192, 57, 43, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: rgba(192, 57, 43, 0.5);
  box-shadow: inset 0 0 12px rgba(192, 57, 43, 0.08);
  transform: rotate(-5deg);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 480px) {
  .scroll-container {
    padding: 32px 20px 32px;
  }

  .scroll-header {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid .stat-card:last-child {
    grid-column: 1 / -1;
  }

  .username {
    font-size: 18px;
  }
}
</style>