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
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let today = `${day} ${hours}:${minutes}`;
  return today;
}

let dayAndTime = document.querySelector("#day-and-time");
dayAndTime.innerHTML = showCurrentDate();

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
    let weatherDescriptionData = document.querySelector("#temp-description");
    weatherDescriptionData.innerHTML = response.data.weather[0].description;
  });
  let temperature = searchByType(city);
  temperature.then(function (response) {
    let currentTempData = document.querySelector("#current-temp");
    currentTempData.innerHTML = response.data.main.temp;
  });
  let weatherSymbol = searchByType (city);
    weatherSymbol.then(function(response){
    let weatherSymbolData = document.querySelector("#weather-symbol-data");
    weatherSymbolData.innerHTML = response.data.weather[0].icon;
    })
  let humidity = searchByType(city);
  humidity.then(function (response) {
    let humidityData = document.querySelector("#humidity-data");
    humidityData.innerHTML = response.data.main.humidity;
  });
  let windSpeed = searchByType(city);
  windSpeed.then(function (response) {
    let windSpeedData = document.querySelector("#wind-speed");
    if (units === "metric") {
      windSpeedData.innerHTML = response.data.wind.speed + " m/s";
    } else {
      windSpeedData.innerHTML = response.data.wind.speed + " mph";
    }
  });
}

function showCelcius(event) {
  event.preventDefault();
  units = "metric";
  updatePage();
}

let ctemp = document.querySelector("#c-temp");
ctemp.addEventListener("click", showCelcius);

function showFarenheit(event) {
  event.preventDefault();
  units = "imperial";
  updatePage();
}
let ftemp = document.querySelector("#f-temp");
ftemp.addEventListener("click", showFarenheit);

function displayCity() {
  let searchedCity = document.querySelector("#city");
  searchedCity.innerHTML = FormData;
  searchedCity.addEventListener("click", displayCity);
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
}

function search(city) {
  //let units = metric;
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
function ShowPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "9fba0552270644ffade53d9ab23b2ddc";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  axios.get(apiURL).then(showCurrentCity);
}
function showCurrentCity(response) {
  let inp = document.querySelector("#search-text-input");
  inp.value = response.data.name;
  updatePage();
}
let btn = document.querySelector("#current-location");
btn.addEventListener("click", getCurrentLocation);

let units = "metric";

let inp = document.querySelector("#search-text-input");
inp.value = "New York";
updatePage();
