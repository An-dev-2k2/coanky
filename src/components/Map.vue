<template>
  <div class="relative w-full h-screen xl:px-20 py-20 px-4 overflow-hidden">
    <div v-if="isLoading || !isMapReady"
      class="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div class="w-14 h-14 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 text-sm">Đang xác định vị trí...</p>
    </div>

    <div class=" h-full">
      <div v-if="!isAuthorized" class="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-xl shadow-xl text-center">
          <h2 class="text-red-500 font-bold text-xl mb-3">🚫 Không thể truy cập</h2>
          <p class="text-gray-600">{{ errorMessage }}</p>
        </div>
      </div>
      <div v-else class="flex flex-col md:flex-row h-full">
        <div class="relative rounded-xl bg-gray-200 mt-10 overflow-hidden w-full h-full md:h-full">
          <div id="map" class="w-full h-full"></div>
          <div v-if="isCompleted"
            class="absolute inset-0 z-[2000] flex items-center justify-center bg-white/70 backdrop-blur-sm">

            <div class="stamp-animation
             border-8 border-red-600
             text-red-600
             text-3xl font-extrabold
             px-10 py-4
             rounded-xl
             bg-white
             shadow-2xl
             tracking-widest">

              ĐÃ HOÀN THÀNH

            </div>

          </div>
        </div>

        <!-- SIDEBAR -->
        <div ref="sidebarRef" :class="[
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full',
        ]" class="absolute top-0 right-0 h-full w-80 md:w-1/3
           bg-white shadow-lg
           transition-all duration-500 ease-in-out
           z-[2001]">
          <!-- BUTTON (NẰM TRONG SIDEBAR) -->
          <button @click="toggleSidebar" class="absolute top-1/2 -translate-y-1/2 -left-10
             bg-white w-10 h-12 rounded-l-xl
             flex items-center justify-center
             hover:scale-105 transition">
            <ChevronLeft :class="isSidebarOpen ? 'rotate-180' : ''" class="transition-transform duration-300" />
          </button>

          <div class="p-4 h-full overflow-y-auto">

            <h2 class="text-xl font-bold mb-4">🎯 Thu Thập Ấn Ký</h2>

            <!-- Progress -->
            <div class="mb-4">
              <div class="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-500 to-lime-400 transition-all"
                  :style="{ width: progressPercent + '%' }"></div>
              </div>
              <p class="mt-2 text-sm text-gray-600">
                {{ collectedCount }} / {{ locations.length }}
              </p>
            </div>

            <div class="flex justify-center mt-6">
              <button @click="goToNearest" :disabled="isLoadingSearch || isCompleted"
                :class="(isLoadingSearch || isCompleted) ? ' cursor-no-drop opacity-40' : ''"
                class="w-[300px] text-white relative flex justify-center items-center py-2 mb-4 active:scale-95 transition">
                <img src="/images/btn-search.png" alt="">
                <template v-if="isLoadingSearch">
                  <Loader class="w-5 absolute animate-spin" />
                </template>
                <template v-else>
                  <p class=" absolute">Tìm đường đi gần nhất</p>
                </template>
              </button>
            </div>

            <div class="flex flex-col gap-3">
              <h2 class="text-base font-bold">🏅 Ấn Ký</h2>

              <div v-for="(location, index) in locations" :key="index"
                class="rounded-xl border transition-all duration-300" :class="location.collected
                  ? 'border-green-300 bg-green-50 shadow-sm shadow-green-100'
                  : 'border-gray-200 bg-gray-50'">

                <div class="flex items-center gap-3 p-3">
                  <!-- Icon ấn ký -->
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    :class="location.collected ? 'bg-green-100 shadow-md shadow-green-200' : 'bg-gray-200'">
                    <img :ref="el => setSidebarIconRef(el, index)" :src="location.icon?.image" :alt="location.name"
                      class="w-9 h-9 object-contain transition-all duration-500" :class="location.collected
                        ? 'opacity-100 scale-110 drop-shadow-[0_0_6px_#4caf50]'
                        : 'grayscale brightness-50 opacity-50'" />
                  </div>

                  <!-- Tên + trạng thái -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate"
                      :class="location.collected ? 'text-green-700' : 'text-gray-500'">
                      {{ location.name }}
                    </p>
                    <p class="text-xs mt-0.5" :class="location.collected ? 'text-green-500' : 'text-gray-400'">
                      {{ location.collected ? '✅ Đã thu thập' : '🔒 Chưa thu thập' }}
                    </p>
                  </div>
                </div>

                <!-- Audio player -->
                <div v-if="location.audio" class="px-3 pb-3">
                  <div class="flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300"
                    :class="location.collected ? 'bg-white border border-green-200' : 'bg-gray-100'">

                    <!-- Play button -->
                    <button :disabled="!location.collected" @click="toggleAudio(index)"
                      class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all" :class="location.collected
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm active:scale-95'
                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'">
                      <svg v-if="playingIndex !== index" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                        fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    </button>

                    <!-- Waveform / progress -->
                    <div class="flex-1">
                      <div class="w-full h-1.5 rounded-full overflow-hidden"
                        :class="location.collected ? 'bg-green-100' : 'bg-gray-200'">
                        <div class="h-full bg-green-400 rounded-full transition-all duration-300"
                          :style="{ width: playingIndex === index ? audioProgress + '%' : '0%' }"></div>
                      </div>
                      <p class="text-xs mt-1" :class="location.collected ? 'text-gray-500' : 'text-gray-400'">
                        {{ location.collected ? (playingIndex === index ? '🔊 Đang phát...' : '🎵 Nhấn để nghe') :
                          '🔒Thu thập để mở khóa' }}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div class="mt-4">
              <h3 class="text-sm font-semibold mb-2 text-gray-700">
                📋 Danh sách thu thập
              </h3>

              <div class="space-y-2">
                <div v-for="(location, index) in locations" :key="'collection-' + index"
                  class="flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-300"
                  :class="location.collected
                    ? 'bg-green-50 border-green-200 shadow-sm'
                    : 'bg-gray-50 border-gray-200 opacity-70'">
                  <div class="flex items-center gap-2 min-w-0">
                    <!-- Chấm trạng thái -->
                    <span class="w-2.5 h-2.5 rounded-full"
                      :class="location.collected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'"></span>

                    <span class="text-sm truncate line-clamp-1" :class="location.collected
                      ? 'text-green-700 font-semibold'
                      : 'text-gray-500'">
                      {{ location.name }}
                    </span>
                  </div>

                  <!-- Badge -->
                  <!-- <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="location.collected
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-500'">
                    {{ location.collected ? 'Đã thu thập' : 'Chưa thu thập' }}
                  </span> -->
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      <!-- MAP -->

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import polyline from "@mapbox/polyline";
import AppAPI from "@/services/api/client/AppAPI";
import { ChevronLeft, ChevronRight, Loader } from "lucide-vue-next";
import TourAPI from "@/services/api/client/TourAPI";
import { useRoute } from "vue-router";

