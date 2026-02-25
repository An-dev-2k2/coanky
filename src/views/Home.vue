<template>
  <div class="container">
    <div id="map"></div>

    <div class="list">
      <div v-for="(location, index) in locations" :key="index" class="item">
        <h3>{{ location.name }}</h3>
        <p>Lat: {{ location.lat }}</p>
        <p>Lon: {{ location.lon }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const locations = ref([
  {
    name: "Hồ Gươm",
    lat: 21.0285,
    lon: 105.8542,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  },
  {
    name: "Lăng Bác",
    lat: 21.0368,
    lon: 105.8342,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3179/3179068.png",
  },
]);

let map;
let userMarker;

onMounted(() => {
  // Tạo map
  map = L.map("map").setView([21.0285, 105.8542], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  // Render các location
  locations.value.forEach((location) => {
    const customIcon = L.icon({
      iconUrl: location.iconUrl,
      iconSize: [35, 35],
    });

    L.marker([location.lat, location.lon], {
      icon: customIcon,
    })
      .addTo(map)
      .bindPopup(location.name);
  });

  // Realtime GPS
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!userMarker) {
          userMarker = L.marker([latitude, longitude]).addTo(map);
        } else {
          userMarker.setLatLng([latitude, longitude]);
        }

        map.setView([latitude, longitude]);
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }
});
</script>

<style>
.container {
  display: flex;
}

#map {
  width: 70%;
  height: 100vh;
}

.list {
  width: 30%;
  padding: 10px;
  overflow-y: auto;
}

.item {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
</style>