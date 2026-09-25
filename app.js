const WEATHER_FUNCTION_URL =
    "/.netlify/functions/weather";


// ==========================
// DOM ELEMENT
// ==========================

const form =
    document.querySelector("#searchForm");

const input =
    document.querySelector("#cityInput");

const loading =
    document.querySelector("#loading");

const errorBox =
    document.querySelector("#error");

const result =
    document.querySelector("#weatherResult");

const cityName =
    document.querySelector("#cityName");

const weatherIcon =
    document.querySelector("#weatherIcon");

const temperature =
    document.querySelector("#temperature");

const feelsLike =
    document.querySelector("#feelsLike");

const description =
    document.querySelector("#description");

const humidity =
    document.querySelector("#humidity");

const windSpeed =
    document.querySelector("#windSpeed");

const celsiusBtn =
    document.querySelector("#celsiusBtn");

const fahrenheitBtn =
    document.querySelector("#fahrenheitBtn");

const forecastSection =
    document.querySelector("#forecastSection");

const forecastList =
    document.querySelector("#forecastList");

const searchHistory =
    document.querySelector("#searchHistory");

const clearHistoryBtn =
    document.querySelector("#clearHistoryBtn");


// ==========================
// DATA
// ==========================

let currentTempCelsius = null;

let currentFeelsLikeCelsius = null;

let currentForecastData = [];

let currentUnit = "C";

let history =
    JSON.parse(
        localStorage.getItem("weatherHistory")
    ) || [];


// ==========================
// LOADING
// ==========================

const showLoading = () => {

    loading.classList.remove("hidden");

    errorBox.classList.add("hidden");

    result.classList.add("hidden");

    forecastSection.classList.add("hidden");
};


const hideLoading = () => {

    loading.classList.add("hidden");
};


// ==========================
// ERROR
// ==========================

const showError = (message) => {

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

    result.classList.add("hidden");

    forecastSection.classList.add("hidden");
};


// ==========================
// TEMPERATURE
// ==========================

const convertToFahrenheit = (celsius) => {

    return (celsius * 9 / 5) + 32;
};


const renderCurrentTemperature = () => {

    if (
        currentTempCelsius === null ||
        currentFeelsLikeCelsius === null
    ) {
        return;
    }


    if (currentUnit === "C") {

        temperature.textContent =
            `${Math.round(currentTempCelsius)}°C`;

        feelsLike.textContent =
            `Terasa seperti ${Math.round(currentFeelsLikeCelsius)}°C`;

    } else {

        const tempFahrenheit =
            convertToFahrenheit(
                currentTempCelsius
            );

        const feelsFahrenheit =
            convertToFahrenheit(
                currentFeelsLikeCelsius
            );

        temperature.textContent =
            `${Math.round(tempFahrenheit)}°F`;

        feelsLike.textContent =
            `Terasa seperti ${Math.round(feelsFahrenheit)}°F`;
    }
};


// ==========================
// BACKGROUND
// ==========================

const applyWeatherBackground = (weatherMain) => {

    const weatherClasses = [
        "weather-clear",
        "weather-clouds",
        "weather-rain",
        "weather-drizzle",
        "weather-thunderstorm",
        "weather-mist",
        "weather-snow"
    ];


    document.body.classList.remove(
        ...weatherClasses
    );


    const weather =
        weatherMain.toLowerCase();


    if (weather === "clear") {

        document.body.classList.add(
            "weather-clear"
        );

    } else if (weather === "clouds") {

        document.body.classList.add(
            "weather-clouds"
        );

    } else if (weather === "rain") {

        document.body.classList.add(
            "weather-rain"
        );

    } else if (weather === "drizzle") {

        document.body.classList.add(
            "weather-drizzle"
        );

    } else if (
        weather === "mist" ||
        weather === "fog" ||
        weather === "haze"
    ) {

        document.body.classList.add(
            "weather-mist"
        );

    } else if (
        weather === "thunderstorm"
    ) {

        document.body.classList.add(
            "weather-thunderstorm"
        );

    } else if (weather === "snow") {

        document.body.classList.add(
            "weather-snow"
        );
    }
};


// ==========================
// DISPLAY WEATHER
// ==========================

const displayWeather = (data) => {

    const {
        name,

        main: {
            temp,
            feels_like: feelsLikeValue,
            humidity: humidityValue
        },

        weather,

        wind: {
            speed
        }

    } = data;


    const weatherDescriptions =
        weather.map(
            item => item.description
        );


    const icon =
        weather[0].icon;


    currentTempCelsius =
        temp;

    currentFeelsLikeCelsius =
        feelsLikeValue;


    cityName.textContent =
        name;


    renderCurrentTemperature();


    description.textContent =
        weatherDescriptions.join(", ");


    humidity.textContent =
        `${humidityValue}%`;


    windSpeed.textContent =
        `${speed} m/s`;


    weatherIcon.src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;


    weatherIcon.alt =
        `Ikon cuaca ${weatherDescriptions.join(", ")}`;


    applyWeatherBackground(
        weather[0].main
    );


    result.classList.remove("hidden");
};


// ==========================
// HISTORY
// ==========================