const route = useRoute();
const slug = route.params.slug;
const isLoading = ref(true);
const isLoadingSearch = ref(false);
const isSidebarOpen = ref(false)
const sidebarIconRefs = ref({})
const sidebarRef = ref(null)
const playingIndex = ref(-1)
const audioProgress = ref(0)
const isMapReady = ref(false)
let currentAudio = null
let progressInterval = null

const props = defineProps({
  isAuthorized: Boolean,
  errorMessage: String,
  locations: {
    type: Array,
    default: () => []
  }
})

function setSidebarIconRef(el, index) {
  if (el) {
    sidebarIconRefs.value[index] = el
  }
}

function toggleAudio(index) {
  const location = props.locations[index]
  if (!location.collected || !location.audio) return

  // Đang phát cùng bài → pause
  if (playingIndex.value === index) {
    currentAudio?.pause()
    clearInterval(progressInterval)
    playingIndex.value = -1
    return
  }

  // Dừng bài đang phát (nếu có)
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    clearInterval(progressInterval)
  }

  // Phát bài mới
  currentAudio = new Audio(location.audio.audio)
  playingIndex.value = index
  audioProgress.value = 0

  currentAudio.play()

  progressInterval = setInterval(() => {
    if (!currentAudio || currentAudio.duration === 0) return
    audioProgress.value = (currentAudio.currentTime / currentAudio.duration) * 100
  }, 200)

  currentAudio.onended = () => {
    playingIndex.value = -1
    audioProgress.value = 0
    clearInterval(progressInterval)
  }
}
function animateIconToSidebar(location, index) {
  if (!map || !sidebarRef.value) return;

  const markerLatLng = L.latLng(location.lat, location.lon);
  const point = map.latLngToContainerPoint(markerLatLng);
  const mapRect = map.getContainer().getBoundingClientRect();

  const rawX = mapRect.left + point.x - 20;
  const rawY = mapRect.top + point.y - 20;

  const isOutOfView =
    rawX < mapRect.left || rawX > mapRect.right ||
    rawY < mapRect.top || rawY > mapRect.bottom;

  const startX = isOutOfView ? mapRect.left + mapRect.width / 2 - 20 : rawX;
  const startY = isOutOfView ? mapRect.top + mapRect.height / 2 - 20 : rawY;

  // ✅ Điểm giữa màn hình
  const midX = window.innerWidth / 2 - 40;
  const midY = window.innerHeight / 2 - 40;

  let endX, endY;
  if (isSidebarOpen.value) {
    const targetEl = sidebarIconRefs.value[index];
    if (!targetEl) {
      endX = window.innerWidth + 60;
      endY = midY;
    } else {
      const targetRect = targetEl.getBoundingClientRect();
      endX = targetRect.left + targetRect.width / 2 - 20;
      endY = targetRect.top + targetRect.height / 2 - 20;
    }
  } else {
    endX = window.innerWidth + 60;
    endY = midY;
  }

  const flyingIcon = document.createElement("img");
  flyingIcon.src = location.icon?.image;

  Object.assign(flyingIcon.style, {
    position: "fixed",
    left: startX + "px",
    top: startY + "px",
    width: "40px",
    height: "40px",
    zIndex: "999999",
    pointerEvents: "none",
    transform: "scale(1)",
    opacity: "1",
    transition: "none",
    borderRadius: "12px",
    filter: "none",
  });

  document.body.appendChild(flyingIcon);

  // ── PHASE 1: Bay lên giữa màn hình + zoom to + sáng lên ──
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      Object.assign(flyingIcon.style, {
        transition: "left 0.6s ease-out, top 0.6s ease-out, transform 0.6s ease-out, filter 0.6s ease-out",
        left: midX + "px",
        top: midY + "px",
        transform: "scale(2.5)",
        filter: "brightness(1.8) drop-shadow(0 0 16px #ffe066) drop-shadow(0 0 32px #ffd700)",
      });
    });
  });

  // ── PHASE 2: Sau khi đến giữa màn hình → bay vào sidebar ──
  setTimeout(() => {
    Object.assign(flyingIcon.style, {
      transition: "left 5s cubic-bezier(0.65, 0, 0.35, 1), top 5s cubic-bezier(0.65, 0, 0.35, 1), transform 5s ease-in, filter 5s ease-in, opacity 5s ease-in",
      left: endX + "px",
      top: endY + "px",
      transform: "scale(0.4) rotate(360deg)",
      filter: "none",
      opacity: "0",
    });
  }, 700); // đợi phase 1 xong (600ms + buffer nhỏ)

  // ── Dọn dẹp sau khi animation kết thúc ──
  setTimeout(() => {
    flyingIcon.remove();
  }, 1800); // 700 + 1000 + buffer
}
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const isCompleted = computed(() =>
  props.locations.length > 0 &&
  props.locations.every(l => l.collected)
)

