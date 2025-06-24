const API_KEY = "YOUR API KEY"

function handleFormSubmit(event) {
  //handle submit event
}

function fetchCurrentWeather(city) {
  //fetch current weather based on city
}

function displayCurrentWeather(json) {
  //render current weather data to the DOM using provided IDs and json from API
}


function fetchFiveDayForecast(city) {
  //fetch five day forecast data based on city
}

function displayFiveDayForecast(json) {
  //render five day forecast data to the DOM using provided IDs and json from API
}

function createChart(json) {
  //Bonus: render temperature chart using five day forecast data and ChartJS
}

document.addEventListener('DOMContentLoaded', function() {
  //add event listener here for form submission
})
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = document.querySelector("#cityInput").value.trim().replace(/\s+/g, "+");
  const apiKey = "YOUR_API_KEY"; // Replace with your actual API key

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    console.log(data);

    // Update DOM with current weather
    document.querySelector("#temp").textContent = data.main.temp + "°C";
    document.querySelector("#humidity").textContent = data.main.humidity + "%";
    document.querySelector("#description").textContent = data.weather[0].description;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
});
const fetchForecast = async (city, apiKey) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await res.json();

  const aside = document.querySelector("aside");
  aside.innerHTML = ""; // Clear previous results

  data.list.forEach((entry) => {
    const forecastDiv = document.createElement("div");
    forecastDiv.innerHTML = `
      <p><strong>${entry.dt_txt}</strong></p>
      <p>Temp: ${entry.main.temp}°C</p>
      <p>Humidity: ${entry.main.humidity}%</p>
    `;
    aside.appendChild(forecastDiv);
  });

  return data.list;
};
const labels = forecastList.map(entry => entry.dt_txt);
const temps = forecastList.map(entry => entry.main.temp);

const ctx = document.getElementById("forecastChart").getContext("2d");
new Chart(ctx, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Temperature (°C)",
      data: temps,
      borderColor: "blue",
      backgroundColor: "lightblue",
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Temperature (°C)" } }
    }
  }
});
