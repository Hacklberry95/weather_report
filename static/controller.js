async function getForecast() {
  let url = "http://localhost:8080/forecast"
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function getData() {
  let url = "http://localhost:8080/data"
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
function generateWeatherHtml(weather) {
  let date = new Date(weather.data.getTime());
  let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());
  let html = `<div class="col-md-2 card">
              <div>
                Place: ${weather.data.getPlace()} <br>
                Type: ${weather.data.getType()} <br>
                Unit: ${weather.data.getUnit()} <br>
                Value: ${weather.getValue()} <br>                                                   
                Time: ${hr}
              </div>
              <br>
            </div>`;
  return html;
}

function addZeroBefore(n) {
  return (n < 10 ? '0' : '') + n;
}

async function renderWeatherData(weatherList, containerSelector) {
  let htmlList = await Promise.all(weatherList.map(weather => generateWeatherHtml(weather)));
  let html = htmlList.join('');
  document.querySelector(containerSelector).innerHTML = html;
}

function filterByCityAndType(data, city, type = null) {
  let filteredData = data.filter(w => w.place.toLowerCase() == city.toLowerCase());
  if (type) {
    filteredData = filteredData.filter(w => w.type == type);
  }
  return filteredData;
}

function filterByDate(data, daysAgo = 1) {
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - daysAgo);
  return data.filter(w => new Date(w.time).getDate() == targetDate.getDate());
}

async function getCityWeather(city) {
  let cityWeather = await getData();
  let filteredWeather = filterByCityAndType(cityWeather, city);
  renderWeatherData(filteredWeather, ".row");
}

async function renderForecast(city) {
  let weatherForecasts = await getForecast();
  let filteredForecasts = filterByCityAndType(weatherForecasts, city);
  renderWeatherData(filteredForecasts, ".data");
}

async function getMinMaxTemp(city) {
  let weatherData = await getData();
  let tempData = filterByCityAndType(weatherData, city, "temperature");
  let previousDayData = filterByDate(tempData);

  let minTemp = previousDayData.map(element => element.getValue()).reduce((a, b) => Math.min(a, b));
  let maxTemp = previousDayData.map(element => element.getValue()).reduce((a, b) => Math.max(a, b));

  // ... continue with other logic, using helper functions where necessary.
}

async function latestData() {
  let weather = await getData();
  renderWeatherData(weather, ".row");
}

// async function getCityWeather(city) {
//     const cityWeather = await getData();
//     const cityData = cityWeather
//         .filter(data => data.place.toLowerCase() === city.toLowerCase())
//         .map(weatherData);

//     const html = cityData.map(cityWeather => {
//         const date = new Date(cityWeather.data.getTime());
//         const hr = `${date.getUTCHours()}:${addZeroBefore(date.getUTCMinutes())}`;
//         const direction = cityWeather.getDirection() !== undefined ? `Direction: ${cityWeather.getDirection()} <br>` : '';
//         const precipitationType = cityWeather.getPrecipitationType() !== undefined ? `Precipitation Type: ${cityWeather.getPrecipitationType()} <br>` : '';

//         return `
//         <div class="col-md-2 card">
//           <div>
//             Place: ${cityWeather.data.getPlace()} <br>
//             Type: ${cityWeather.data.getType()} <br>
//             ${direction}
//             ${precipitationType}
//             Value: ${cityWeather.getValue()} ${cityWeather.data.getUnit()} <br>
//             Time: ${date} <br>
//           </div>
//         </div>
//       `;
//     }).join('');

//     document.querySelector(".row").innerHTML = html;
// }

// async function renderForecast(city) {
//     getMinMaxTemp(city);
//     const weatherForecasts = await getForecast();

//     const html = weatherForecasts
//         .filter(fc => fc.place.toLowerCase() === city.toLowerCase())
//         .map(weather => {
//             const date = new Date(weather.data.getTime());
//             const hr = `${date.getUTCHours()}:${addZeroBefore(date.getUTCMinutes())}`;
//             const listHtml = getList(weather.getPrecipitationTypes()) + getList(weather.getDirections());