const renderHistory = () => {

    searchHistory.innerHTML = "";


    history.forEach(city => {

        const button =
            document.createElement("button");


        button.className =
            "history-item";


        button.type =
            "button";


        button.textContent =
            city;


        button.addEventListener(
            "click",
            () => {

                input.value =
                    city;

                getWeather(city);
            }
        );


        searchHistory.appendChild(
            button
        );
    });
};


const saveHistory = (city) => {

    const normalizedCity =
        city.trim();


    const cityAlreadyExists =
        history.some(
            item =>
                item.toLowerCase() ===
                normalizedCity.toLowerCase()
        );


    if (!cityAlreadyExists) {

        history.unshift(
            normalizedCity
        );


        history =
            history.slice(0, 8);


        localStorage.setItem(
            "weatherHistory",
            JSON.stringify(history)
        );
    }


    renderHistory();
};


// ==========================
// FORECAST
// ==========================

const renderForecast = () => {

    forecastList.innerHTML = "";


    currentForecastData.forEach(item => {

        const date =
            new Date(item.dt_txt);


        const dayName =
            date.toLocaleDateString(
                "id-ID",
                {
                    weekday: "short"
                }
            );


        const dateText =
            date.toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "short"
                }
            );


        const tempCelsius =
            item.main.temp;


        const displayedTemp =
            currentUnit === "C"
                ? tempCelsius
                : convertToFahrenheit(
                    tempCelsius
                );


        const unit =
            currentUnit === "C"
                ? "°C"
                : "°F";


        const icon =
            item.weather[0].icon;


        const desc =
            item.weather[0].description;


        const card =
            document.createElement("div");


        card.className =
            "forecast-card";


        card.innerHTML = `
            <p class="forecast-day">
                ${dayName}
            </p>

            <p class="forecast-date">
                ${dateText}
            </p>

            <img
                src="https://openweathermap.org/img/wn/${icon}@2x.png"
                alt="${desc}"
            >

            <p class="forecast-temp">
                ${Math.round(displayedTemp)}${unit}
            </p>

            <p class="forecast-desc">
                ${desc}
            </p>
        `;


        forecastList.appendChild(
            card
        );
    });


    if (
        currentForecastData.length > 0
    ) {

        forecastSection.classList.remove(
            "hidden"
        );
    }
};


const getForecast = async (city) => {

    try {

        const url =
            `${WEATHER_FUNCTION_URL}?city=${encodeURIComponent(city)}&type=forecast`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Gagal mengambil data perkiraan cuaca."
            );
        }


        const data =
            await response.json();


        const dailyForecast =
            data.list
                .filter(
                    item =>
                        item.dt_txt.includes(
                            "12:00:00"
                        )
                )
                .slice(0, 5);


        currentForecastData =
            dailyForecast;


        renderForecast();


    } catch (error) {

        console.error(
            "Forecast error:",
            error.message
        );


        forecastSection.classList.add(
            "hidden"
        );
    }
};


// ==========================
// GET WEATHER
// ==========================

const getWeather = async (city) => {

    try {

        if (
            !city ||
            city.trim() === ""
        ) {

            throw new Error(
                "Nama kota tidak boleh kosong."
            );
        }


        showLoading();


        const url =
            `${WEATHER_FUNCTION_URL}?city=${encodeURIComponent(city)}&type=weather`;


        const response =
            await fetch(url);


        if (
            response.status === 404
        ) {

            throw new Error(
                `Kota "${city}" tidak ditemukan.`
            );
        }


        if (!response.ok) {

            throw new Error(
                `Terjadi kesalahan server (${response.status}).`
            );
        }


        const data =
            await response.json();


        displayWeather(data);


        saveHistory(
            data.name
        );


        await getForecast(
            data.name
        );


    } catch (error) {

        if (
            error instanceof TypeError
        ) {

            showError(
                "Network error. Periksa koneksi internet Anda."
            );

        } else {

            showError(
                error.message
            );
        }


    } finally {

        hideLoading();
    }
};


// ==========================
// FORM
// ==========================

form.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const city =
            input.value.trim();


        getWeather(city);
    }
);


// ==========================
// UNIT TOGGLE
// ==========================

celsiusBtn.addEventListener(
    "click",
    () => {

        currentUnit = "C";


        celsiusBtn.classList.add(
            "active"
        );


        fahrenheitBtn.classList.remove(
            "active"
        );


        renderCurrentTemperature();


        if (
            currentForecastData.length > 0
        ) {

            renderForecast();
        }
    }
);


fahrenheitBtn.addEventListener(
    "click",
    () => {

        currentUnit = "F";


        fahrenheitBtn.classList.add(
            "active"
        );


        celsiusBtn.classList.remove(
            "active"
        );


        renderCurrentTemperature();


        if (
            currentForecastData.length > 0
        ) {

            renderForecast();
        }
    }
);


// ==========================
// CLEAR HISTORY
// ==========================

clearHistoryBtn.addEventListener(
    "click",
    () => {

        if (
            history.length === 0
        ) {

            return;
        }


        const confirmDelete =
            confirm(
                "Yakin ingin menghapus semua riwayat pencarian?"
            );


        if (confirmDelete) {

            history = [];


            localStorage.removeItem(
                "weatherHistory"
            );


            renderHistory();
        }
    }
);


// ==========================
// INITIAL
// ==========================

renderHistory();
