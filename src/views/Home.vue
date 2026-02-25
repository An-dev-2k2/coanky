<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Đang xác định vị trí...</p>
    </div>
    <div class="container">
      <div id="map"></div>

      <div class="sidebar">
        <h2>🎯 Thu Thập Ấn Ký</h2>

        <!-- Progress Bar -->
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <p>{{ collectedCount }} / {{ locations.length }}</p>
        </div>

        <button @click="goToNearest" class="btn">
          🚀 Chỉ đường gần nhất
        </button>

        <div v-for="(location, index) in locations" :key="index" class="item"
          :class="{ collected: location.collected }">
          {{ location.name }}
          <span v-if="location.collected">✅</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const isLoading = ref(true);
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
const COLLECT_RADIUS = 5; // 5 mét

const humanIcon = L.icon({
  iconUrl: "https://cdn-icons-png.freepik.com/256/12569/12569178.png?semt=ais_white_label",
  iconSize: [40, 40],
});
const defaultLocationIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});
let currentRadarRadius = 60;

const locations = ref([]);
const collectedCount = computed(() =>
  locations.value.filter(l => l.collected).length
);

const progressPercent = computed(() =>
  (collectedCount.value / locations.value.length) * 100
);

onMounted(() => {
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

      createTestLocations(latitude, longitude);
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
});

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
function drawRouteTo(target) {
  if (!userMarker) return;

  const userPos = userMarker.getLatLng();

  currentRoute = [
    [userPos.lat, userPos.lng],
    [target.lat, target.lon],
  ];

  if (remainingLine) map.removeLayer(remainingLine);
  if (passedLine) map.removeLayer(passedLine);

  remainingLine = L.polyline(currentRoute, {
    color: "blue",
    weight: 6,
  }).addTo(map);

  passedLine = L.polyline([], {
    color: "gray",
    weight: 6,
  }).addTo(map);
}

function autoFindNearest() {
  if (!userMarker) return;

  const userPos = userMarker.getLatLng();
  let nearest = null;
  let minDistance = Infinity;

  locations.value.forEach((location) => {
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

  if (!nearest) return;

  drawRouteTo(nearest);
}

function renderLocations() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  locations.value.forEach((location) => {

    const icon = L.icon({
      iconUrl: location.iconUrl || defaultLocationIcon.options.iconUrl,
      iconSize: [35, 35],
    });

    const marker = L.marker(
      [location.lat, location.lon],
      { icon }
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

  locations.value.forEach((location, index) => {
    if (location.collected) return;

    const distance = map.distance(
      [userLat, userLon],
      [location.lat, location.lon]
    );

    if (distance <= COLLECT_RADIUS) {
      location.collected = true;
      markers[index].setStyle({ color: "green" });

      console.log("Collected:", location.name);
    }
  });
}

function goToNearest() {
  if (!userMarker) return;

  const userPos = userMarker.getLatLng();
  let nearest = null;
  let minDistance = Infinity;

  locations.value.forEach((location) => {
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

  if (routeLine) {
    map.removeLayer(routeLine);
  }

  routeLine = L.polyline(
    [
      [userPos.lat, userPos.lng],
      [nearest.lat, nearest.lon],
    ],
    { weight: 6 }
  ).addTo(map);

  map.fitBounds(routeLine.getBounds(), {
    padding: [50, 50],
  });
}
</script>

<style>
.container {
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
}

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
</style>