//             return `
//           <div class="col-md-2 card">
//             <div>
//               Place: ${weather.data.getPlace()} <br>
//               Type: ${weather.data.getType()} <br>
//               ${listHtml}
//               Unit: ${weather.data.getUnit()} <br>
//               From: ${weather.getFrom()} <br>
//               To: ${weather.getTo()} <br>
//               Time: ${hr} <br>
//             </div>
//           </div>
//         `;
//         }).join('');

//     document.querySelector(".data").innerHTML = html;
// }

// async function getMinMaxTemp(city) {
//     const data = await getData();
//     const previousDay = new Date();
//     previousDay.setDate(previousDay.getDate() - 1);

//     const filterByCity = w => w.place.toLowerCase() === city.toLowerCase();
//     const filterByType = type => w => w.type === type;
//     const filterByDate = date => w => {
//         const wDate = new Date(w.time);
//         return wDate.getDate() === date.getDate();
//     };

//     const temperatureData = data
//         .filter(filterByCity)
//         .filter(filterByType("temperature"))
//         .filter(filterByDate(previousDay))
//         .map(weatherData);

//     const minTemp = Math.min(...temperatureData.map(element => element.getValue()));
//     const maxTemp = Math.max(...temperatureData.map(element => element.getValue()));
//     const averageWindSpeed = calculateAverageWindSpeed(data, city, previousDay);
//     const totalPrecipitation = calculateTotalPrecipitation(data, city, previousDay);

//     const html = `
//       <div class="col-md-4 card">
//         Minimum temperature: ${minTemp} <br>
//         Maximum temperature: ${maxTemp} <br>
//       </div>
//       <div class="col-md-4 card">
//         Average Wind Speed: ${averageWindSpeed.toFixed(1)} <br>
//       </div>
//       <div class="col-md-4 card">
//         Total Precipitation: ${totalPrecipitation.toFixed(1)} <br>
//       </div>
//     `;

//     document.querySelector(".minMaxTemp").innerHTML = html;
// }

// function calculateAverageWindSpeed(data, city, date) {
//     const windData = data
//         .filter(w => w.place.toLowerCase() === city.toLowerCase())
//         .filter(w => w.type === "wind speed")
//         .filter(w => {
//             const wDate = new Date(w.time);
//             return wDate.getDate() === date.getDate();
//         })
//         .map(weatherData);

//     const totalWindSpeed = windData.reduce((sum, element) => sum + element.getValue(), 0);
//     return totalWindSpeed / windData.length;
// }

// function calculateTotalPrecipitation(data, city, date) {
//     const precipitationData = data
//         .filter(w => w.place.toLowerCase() === city.toLowerCase())
//         .filter(w => w.type === "precipitation")
//         .filter(w => {
//             const wDate = new Date(w.time);
//             return wDate.getDate() === date.getDate();
//         })
//         .map(weatherData);

//     return precipitationData.reduce((sum, element) => sum + element.getValue(), 0);
// }

// async function latestData() {
//     const weatherData = await getData();
//     const latestDate = new Date(
//         Math.max(...weatherData.map(data => new Date(data.data.getTime()).getTime()))
//     );

//     const latestDataList = weatherData
//         .filter(data => new Date(data.data.getTime()).getTime() === latestDate.getTime())
//         .map(weatherData);

//     const html = latestDataList.map(weather => {
//         const date = new Date(weather.data.getTime());
//         const hr = `${date.getUTCHours()}:${addZeroBefore(date.getUTCMinutes())}`;

//         return `
//         <div class="col-md-2 card">
//           <div>
//             Place: ${weather.data.getPlace()} <br>
//             Type: ${weather.data.getType()} <br>
//             Unit: ${weather.data.getUnit()} <br>
//             Value: ${weather.getValue()} <br>
//             Time: ${hr} <br>
//           </div>
//         </div>
//       `;
//     }).join('');

//     document.querySelector(".row").innerHTML = html;
// }

// function addZeroBefore(n) {
//     return (n < 10 ? '0' : '') + n;
// }

// function getList(list) {
//     return list.length
//         ? `
//         <ul>
//           ${list.map(i => `<li>${i}</li>`).join('')}
//         </ul>
//       `
//         : '';
// }

