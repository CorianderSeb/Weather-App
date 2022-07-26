function showCurrentDate() {
  let now = new Date();
  let weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekday[now.getDay()];
  let hours = now.getHours();
  if (hours > 12) {
    hours= hours-12
  }
  else if (hours==0) {
    hours=12
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let today = `${day} ${hours}:${minutes}`;
  return today;
}

let dayAndTime = document.querySelector("#day-and-time");
dayAndTime.innerHTML = showCurrentDate();

function formatDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[day];
}

function searchTextInput(event) {
  event.preventDefault();
  updatePage();
}

function updatePage() {
  let h1 = document.querySelector(".city");
  let inp = document.querySelector("#search-text-input");
  h1.innerHTML = inp.value;
  getWeatherConditions(inp.value);
}

let form = document.querySelector("form");
form.addEventListener("submit", searchTextInput);

function getWeatherConditions(city) {
  let weatherDescription = searchByType(city);
  weatherDescription.then(function (response) {
    getForecast(response.data.coord);

    let weatherDescriptionData = document.querySelector("#temp-description");
    weatherDescriptionData.innerHTML = response.data.weather[0].description;
  });
  let temperature = searchByType(city);
  temperature.then(function (response) {
    let currentTempData = document.querySelector("#current-temp");
    currentTempData.innerHTML = Math.round(response.data.main.temp);
  });
  let weatherSymbol = searchByType(city);
  weatherSymbol.then(function (response) {
    let weatherSymbolData = document.querySelector("#weather-symbol-data");
    weatherSymbolData.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    weatherSymbolData.setAttribute("alt", response.data.weather[0].description);
  });
  let humidity = searchByType(city);
  humidity.then(function (response) {
    let humidityData = document.querySelector("#humidity-data");
    humidityData.innerHTML = response.data.main.humidity;
  });
  let windSpeed = searchByType(city);
  windSpeed.then(function (response) {
    let windSpeedData = document.querySelector("#wind-speed");
    if (units === "meric") {
      windSpeedData.innerHTML = Math.round(response.data.wind.speed) + " km/h";
    } else {
      windSpeedData.innerHTML = Math.round(response.data.wind.speed) + " mph";
    }
  });
}

function showFarenheit(event) {
  event.preventDefault();
  units = "imperial";
  ctemp.classList.remove("active");
  ftemp.classList.add("active");
  updatePage();
}
let ftemp = document.querySelector("#f-temp");
ftemp.addEventListener("click", showFarenheit);

function displayCity() {
  let searchedCity = document.querySelector("#city");
  searchedCity.innerHTML = FormData;
  searchedCity.addEventListener("click", displayCity);
}
function getForecast(coordinates) {
  let units = "imperial";
  let apiKey = "9fba0552270644ffade53d9ab23b2ddc";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(showForecast);
}
function displayWeatherInfo(response) {
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#temp-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity-data").innerHTML =
    response.data.main.humidity;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "9fba0552270644ffade53d9ab23b2ddc";
  let urlEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=`;
  let apiUrl = `${urlEndpoint}${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherInfo);
}

function searchByType(city) {
  let apiKey = "9fba0552270644ffade53d9ab23b2ddc";
  let urlEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=`;
  let apiUrl = `${urlEndpoint}${city}&appid=${apiKey}&units=${units}`;
  return axios.get(apiUrl);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(ShowPosition);
}
//why is there an error here?
function showForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  
  let forecastHTML = '<div class="row">';
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col" id="weather-forecast">
      <div class="card">
      <ul class="div-ul">
        <div class="card-title">${formatDays(forecastDay.dt)}</li>
        <img src= "http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"/>
        <div class="card-text">${Math.round(forecastDay.temp.max)}°F</li>
        <span class="card-texts">${Math.round(forecastDay.temp.min)}°F</li>
        </ul>
      </div>
    </div>
     `;
  }});
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function ShowPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "9fba0552270644ffade53d9ab23b2ddc";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  axios.get(apiURL).then(showCurrentCity);
;
}
function showCurrentCity(response) {
  let inp = document.querySelector("#search-text-input");
  inp.value = response.data.name;
  updatePage();
}

let units = "imperial";
let inp = document.querySelector("#search-text-input");
inp.value = "New York";
updatePage();

let btn = document.querySelector("#current-location");
btn.addEventListener("click", getCurrentLocation);
btn.click();