let map;
let userMarker;
let radarCircle;
let markers = [];
let routeLine;
let remainingLine;
let passedLine;
let currentRoute = [];
let initialPosition = null;
let radarSweep;
let locateControl;
let currentTarget = null;
let routingControl;
let hasReceivedFirstPosition = false;
let lastCheckTime = 0;
let hasAnimatedOnLoad = false;
const CHECK_INTERVAL = 1000;
const stampingSet = new Set();
const COLLECT_RADIUS = 50; // 50 mét
const positionHistory = [];
const SMOOTH_COUNT = 5;
let lastUpdatePos = null;
const MIN_MOVE_METERS = 3;

const humanIcon = L.icon({
  iconUrl: "https://cdn-icons-png.freepik.com/256/12569/12569178.png?semt=ais_white_label",
  iconSize: [30, 30],
});
const defaultLocationIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});
let currentRadarRadius = 60;

// const locations = ref([]);
const collectedCount = computed(() =>
  props.locations.filter(l => l.collected).length
);

const progressPercent = computed(() =>
  (collectedCount.value / props.locations.length) * 100
);

onMounted(() => {
  if (!props.isAuthorized) {
    isLoading.value = false;
  }
});

function smoothPosition(lat, lon) {
  positionHistory.push({ lat, lon });
  if (positionHistory.length > SMOOTH_COUNT) positionHistory.shift();
  const avgLat = positionHistory.reduce((s, p) => s + p.lat, 0) / positionHistory.length;
  const avgLon = positionHistory.reduce((s, p) => s + p.lon, 0) / positionHistory.length;
  return { lat: avgLat, lon: avgLon };
}
const initMap = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      initialPosition = [latitude, longitude];

      map = L.map("map").setView(initialPosition, 18);

      addLocateButton();
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "&copy; OpenStreetMap",
        }
      ).addTo(map);

      tileLayer.on("load", async () => {
        isMapReady.value = true;

        await nextTick();
        map.invalidateSize();

        // ✅ Chỉ animate 1 lần duy nhất
        if (!hasAnimatedOnLoad) {
          hasAnimatedOnLoad = true;
          setTimeout(() => {
            map.invalidateSize();
            animateCollectedOnLoad();
          }, 300);
        }
      });

      map.on("zoomend", updateRadarSize);
      renderLocations();
      updateUser(latitude, longitude);

      // ✅ Tắt loading TRƯỚC
      isLoading.value = false;

      // ✅ Đợi Vue render xong (loading overlay ẩn đi) rồi mới invalidateSize + animate
      await nextTick();
      map.invalidateSize();

      // ✅ Thêm delay nhỏ để browser repaint hoàn toàn
      setTimeout(() => {
        map.invalidateSize();
        animateCollectedOnLoad();
      }, 300);

      startWatch();
    },
    (err) => {
      console.error(err);
      isLoading.value = false;
    },
    { enableHighAccuracy: true }
  );
}
async function animateCollectedOnLoad() {
  await nextTick();

  // ✅ Dùng 'moveend' hoặc 'load' thay vì whenReady
  // vì whenReady chạy quá sớm, map chưa có kích thước thật
  map.invalidateSize(); // force map tính lại kích thước

  setTimeout(() => {
    map.invalidateSize();

    props.locations.forEach((location, index) => {
      if (!location.collected) return;

      setTimeout(() => {
        animateIconToSidebar(location, index);
      }, index * 500);
    });
  }, 1000); // đợi map container có kích thước thật
}
watch(
  () => props.isAuthorized,
  async (val) => {
    console.log("Authorization changed:", val);
    if (val) {
      await nextTick();
      initMap()
    }
  },
  { immediate: true }
)

