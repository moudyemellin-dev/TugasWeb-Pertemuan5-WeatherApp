const WEATHER_FUNCTION_URL =
    "/.netlify/functions/weather";

// ==============================
// DOM ELEMENTS
// ==============================

const searchHistory = document.querySelector("#searchHistory");

const clearHistoryBtn = document.querySelector("#clearHistoryBtn");

let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

const form = document.querySelector("#searchForm");
const input = document.querySelector("#cityInput");

const loading = document.querySelector("#loading");
const errorBox = document.querySelector("#error");
const result = document.querySelector("#weatherResult");

const cityName = document.querySelector("#cityName");
const weatherIcon = document.querySelector("#weatherIcon");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feelsLike");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");

const windSpeed = document.querySelector("#windSpeed");
const forecastSection = document.querySelector("#forecastSection");
const forecastList = document.querySelector("#forecastList");

const celsiusBtn = document.querySelector("#celsiusBtn");
const fahrenheitBtn = document.querySelector("#fahrenheitBtn");

let currentTempCelsius = null;
let currentFeelsLikeCelsius = null;
let currentForecastData = [];

// ==============================
// LOADING
// ==============================

const showLoading = () => {
    loading.classList.remove("hidden");
    errorBox.classList.add("hidden");
    result.classList.add("hidden");
};

const hideLoading = () => {
    loading.classList.add("hidden");
};


// ==============================
// ERROR
// ==============================

const showError = (message) => {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
    result.classList.add("hidden");
};


// ==============================
// DISPLAY WEATHER
// ==============================

const renderHistory = () => {
    searchHistory.innerHTML = "";

    history.map(city => {
        const button = document.createElement("button");

        button.className = "history-item";
        button.textContent = city;

        button.addEventListener("click", () => {
            input.value = city;
            getWeather(city);
        });

        searchHistory.appendChild(button);
    });
};

const saveHistory = (city) => {
    const cityName = city.trim();

    if (!history.includes(cityName)) {
        history.push(cityName);

        localStorage.setItem(
            "weatherHistory",
            JSON.stringify(history)
        );
    }

    renderHistory();
};

const displayWeather = (data) => {

    // Destructuring ES6+
    const {
    name,
    main: { temp, feels_like: feelsLikeValue, humidity: humidityValue },
    weather,
    wind: { speed }
} = data;

    // Array method: map()
    const weatherDescriptions = weather.map(
        item => item.description
    );

    const icon = weather[0].icon;
    const weatherMain = weather[0].main.toLowerCase();

    cityName.textContent = name;

    currentTempCelsius = temp;
currentFeelsLikeCelsius = feelsLikeValue;


temperature.textContent =
    `${Math.round(currentTempCelsius)}°C`;

feelsLike.textContent =
    `Terasa Seperti: ${Math.round(feelsLikeValue)}°C`;

celsiusBtn.classList.add("active");
fahrenheitBtn.classList.remove("active");

    description.textContent =
        weatherDescriptions.join(", ");

    humidity.textContent =
        `Kelembaban: ${humidityValue}%`;

        windSpeed.textContent = `Kecepatan Angin: ${speed} m/s`;
        
    weatherIcon.src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherIcon.alt =
        `Ikon cuaca ${weatherDescriptions.join(", ")}`;

        document.body.className = "";

if (weatherMain === "clear") {
    document.body.classList.add("weather-clear");
} else if (weatherMain === "clouds") {
    document.body.classList.add("weather-clouds");
} else if (weatherMain === "rain") {
    document.body.classList.add("weather-rain");
} else if (weatherMain === "drizzle") {
    document.body.classList.add("weather-drizzle");
} else if (weatherMain === "thunderstorm") {
    document.body.classList.add("weather-thunderstorm");
} else if (
    weatherMain === "mist" ||
    weatherMain === "fog" ||
    weatherMain === "haze"
) {
    document.body.classList.add("weather-mist");
} else if (weatherMain === "snow") {
    document.body.classList.add("weather-snow");
}

    result.classList.remove("hidden");
};


