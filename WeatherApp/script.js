const apiKey = "b9dd322f7ce03f8bcdde71d1dc4c7212";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=kathmandu&appid=b9dd322f7ce03f8bcdde71d1dc4c7212&units=metric";
const timezoneApiUrl = "http://api.timezonedb.com/v2.1/get-time-zone";
const searchForm = document.querySelector(".search");
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const Icon = document.querySelector(".icon");
const defaultCity = "Hetauda";
let timezoneTimer = null;

async function checkWeather(city) {

  const weatherResponse = await fetch(weatherApiUrl + city + `&appid=${apiKey}`);

  if (weatherResponse.status === 404) {
    document.querySelector(".city").innerHTML = "City Not Found";
    document.querySelector(".temp").innerHTML = "";
    document.querySelector(".humidity").innerHTML = "";
    document.querySelector(".wind").innerHTML = "";
    Icon.src = "";
    document.querySelector(".error").innerHTML = "Invalid city name";
    return;
  }

  const weatherData = await weatherResponse.json();
  console.log(weatherData);

  const timezoneResponse = await fetch(`${timezoneApiUrl}?key=2EHN1OYDI3SX&format=json&by=position&lat=${weatherData.coord.lat}&lng=${weatherData.coord.lon}`);
  const timezoneData = await timezoneResponse.json();

  document.querySelector(".error").innerHTML = "";
  document.querySelector(".city").innerHTML = weatherData.name;
  document.querySelector(".temp").innerHTML = Math.round(weatherData.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = weatherData.main.humidity + "%";
  document.querySelector(".wind").innerHTML = Math.round(weatherData.wind.speed) + "km/h";

  if (weatherData.weather[0].main == "Clouds") {
    Icon.src = "clouds.png";
  } else if (weatherData.weather[0].main == "Clear") {
    Icon.src = "sunny.png";
  } else if (weatherData.weather[0].main == "Rain") {
    Icon.src = "rain.png";
  } else if (weatherData.weather[0].main == "Drizzle") {
    Icon.src = "drizzle.png";
  } else if (weatherData.weather[0].main == "Snow") {
    Icon.src = "snowy.png";
  } else if (weatherData.weather[0].main == "Mist") {
    Icon.src = "mist.png";
  }

  clearInterval(timezoneTimer);
  updateDateTime(timezoneData.zoneName);
  

 const weatherForData = {
  city: weatherData.name,
  temp: Math.round(weatherData.main.temp) + "°C",
  humidity: weatherData.main.humidity + "%",
  wind_speed: Math.round(weatherData.wind.speed) + "km/h",
  icon: weatherData.weather[0].main
 };

  fetch('store_weather_data.php', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(weatherForData)
 })
 .then(response => response.json())
 .then(result => {
   console.log(result);
 })
 .catch(error => {
   console.error('Error storing weather data:', error); 
 });

}


const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function updateDateTime(timezone) {
  const now = new Date();
  const locationTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  const dayName = daysOfWeek[locationTime.getDay()];
  const monthName = monthsOfYear[locationTime.getMonth()];
  const dayNum = locationTime.getDate();
  const year = locationTime.getFullYear();
  const hour = locationTime.getHours();
  const minutes = locationTime.getMinutes();
  const seconds = locationTime.getSeconds();
  const period = hour >= 12 ? "PM" : "AM";

  document.getElementById("dayname").textContent = dayName;
  document.getElementById("Month").textContent = monthName;
  document.getElementById("daynum").textContent = dayNum;
  document.getElementById("year").textContent = year;
  document.getElementById("hour").textContent = formatTime(hour);
  document.getElementById("minutes").textContent = formatTime(minutes);
  document.getElementById("seconds").textContent = formatTime(seconds);
  document.getElementById("period").textContent = period;

  timezoneTimer = setTimeout(() => updateDateTime(timezone), 1000);
}

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

checkWeather(defaultCity);

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchButton');
  const searchBox = document.getElementById('searchInput'); 

  searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
  });
});