function addLocateButton() {
  const LocateControl = L.Control.extend({
    options: {
      position: "bottomright",
    },

    onAdd: function () {
      const container = L.DomUtil.create("div", "flex flex-col gap-2 relative");

      // ── Nút 1: Về vị trí hiện tại ──
      const btnLocate = L.DomUtil.create("button", "locate-btn relative", container);
      btnLocate.title = "Về vị trí hiện tại";
      btnLocate.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#2196f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `;
      btnLocate.onclick = function () {
        if (!userMarker || isCompleted.value) return;
        const pos = userMarker.getLatLng();
        map.setView(pos, 18, { animate: true, duration: 1 });
      };

      // ── Nút 2: Zoom về user + điểm gần nhất ──
      const btnFit = L.DomUtil.create("button", "locate-btn relative", container);
      btnFit.title = "Xem đường đến điểm gần nhất";
      btnFit.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
          <path d="M11 8v6"/>
          <path d="M8 11h6"/>
        </svg>
      `;
      btnFit.onclick = function () {
        if (!userMarker || !currentTarget || isCompleted.value) return;

        const userPos = userMarker.getLatLng();
        const targetPos = L.latLng(currentTarget.lat, currentTarget.lon);

        // Zoom vừa đủ để thấy cả 2 điểm
        const bounds = L.latLngBounds([userPos, targetPos]);
        map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 1 });
      };

      return container;
    },
  });

  locateControl = new LocateControl();
  map.addControl(locateControl);
}

function createTestLocations(lat, lon) {
  const distanceInMeters = 70;
  const offset = distanceInMeters / 111111;

  locations.value = [
    {
      name: "Điểm Test 1",
      lat: lat + offset,
      lon: lon,
      collected: false,
    },
    {
      name: "Điểm Test 2",
      lat: lat,
      lon: lon + offset,
      collected: false,
    },
  ];
}
async function drawRouteTo(target) {
  if (!userMarker) return;

  const userPos = userMarker.getLatLng();

  try {
    const { data } = await AppAPI.map({
      coordinates: [
        [userPos.lng, userPos.lat],
        [target.lon, target.lat],
      ],
    })
    const encoded = data.routes[0].geometry;
    const decoded = polyline.decode(encoded);

    const latlngs = decoded.map(coord => [coord[0], coord[1]]);

    // Xóa route cũ
    if (routeLine) {
      map.removeLayer(routeLine);
    }

    routeLine = L.polyline(latlngs, {
      color: "#2196f3",
      weight: 6,
    }).addTo(map);

    map.fitBounds(routeLine.getBounds(), {
      padding: [50, 50],
    });

  } catch (err) {
    console.error("Routing error:", err);
  }
}

function autoFindNearest() {
  if (!userMarker || isCompleted.value) return;

  // 🔥 Nếu đã có target và chưa collected thì giữ nguyên
  if (currentTarget && !currentTarget.collected) {
    return;
  }

  const userPos = userMarker.getLatLng();
  let nearest = null;
  let minDistance = Infinity;

  props.locations.forEach((location) => {
    if (location.collected) return;

    const distance = map.distance(
      [userPos.lat, userPos.lng],
      [location.lat, location.lon]
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  });

  if (!nearest) {
    currentTarget = null;
    return;
  }

  currentTarget = nearest;
  drawRouteTo(nearest);
}

function renderLocations() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  props.locations.forEach((location) => {

    const iconUrl =
      location.icon?.image || defaultLocationIcon.options.iconUrl;

    const marker = L.marker(
      [location.lat, location.lon],
      {
        icon: L.divIcon({
          className: "",
          html: `
            <div class="custom-marker ${location.collected ? 'collected' : 'not-collected'}">
              <img src="${iconUrl}" />
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }
    ).addTo(map);

    markers.push(marker);
  });
}

