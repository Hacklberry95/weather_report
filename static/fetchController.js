async function getForecast() {
  let url = "http://localhost:8080/forecast";
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function getData() {
  let url = "http://localhost:8080/data";
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function generateWeatherHtml(weatherList) {
  let html = "";

  let weather = await getData();

  for (weather of weatherList) {
    let date = new Date(weather.time);
    let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

    html += `<div class="col-md-2 card">
              <div>
                Place: ${weather.place} <br>
                Type: ${weather.type} <br>`;

    if (weather.direction !== undefined) {
      html += `Direction: ${weather.direction} <br>`;
    }

    if (weather.precipitation_type !== undefined) {
      html += `Precipitation Type: ${weather.precipitation_type} <br>`;
    }

    html += `From: ${weather.from}
              To: ${weather.to} 
              Unit: ${weather.unit} <br>
                Time: ${hr}
              </div>
              <br>
            </div>`;
  }
  return html;
}



function addZeroBefore(n) {
  return (n < 10 ? "0" : "") + n;
}

function filterByCityAndType(data, city, type = null) {
  let filteredData = data.filter(
    (w) => w.place.toLowerCase() == city.toLowerCase()
  );
  if (type) {
    filteredData = filteredData.filter((w) => w.type == type);
  }
  return filteredData;
}

function filterByDate(data, daysAgo = 1) {
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - daysAgo);
  return data.filter((w) => new Date(w.time).getDate() == targetDate.getDate());
}

async function renderForecast(city) {
  let weatherForecasts = await getForecast();
  let filteredForecasts = filterByCityAndType(weatherForecasts, city);
  let html = await generateWeatherHtml(filteredForecasts);
  document.querySelector(".data").innerHTML = html;
}

document.getElementById("myCityDropdown").onchange = function () {
  // Gets the selected option's value
  var selectedValue = this.value;
  if (selectedValue !== null) {
    renderForecast(selectedValue);
  }
};

/**
 * the getMinMaxTemp() method fetches weather data and filters temp data for the specified city and by the previous day. We then
 * find the min and max temps using the spread operator and Math.min.
 * @param city - The city name we wish to view the temps for.
 */

async function getMinMaxTemp(city) {
  try {
    let weatherData = await getData();
    let tempData = filterByCityAndType(weatherData, city, "temperature");
    let previousDayData = filterByDate(tempData);

    if (previousDayData.length > 0) {
      let minTemp = Math.min(
        ...previousDayData.map((element) => element.value)
      );
      let maxTemp = Math.max(
        ...previousDayData.map((element) => element.value)
      );



      let minMaxTempHtml = `
        <div class="col-md-2 card">
          <div>
            Minimum Temperature: ${city} ${minTemp} &deg;C <br>
            Maximum Temperature: ${city} ${maxTemp} &deg;C
          </div>
        </div>
       `;

      // Append the HTML to the ".minMaxTemp" container

      document.querySelector(".data").innerHTML = minMaxTempHtml;

    } else {
      console.log("No temperature data available for the specified city.");
    }
  } catch (error) {
    console.error("Error getting min/max temperature:", error);
  }
}

async function calculateTotalPrecipitation(city) {
  try {
    let weatherData = await getData();
    let precipitationData = filterByCityAndType(
      weatherData,
      city,
      "precipitation"
    );
    let previousDayData = filterByDate(precipitationData);

    if (previousDayData.length > 0) {
      // Calculate the total precipitation using reduce
      let totalPrecipitation = previousDayData.reduce((total, element) => {
        return total + element.value;
      }, 0);

      let totalPrecipitationHtml = `
        <div class="col-md-2 card">
          <div>
            Total Precipitation: ${city} ${totalPrecipitation} mm
          </div>
        </div>
      `;
      document.querySelector(".data").innerHTML =
        totalPrecipitationHtml;
    } else {
      console.log("No precipitation data available for the specified city.");
    }
  } catch (error) {
    console.error("Error calculating total precipitation:", error);
  }
}

async function calculateAverageWindSpeed(city) {
  try {
    let weatherData = await getData();
    let windSpeedData = filterByCityAndType(weatherData, city, "wind speed");
    let previousDayData = filterByDate(windSpeedData);

    if (previousDayData.length > 0) {
      let totalWindSpeed = previousDayData.reduce((total, element) => {
        return total + element.value;
      }, 0);
      let averageWindSpeed = totalWindSpeed / previousDayData.length;

      let averageWindSpeedHtml = `
        <div class="col-md-2 card">
          <div>
            Average Wind Speed: ${city} ${averageWindSpeed} m/s
          </div>
        </div>
      `;
      document.querySelector(".data").innerHTML =
        averageWindSpeedHtml;
    } else {
      console.log("No wind speed data available for the specified city.");
    }
  } catch (error) {
    console.error("Error calculating average wind speed:", error);
  }
}

/**
 * In the displayLatestMeasurements() method, we are creating an object that stores the latest measuerements of each type. We then
 * check if the weather data matches the specified city, before displaying the data in html
 * @param city - The city we want to get the latest measurements for.
 */


async function displayLatestMeasurements(city) {
  try {
    let weatherData = await getData();

    let latestMeasurements = {};

    weatherData.forEach((weather) => {
      const type = weather.type;

      if (weather.place.toLowerCase() === city.toLowerCase()) {
        if (
          !(type in latestMeasurements) ||
          new Date(weather.time) > new Date(latestMeasurements[type].time)
        ) {
          latestMeasurements[type] = weather;
        }
      }
    });

    let latestMeasurementsHtml = "";
    for (const type in latestMeasurements) {
      const measurement = latestMeasurements[type];
      let date = new Date(measurement.time);
      let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

      latestMeasurementsHtml += `
        <div class="col-md-2 card">
          <div>
            Place: ${measurement.place} <br>
            Type: ${measurement.type} <br>
            Value: ${measurement.value} <br>
            Unit: ${measurement.unit} <br>
            Time: ${hr} <br>
          </div>
        </div>
      `;
    }

    document.querySelector(".latestMeasurements").innerHTML =
      latestMeasurementsHtml;
  } catch (error) {
    console.error("Error displaying latest measurements:", error);
  }
}