// ==============================
// FETCH WEATHER
// ==============================

const getWeather = async (city) => {

    try {

        if (!city || city.trim() === "") {
            throw new Error(
                "Nama kota tidak boleh kosong."
            );
        }

        if (!navigator.onLine) {
    throw new Error("Network error. Periksa koneksi internet Anda.");
}

        showLoading();

        const url =
    `${WEATHER_FUNCTION_URL}?city=${encodeURIComponent(city)}&type=weather`;

        const response = await fetch(url);


        // Kota tidak ditemukan
        if (response.status === 404) {
            throw new Error(
                `Kota "${city}" tidak ditemukan.`
            );
        }


        // Error server lainnya
        if (!response.ok) {
            throw new Error(
                `Terjadi kesalahan server (${response.status}).`
            );
        }


        const data = await response.json();

        displayWeather(data);
saveHistory(data.name);
getForecast(data.name);

    } catch (error) {

        // Network error
        if (error instanceof TypeError) {
            showError(
                "Network error. Periksa koneksi internet Anda."
            );
        } else {
            showError(error.message);
        }

    } finally {

        hideLoading();

    }
};

const getForecast = async (city) => {
    try {
       const url =
    `${WEATHER_FUNCTION_URL}?city=${encodeURIComponent(city)}&type=forecast`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Gagal mengambil data prakiraan cuaca.");
        }

        const data = await response.json();

        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        ).slice(0, 5);
        currentForecastData = dailyForecast;

        forecastList.innerHTML = "";

        dailyForecast.forEach(item => {
            const date = new Date(item.dt_txt);

            const dayName = date.toLocaleDateString("id-ID", {
                weekday: "short"
            });

            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;
            const description = item.weather[0].description;

            const card = document.createElement("div");
            card.className = "forecast-card";

            card.innerHTML = `
                <p><strong>${dayName}</strong></p>

                <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="${description}"
                >

                <p class="forecast-temp">${temp}°C</p>

                <p>${description}</p>
            `;

            forecastList.appendChild(card);
        });

        forecastSection.classList.remove("hidden");

    } catch (error) {
        console.error("Forecast error:", error.message);
    }
};

// ==============================
// FORM EVENT
// ==============================

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const city = input.value.trim();

    getWeather(city);

});


celsiusBtn.addEventListener("click", () => {
    if (currentTempCelsius === null) return;

    temperature.textContent =
        `${Math.round(currentTempCelsius)}°C`;

    feelsLike.textContent =
        `Terasa Seperti: ${Math.round(currentFeelsLikeCelsius)}°C`;

        const forecastTemps = document.querySelectorAll(".forecast-temp");

forecastTemps.forEach((element, index) => {
    const tempCelsius = currentForecastData[index].main.temp;

    element.textContent =
        `${Math.round(tempCelsius)}°C`;
});

    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
});


fahrenheitBtn.addEventListener("click", () => {
    if (currentTempCelsius === null) return;

    const fahrenheit =
        (currentTempCelsius * 9 / 5) + 32;

    const feelsLikeFahrenheit =
        (currentFeelsLikeCelsius * 9 / 5) + 32;
        
        const forecastTemps = document.querySelectorAll(".forecast-temp");

forecastTemps.forEach((element, index) => {
    const tempCelsius = currentForecastData[index].main.temp;
    const tempFahrenheit = (tempCelsius * 9 / 5) + 32;

    element.textContent =
        `${Math.round(tempFahrenheit)}°F`;
});

    temperature.textContent =
        `${Math.round(fahrenheit)}°F`;

    feelsLike.textContent =
        `Terasa Seperti: ${Math.round(feelsLikeFahrenheit)}°F`;

    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
});

clearHistoryBtn.addEventListener("click", () => {
    const confirmDelete = confirm(
        "Yakin ingin menghapus semua riwayat pencarian?"
    );

    if (confirmDelete) {
        history = [];
        localStorage.removeItem("weatherHistory");
        renderHistory();
    }
});

renderHistory();