function startWatch() {
  navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      console.log("📍 New position:", latitude, longitude);

      if (accuracy > 50) return;
      const { lat, lon } = smoothPosition(latitude, longitude);

      // 3. Ngưỡng di chuyển tối thiểu
      if (lastUpdatePos && map) {
        const moved = map.distance([lastUpdatePos.lat, lastUpdatePos.lon], [lat, lon]);
        if (moved < MIN_MOVE_METERS) return;
      }
      lastUpdatePos = { lat, lon };
      updateUser(lat, lon);

      // Bỏ lần đầu để tránh auto collect ngay khi load
      if (!hasReceivedFirstPosition) {
        hasReceivedFirstPosition = true;
        return;
      }

      // Throttle check để tránh spam API
      const now = Date.now();
      if (now - lastCheckTime < CHECK_INTERVAL) return;
      lastCheckTime = now;

      checkCollection(latitude, longitude);
    },
    (err) => console.error(err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
}


function updateRouteProgress(lat, lon) {
  if (!currentRoute.length) return;

  const start = L.latLng(currentRoute[0]);
  const end = L.latLng(currentRoute[1]);
  const user = L.latLng(lat, lon);

  const totalDistance = map.distance(start, end);
  const passedDistance = map.distance(start, user);

  if (passedDistance > totalDistance) return;

  const ratio = passedDistance / totalDistance;

  const passedLat =
    start.lat + (end.lat - start.lat) * ratio;
  const passedLng =
    start.lng + (end.lng - start.lng) * ratio;

  passedLine.setLatLngs([
    [start.lat, start.lng],
    [passedLat, passedLng],
  ]);

  remainingLine.setLatLngs([
    [passedLat, passedLng],
    [end.lat, end.lng],
  ]);
}
function updateUser(lat, lon) {
  if (!userMarker) {
    userMarker = L.marker([lat, lon], {
      icon: humanIcon,
    }).addTo(map);
  } else {
    userMarker.setLatLng([lat, lon]);
  }

  updateRadar(lat, lon);

  autoFindNearest(); // 🔥 tự động tìm gần nhất
  updateRouteProgress(lat, lon);
}

function updateRadar(lat, lon) {
  const zoom = map.getZoom();
  currentRadarRadius = 20 * (20 - zoom);

  // Radar nền
  if (!radarCircle) {
    radarCircle = L.circle([lat, lon], {
      radius: currentRadarRadius,
      color: "#2196f3",
      fillOpacity: 0.08,
      weight: 1,
    }).addTo(map);
  } else {
    radarCircle.setLatLng([lat, lon]);
    radarCircle.setRadius(currentRadarRadius);
  }

  // Radar quét animation
  if (!radarSweep) {
    radarSweep = L.marker([lat, lon], {
      icon: L.divIcon({
        className: "radar-sweep",
        iconSize: [currentRadarRadius * 2, currentRadarRadius * 2],
      }),
    }).addTo(map);
  } else {
    radarSweep.setLatLng([lat, lon]);
  }
}

