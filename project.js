async function getWeather() {
    const cityInput = document.getElementById('city'),
        weatherDiv = document.getElementById('weather'),
        city = cityInput.value.trim();
    if (!city) {
        weatherDiv.innerHTML = '<p class="error-msg">⚠️ Please enter a city name.</p>';
        cityInput.focus(); return;
    } weatherDiv.innerHTML = '<p>Loading...</p>';
    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`), geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) { weatherDiv.innerHTML = `<p class="error-msg">⚠️ City "${city}" not found. Check the spelling and try again.</p>`; return; } const { latitude, longitude, name, country, timezone } = geoData.results[0], weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=${encodeURIComponent(timezone)}`), weatherData = await weatherRes.json(), cur = weatherData.current, description = getDescription(cur.weather_code); weatherDiv.innerHTML = `<div class="weather-city">${name}, ${country}</div><div class="weather-temp">${Math.round(cur.temperature_2m)}°C</div><div class="weather-desc">${description}</div><div class="weather-detail"><span>Feels Like</span><span>${Math.round(cur.apparent_temperature)}°C</span></div><div class="weather-detail"><span>Humidity</span><span>${cur.relative_humidity_2m}%</span></div><div class="weather-detail"><span>Wind</span><span>${Math.round(cur.wind_speed_10m)} km/h</span></div>`;
    } catch (error) { console.error(error); weatherDiv.innerHTML = '<p class="error-msg">⚠️ Could not fetch weather. Check your connection.</p>'; }
}
document.getElementById('city').addEventListener('keydown', e => { if (e.key === 'Enter') getWeather(); });
function getDescription(code) { const map = { 0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast', 45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain', 71: 'Light Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 77: 'Snow Grains', 80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers', 95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Thunderstorm w/ Hail' }; return map[code] || 'Unknown Conditions'; }