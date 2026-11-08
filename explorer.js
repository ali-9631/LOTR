
// ========================================
// WEATHER + MAP EXPLORER
// Open-Meteo + Leaflet + OpenStreetMap
// ========================================

// ========================================
// GENERAL STATUS MESSAGE
// ========================================

function setStatus(element, message, isError = false) {
  if (!element) return;

  element.textContent = message;

  element.classList.toggle("error", isError);
  element.classList.toggle(
    "success",
    !isError && message.length > 0
  );
}

// ========================================
// CITY SEARCH / GEOCODING
// ========================================

async function geocodeCity(city) {
  const url = new URL(
    "https://geocoding-api.open-meteo.com/v1/search"
  );

  url.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json"
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "The location service is unavailable. Please try again."
    );
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(
      "I couldn't find that place. Check the spelling and try again."
    );
  }

  return data.results[0];
}

// ========================================
// WEATHER DESCRIPTION
// ========================================

function weatherDescription(code) {
  const descriptions = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    56: ["Freezing drizzle", "🌧️"],
    57: ["Heavy freezing drizzle", "🌧️"],
    61: ["Light rain", "🌦️"],
    63: ["Rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    66: ["Freezing rain", "🌧️"],
    67: ["Heavy freezing rain", "🌧️"],
    71: ["Light snow", "🌨️"],
    73: ["Snow", "🌨️"],
    75: ["Heavy snow", "❄️"],
    77: ["Snow grains", "❄️"],
    80: ["Rain showers", "🌦️"],
    81: ["Rain showers", "🌧️"],
    82: ["Violent rain showers", "⛈️"],
    85: ["Snow showers", "🌨️"],
    86: ["Heavy snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Severe thunderstorm with hail", "⛈️"]
  };

  return descriptions[code] ||
    ["Weather conditions unavailable", "🌡️"];
}

// ========================================
// GET WEATHER DATA
// ========================================

async function getWeather(place) {
  const url = new URL(
    "https://api.open-meteo.com/v1/forecast"
  );

  url.search = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),

    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",

    hourly: "temperature_2m,weather_code",

    forecast_days: "1",
    timezone: "auto"
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Weather data is temporarily unavailable."
    );
  }

  return response.json();
}

// ========================================
// DISPLAY WEATHER
// ========================================

function displayWeather(place, data) {
  const current = data.current;

  const [description, icon] =
    weatherDescription(current.weather_code);

  const cityLabel = [
    place.name,
    place.admin1,
    place.country
  ]
    .filter(Boolean)
    .join(", ");

  document.getElementById("weatherPlace").textContent =
    cityLabel;

  document.getElementById("weatherDescription").textContent =
    description;

  document.getElementById("weatherIcon").textContent =
    icon;

  document.getElementById("weatherTemperature").textContent =
    `${Math.round(current.temperature_2m)}°C`;

  document.getElementById("weatherFeelsLike").textContent =
    `${Math.round(current.apparent_temperature)}°C`;

  document.getElementById("weatherHumidity").textContent =
    `${current.relative_humidity_2m}%`;

  document.getElementById("weatherWind").textContent =
    `${Math.round(current.wind_speed_10m)} km/h`;

  // Use the location's own local time from the API.
  const hourly = document.getElementById("hourlyForecast");

  hourly.replaceChildren();

  const futureIndexes = data.hourly.time
    .map((time, index) => ({ time, index }))
    .filter(item => item.time >= current.time)
    .slice(0, 5);

  futureIndexes.forEach(({ time, index }) => {
    const [hourDescription, hourIcon] =
      weatherDescription(data.hourly.weather_code[index]);

    const item = document.createElement("div");
    item.className = "hour-item";

    const hour = document.createElement("span");
    hour.textContent = time.slice(11, 16);

    const symbol = document.createElement("span");
    symbol.textContent = hourIcon;
    symbol.setAttribute("aria-label", hourDescription);

    const temperature = document.createElement("strong");
    temperature.textContent =
      `${Math.round(data.hourly.temperature_2m[index])}°`;

    item.append(hour, symbol, temperature);
    hourly.append(item);
  });

  document.getElementById("weatherCard").hidden = false;

  setStatus(
    document.getElementById("weatherMessage"),
    `Updated weather for ${cityLabel}.`
  );
}