function updateRadarSize() {
  if (!userMarker) return;
  const pos = userMarker.getLatLng();
  updateRadar(pos.lat, pos.lng);
}

// function checkCollection(userLat, userLon) {
//   if (isFirstLoad) return;

//   props.locations.forEach((location, index) => {
//     if (location.collected) return;

//     const distance = map.distance(
//       [userLat, userLon],
//       [location.lat, location.lon]
//     );

//     if (distance <= COLLECT_RADIUS) {
//       location.collected = true;

//       if (currentTarget === location) {
//         currentTarget = null;
//       }

//       console.log("Collected:", location.name);
//     }
//   });
// }

async function checkCollection(userLat, userLon) {
  // if (isFirstLoad) return;

  for (const [index, location] of props.locations.entries()) {
    if (location.collected) continue;
    if (stampingSet.has(index)) continue; // đang xử lý

    const distance = map.distance(
      [userLat, userLon],
      [location.lat, location.lon]
    );

    if (distance <= COLLECT_RADIUS) {
      stampingSet.add(index);

      try {
        // Gọi API lưu tiến trình
        await TourAPI.updateMap(slug, {
          iconId: location.icon._id,
          locationIndex: index
        });

        // ✅ Update state
        props.locations[index].collected = true;

        await nextTick();
        // ✅ Animation
        animateIconToSidebar(location, index);

        // ✅ Render lại marker
        renderLocations();

        // ✅ Reset target nếu đang là target
        if (currentTarget === location) {
          currentTarget = null;
        }

        // ✅ Tự động tìm điểm mới
        setTimeout(() => {
          autoFindNearest();
        }, 500);

        console.log("✅ Collected:", location.name);
      } catch (err) {
        console.error("❌ Stamp failed:", err);
        stampingSet.delete(index); // cho phép thử lại nếu lỗi
      }
    }
  }
}

async function goToNearest() {
  if (!userMarker || isLoadingSearch.value) return;
  isLoadingSearch.value = true;
  const userPos = userMarker.getLatLng();
  let nearest = null;
  let minDistance = Infinity;

  props.locations.forEach((location) => {
    if (location.collected) return;

    const distance = map.distance(
      [userPos.lat, userPos.lng],
      [location.lat, location.lon]
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  });

  if (!nearest) {
    alert("🎉 Bạn đã thu thập hết!");
    isLoadingSearch.value = false;
    return;
  }

  currentTarget = nearest;
  await drawRouteTo(nearest); // 🔥 dùng routing thật
  setTimeout(() => {
    isLoadingSearch.value = false;
  }, 800);
}
</script>

<style>
/* .container {
  display: flex;
}

#map {
  width: 70%;
  height: 100vh;
}

.sidebar {
  width: 30%;
  padding: 15px;
  background: #f5f5f5;
} */

.progress-wrapper {
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 15px;
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #4caf50, #8bc34a);
  transition: width 0.3s;
}

.btn {
  padding: 8px 12px;
  background: blue;
  color: white;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
}

.item {
  padding: 8px 0;
}

.item.collected {
  color: green;
  font-weight: bold;
}

.radar-sweep {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
}

.radar-sweep::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(rgba(33, 150, 243, 0.4) 0deg,
      rgba(33, 150, 243, 0.2) 60deg,
      transparent 120deg);
  animation: radarRotate 2s linear infinite;
}

@keyframes radarRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.locate-btn {
  background: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.locate-btn:hover {
  background: #f0f0f0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #ddd;
  border-top: 6px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.custom-marker {
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.custom-marker img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
}

/* 🔥 Chưa thu thập → icon tối */
.custom-marker.not-collected img {
  filter: grayscale(100%) brightness(60%);
  opacity: 0.7;
}

/* ✅ Đã thu thập → sáng + glow nhẹ */
.custom-marker.collected img {
  filter: none;
  opacity: 1;
  transform: scale(1.1);
}

/* Optional: hiệu ứng glow */
.custom-marker.collected {
  animation: glow 1.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 5px #4caf50);
  }

  to {
    filter: drop-shadow(0 0 12px #8bc34a);
  }
}

@keyframes stampEffect {
  0% {
    transform: scale(3) rotate(-20deg);
    opacity: 0;
  }

  60% {
    transform: scale(0.9) rotate(5deg);
    opacity: 1;
  }

  80% {
    transform: scale(1.05) rotate(-2deg);
  }

  100% {
    transform: scale(1) rotate(-2deg);
  }
}

.stamp-animation {
  animation: stampEffect 0.6s ease-out forwards;
}
</style>