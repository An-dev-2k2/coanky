<template>
  <div class="relative w-full h-screen overflow-hidden">
    <div v-if="isLoading" class="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div class="w-14 h-14 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 text-sm">Đang xác định vị trí...</p>
    </div>

    <div class=" relative h-full">
      <div v-if="!isAuthorized" class="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-xl shadow-xl text-center">
          <h2 class="text-red-500 font-bold text-xl mb-3">🚫 Không thể truy cập</h2>
          <p class="text-gray-600">{{ errorMessage }}</p>
        </div>
      </div>
      <div v-else class="flex flex-col md:flex-row h-full">
        <div class="relative w-full md:w-2/3 h-[60vh] md:h-full">
          <div id="map" class="w-full h-full"></div>
        </div>

        <!-- SIDEBAR -->
        <div class="
        w-full md:w-1/3
        h-[40vh] md:h-full
        p-4
        overflow-y-auto md:rounded-none
        shadow-lg md:shadow-none
      ">
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

          <button @click="goToNearest"
            class="w-full bg-blue-500 text-white py-2 rounded-xl mb-4 active:scale-95 transition">
            🚀 Chỉ đường gần nhất
          </button>

          <div v-for="(location, index) in locations" :key="index"
            class="flex justify-between items-center py-2 border-b"
            :class="{ 'text-green-600 font-semibold': location.collected }">
            <span>{{ location.name }}</span>
            <span v-if="location.collected">✅</span>
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

const isLoading = ref(true);

const props = defineProps({
  isAuthorized: Boolean,
  errorMessage: String,
  locations: {
    type: Array,
    default: () => []
  }
})
let map;
let userMarker;
let radarCircle;
let markers = [];
let routeLine;
let remainingLine;
let passedLine;
let currentRoute = [];
let isFirstLoad = true;
let initialPosition = null;
let radarSweep;
let locateControl;
let currentTarget = null;
let routingControl;
const COLLECT_RADIUS = 5; // 5 mét

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

const initMap = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      initialPosition = [latitude, longitude];

      // 🔥 Khởi tạo map đúng vị trí hiện tại
      map = L.map("map").setView(initialPosition, 18);

      addLocateButton();
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      map.on("zoomend", updateRadarSize);

      // createTestLocations(latitude, longitude);
      renderLocations();

      updateUser(latitude, longitude);

      isLoading.value = false;
      startWatch();
    },
    (err) => {
      console.error(err);
      isLoading.value = false; // nếu lỗi cũng tắt loading
    },
    { enableHighAccuracy: true }
  );
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
      const btn = L.DomUtil.create("button", "locate-btn");
      btn.innerHTML = "📍";
      btn.title = "Về vị trí hiện tại";

      btn.onclick = function () {
        if (!userMarker) return;

        const pos = userMarker.getLatLng();
        map.setView(pos, 18, {
          animate: true,
          duration: 1,
        });
      };

      return btn;
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
  if (!userMarker) return;

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
      const { latitude, longitude } = pos.coords;

      const movedDistance = map.distance(
        initialPosition,
        [latitude, longitude]
      );

      updateUser(latitude, longitude);

      // 🔥 Chỉ khi di chuyển > 10m mới bắt đầu collect
      if (movedDistance > 10) {
        isFirstLoad = false;
      }

      checkCollection(latitude, longitude);
    },
    console.error,
    { enableHighAccuracy: true }
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

function checkCollection(userLat, userLon) {
  if (isFirstLoad) return;

  props.locations.forEach((location, index) => {
    if (location.collected) return;

    const distance = map.distance(
      [userLat, userLon],
      [location.lat, location.lon]
    );

    if (distance <= COLLECT_RADIUS) {
      location.collected = true;

      if (currentTarget === location) {
        currentTarget = null;
      }

      console.log("Collected:", location.name);
    }
  });
}

function goToNearest() {
  if (!userMarker) return;

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
    return;
  }

  currentTarget = nearest;
  drawRouteTo(nearest); // 🔥 dùng routing thật
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
</style>