// ========================================
// WEATHER PAGE INITIALISATION
// ========================================

function initialiseWeather() {
  const weatherForm = document.getElementById("weatherForm");

  if (!weatherForm) return;

  const weatherCity = document.getElementById("weatherCity");
  const weatherMessage = document.getElementById("weatherMessage");
  const weatherCard = document.getElementById("weatherCard");

  async function searchWeather(city) {
    setStatus(
      weatherMessage,
      "Looking up the city and fetching weather…"
    );

    weatherCard.hidden = true;

    try {
      const place = await geocodeCity(city);
      const data = await getWeather(place);

      displayWeather(place, data);
    } catch (error) {
      setStatus(
        weatherMessage,
        error.message || "Something went wrong.",
        true
      );
    }
  }

  weatherForm.addEventListener("submit", event => {
    event.preventDefault();

    const city = weatherCity.value.trim();

    if (city) {
      searchWeather(city);
    }
  });

  searchWeather(weatherCity.value.trim() || "Amsterdam");
}

// ========================================
// REAL-WORLD MAP
// ========================================

function initialiseWorldMap() {
  const mapElement = document.getElementById("worldMap");

  if (!mapElement) return;

  const mapMessage = document.getElementById("mapMessage");

  if (!window.L) {
    setStatus(
      mapMessage,
      "The map library did not load. Check your internet connection and refresh.",
      true
    );
    return;
  }

  const worldMap = L.map(mapElement).setView(
    [52.3676, 4.9041],
    6
  );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }
  ).addTo(worldMap);

  const cityMarker = L.marker([
    52.3676,
    4.9041
  ])
    .addTo(worldMap)
    .bindPopup("Amsterdam")
    .openPopup();

  setStatus(
    mapMessage,
    "Map ready. Search for a city to explore."
  );

  const mapSearchForm =
    document.getElementById("mapSearchForm");

  const mapCity = document.getElementById("mapCity");

  if (!mapSearchForm || !mapCity) return;

  mapSearchForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = mapCity.value.trim();

    if (!city) return;

    setStatus(mapMessage, "Searching for the location…");

    try {
      const place = await geocodeCity(city);

      const coordinates = [
        place.latitude,
        place.longitude
      ];

      const label = [
        place.name,
        place.admin1,
        place.country
      ]
        .filter(Boolean)
        .join(", ");

      worldMap.flyTo(coordinates, 11, {
        duration: 1.2
      });

      cityMarker
        .setLatLng(coordinates)
        .bindPopup(label)
        .openPopup();

      setStatus(mapMessage, `Showing ${label}.`);
    } catch (error) {
      setStatus(
        mapMessage,
        error.message || "Couldn't find that place.",
        true
      );
    }
  });

  // Make sure Leaflet calculates the correct map size.
  setTimeout(() => worldMap.invalidateSize(), 100);
}

// ========================================
// LOAD LEAFLET ONLY WHEN THE WORLD MAP EXISTS
// ========================================

function loadLeaflet() {
  const mapElement = document.getElementById("worldMap");

  if (!mapElement) return;

  if (window.L) {
    initialiseWorldMap();
    return;
  }

  const leafletScript = document.createElement("script");

  leafletScript.src =
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

  leafletScript.integrity =
    "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";

  leafletScript.crossOrigin = "";

  leafletScript.onload = initialiseWorldMap;

  leafletScript.onerror = () => {
    setStatus(
      document.getElementById("mapMessage"),
      "Couldn't load the map library. Check your internet connection and refresh.",
      true
    );
  };

  document.head.append(leafletScript);
}

// ========================================
// START FEATURES FOR THE CURRENT PAGE
// ========================================

initialiseWeather();
loadLeaflet();
