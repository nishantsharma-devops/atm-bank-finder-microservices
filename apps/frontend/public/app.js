const state = {
  map: null,
  userMarker: null,
  placeMarkers: [],
  stream: null,
  coords: null
};

const locateButton = document.getElementById("locateButton");
const serviceStatus = document.getElementById("serviceStatus");
const streamStatus = document.getElementById("streamStatus");
const cityLabel = document.getElementById("cityLabel");
const hintLabel = document.getElementById("hintLabel");
const typeSelect = document.getElementById("typeSelect");
const radiusSelect = document.getElementById("radiusSelect");
const resultsMeta = document.getElementById("resultsMeta");
const resultsList = document.getElementById("resultsList");

function initializeMap() {
  state.map = L.map("map").setView([28.6139, 77.209], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(state.map);
}

async function fetchServiceHealth() {
  try {
    const response = await fetch("/api/health");
    const payload = await response.json();
    const healthyCount = payload.services.filter((service) => service.status === "ok").length;
    serviceStatus.textContent = `${healthyCount}/3 services live`;
  } catch (error) {
    serviceStatus.textContent = "Services unavailable";
  }
}

function updateUserMarker(lat, lng) {
  if (!state.userMarker) {
    state.userMarker = L.marker([lat, lng]).addTo(state.map).bindPopup("You are here");
  } else {
    state.userMarker.setLatLng([lat, lng]);
  }

  state.map.setView([lat, lng], 13);
}

function clearPlaceMarkers() {
  state.placeMarkers.forEach((marker) => state.map.removeLayer(marker));
  state.placeMarkers = [];
}

function renderPlaces(payload) {
  const items = payload.results || [];
  clearPlaceMarkers();

  resultsMeta.textContent = `${items.length} result(s) within ${payload.query.radius} km`;

  if (!items.length) {
    resultsList.innerHTML = "<div class=\"result-item\"><h3>No nearby results</h3><p>Try increasing the radius or moving closer to a city center.</p></div>";
    return;
  }

  resultsList.innerHTML = items
    .map(
      (item) => `
        <article class="result-item">
          <div class="result-top">
            <div>
              <h3>${item.name}</h3>
              <p>${item.address}</p>
            </div>
            <strong>${item.distanceKm} km</strong>
          </div>
          <span class="tag">${item.type.toUpperCase()}</span>
          <span class="tag">${item.bank}</span>
          <span class="tag">${item.availability}</span>
          <span class="tag">Cash ${item.cashLevel}</span>
        </article>
      `
    )
    .join("");

  items.forEach((item) => {
    const marker = L.marker([item.lat, item.lng])
      .addTo(state.map)
      .bindPopup(`<strong>${item.name}</strong><br />${item.address}<br />${item.distanceKm} km away`);
    state.placeMarkers.push(marker);
  });
}

async function fetchLocationContext() {
  const params = new URLSearchParams({
    lat: state.coords.lat,
    lng: state.coords.lng
  });

  const response = await fetch(`/api/location/context?${params.toString()}`);
  const payload = await response.json();
  cityLabel.textContent = `${payload.city} · ${payload.zone}`;
  hintLabel.textContent = payload.searchHint;
}

async function fetchPlaces() {
  const params = new URLSearchParams({
    lat: state.coords.lat,
    lng: state.coords.lng,
    radius: radiusSelect.value,
    type: typeSelect.value
  });

  const response = await fetch(`/api/places/nearby?${params.toString()}`);
  const payload = await response.json();
  renderPlaces(payload);
}

function startRealtime() {
  if (state.stream) {
    state.stream.close();
  }

  const params = new URLSearchParams({
    lat: state.coords.lat,
    lng: state.coords.lng,
    radius: radiusSelect.value,
    type: typeSelect.value
  });

  state.stream = new EventSource(`/api/realtime/stream?${params.toString()}`);
  streamStatus.textContent = "Stream connecting";

  state.stream.addEventListener("places", (event) => {
    const payload = JSON.parse(event.data);
    renderPlaces(payload);
    streamStatus.textContent = `Live at ${new Date(payload.generatedAt).toLocaleTimeString()}`;
  });

  state.stream.addEventListener("error", () => {
    streamStatus.textContent = "Stream reconnecting";
  });
}

async function refreshSearch() {
  if (!state.coords) {
    return;
  }

  await fetchLocationContext();
  await fetchPlaces();
  startRealtime();
}

function requestLocation() {
  if (!navigator.geolocation) {
    hintLabel.textContent = "This browser does not support geolocation.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      state.coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      updateUserMarker(state.coords.lat, state.coords.lng);
      await refreshSearch();
    },
    () => {
      hintLabel.textContent = "Location access denied. Default city preview is still available.";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
    }
  );
}

locateButton.addEventListener("click", requestLocation);
typeSelect.addEventListener("change", refreshSearch);
radiusSelect.addEventListener("change", refreshSearch);

initializeMap();
fetchServiceHealth();
