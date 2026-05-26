async function getWeather() {

    const city = document.getElementById("city").value;

    const apiKey = "ae9d12a1a22c0780198b93e15473b584";

    const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        console.log(data);

        if (data.cod == "404") {

            document.getElementById("weatherResult").innerHTML =
            `
            <h2>City Not Found</h2>
            `;

            return;
        }

        document.getElementById("weatherResult").innerHTML =
        `
        <div class="weather-card">

            <h1>${data.name}</h1>

            <h2>${data.main.temp}°C</h2>

            <h3>${data.weather[0].main}</h3>

            <p>${data.weather[0].description}</p>

            <p>Humidity: ${data.main.humidity}%</p>

            <p>Wind Speed: ${data.wind.speed} KM/H</p>

        </div>
        `;

    } catch (error) {

        console.log(error);

        document.getElementById("weatherResult").innerHTML =
        `
        <h2>Something Went Wrong</h2>
        `;
    }
}

/* Country Quick Select */

function setCity(cityName){

    document.getElementById("city").value = cityName;

    getWeather();
