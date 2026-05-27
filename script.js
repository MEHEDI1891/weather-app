
const WEATHER_API_KEY = 'ae9d12a1a22c0780198b93e15473b584';
const NEWS_API_KEY = '3cd9e80c850b047f1dfd28b6d233b9fa'; 


const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('error-msg');
const weatherDisplay = document.getElementById('weather-display');

const cityElement = document.getElementById('city-name');
const timeElement = document.getElementById('local-time');
const tempElement = document.getElementById('temperature');
const iconElement = document.getElementById('weather-icon');
const conditionElement = document.getElementById('condition');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind-speed');
const sunriseElement = document.getElementById('sunrise');

const btnC = document.getElementById('btn-c');
const btnF = document.getElementById('btn-f');
const suggestedContainer = document.getElementById('suggested-cities');
const forecastContainer = document.getElementById('forecast-container');
const newsContainer = document.getElementById('news-container');
const bgVideo = document.getElementById('bg-video');


let currentCity = 'Dhaka'; 
let currentUnit = 'metric'; 


document.addEventListener('DOMContentLoaded', () => {
    loadSuggestedCities();
    fetchWeather(currentCity);
    fetchNews();
});


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        currentCity = city;
        fetchWeather(city);
        saveRecentSearch(city);
        searchInput.value = '';
    }
});

btnC.addEventListener('click', () => switchUnit('metric'));
btnF.addEventListener('click', () => switchUnit('imperial'));

function switchUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        btnC.classList.toggle('active', unit === 'metric');
        btnF.classList.toggle('active', unit === 'imperial');
        fetchWeather(currentCity);
    }
}


async function fetchWeather(city) {
    showLoader();
    try {
        // Fetch Current Weather
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${WEATHER_API_KEY}`);
        if (!weatherRes.ok) throw new Error('City not found');
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${WEATHER_API_KEY}`);
        const forecastData = await forecastRes.json();

        updateWeatherUI(weatherData);
        updateForecastUI(forecastData.list);
        updateBackgroundVideo(weatherData.weather[0].main);
        
        hideLoader();
    } catch (error) {
        showError();
        console.error("Weather Fetch Error:", error);
    }
}


function updateWeatherUI(data) {
    cityElement.textContent = `${data.name}, ${data.sys.country}`;
    tempElement.textContent = Math.round(data.main.temp);
    conditionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    
    const windSpeed = currentUnit === 'metric' ? Math.round(data.wind.speed * 3.6) + ' km/h' : Math.round(data.wind.speed) + ' mph';
    windElement.textContent = windSpeed;

    iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    const timezoneOffset = data.timezone;
    updateLocalTime(timezoneOffset);

    const sunriseTime = new Date((data.sys.sunrise + timezoneOffset) * 1000);
    sunriseElement.textContent = sunriseTime.toUTCString().match(/(\d{2}:\d{2})/)[0];
}

function updateForecastUI(list) {
    forecastContainer.innerHTML = '';
    const nextHours = list.slice(1, 7); 

    nextHours.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;

        const card = document.createElement('div');
        card.className = 'forecast-card glass-sm';
        card.innerHTML = `
            <span>${time}</span>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
            <span>${temp}°</span>
        `;
        forecastContainer.appendChild(card);
    });
}


async function fetchNews() {
    try {
const res = await fetch(`https://gnews.io/api/v4/search?q=weather%20OR%20climate&lang=en&max=5&apikey=${3cd9e80c850b047f1dfd28b6d233b9fa}`);
        const data = await res.json();
        
        if (data.articles) {
            newsContainer.innerHTML = '';
            data.articles.forEach(article => {
                const card = document.createElement('div');
                card.className = 'news-card glass-sm';
                card.innerHTML = `
                    <img src="${article.image}" alt="News Image" onerror="this.src='https://via.placeholder.com/300x150/222/fff?text=Weather+News'">
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read more <i class="fa-solid fa-arrow-right"></i></a>
                `;
                newsContainer.appendChild(card);
            });
        }
    } catch (error) {
        newsContainer.innerHTML = '<p>Unable to load news at this moment.</p>';
        console.error("News Fetch Error:", error);
    }
}

// Utility: Calculate exact local time
function updateLocalTime(offsetSeconds) {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (3600000 * (offsetSeconds / 3600)));
    
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    timeElement.textContent = localDate.toLocaleDateString('en-US', options);
}

function updateBackgroundVideo(condition) {
   
    let videoSrc = 'rain.mp4'; 
    const c = condition.toLowerCase();
    
    if(c.includes('rain') || c.includes('drizzle')) videoSrc = 'rain.mp4';
    else if(c.includes('cloud')) videoSrc = 'clouds.mp4';
    else if(c.includes('clear')) videoSrc = 'clear.mp4';
    else if(c.includes('snow')) videoSrc = 'snow.mp4';
    else if(c.includes('thunderstorm')) videoSrc = 'thunder.mp4';

   
    if (!bgVideo.src.includes(videoSrc)) {
       
    }
}


function loadSuggestedCities() {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || ['Tokyo', 'London', 'Dubai', 'New York'];
    renderCities(cities);
}

function saveRecentSearch(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || ['Tokyo', 'London', 'Dubai', 'New York'];
    if (!cities.includes(city)) {
        cities.unshift(city);
        if (cities.length > 4) cities.pop(); // Keep only last 4
        localStorage.setItem('recentCities', JSON.stringify(cities));
        renderCities(cities);
    }
}

function renderCities(cities) {
    suggestedContainer.innerHTML = '';
    cities.forEach(city => {
        const chip = document.createElement('div');
        chip.className = 'city-chip glass-sm';
        chip.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${city}`;
        chip.addEventListener('click', () => {
            searchInput.value = city;
            searchForm.dispatchEvent(new Event('submit'));
        });
        suggestedContainer.appendChild(chip);
    });
}


function showLoader() {
    loader.classList.remove('hidden');
    errorMsg.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');
}

function showError() {
    loader.classList.add('hidden');
    errorMsg.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
}
