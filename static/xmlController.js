const baseUrl = 'http://localhost:8080';
const xmlRequest = new XMLHttpRequest();

function getForecast(callback) {
  xmlRequest.open('GET', `${baseUrl}/forecast`, true);
  xmlRequest.onreadystatechange = function () {
    if (xmlRequest.readyState === 4) {
      if (xmlRequest.status === 200) {
        const response = JSON.parse(xmlRequest.responseText);
        callback(null, response);
      } else {
        callback(`Error fetching forecast. Status code: ${xmlRequest.status}`);
      }
    }
  };
  xmlRequest.send();
}

function getData(callback) {
  xmlRequest.open('GET', `${baseUrl}/data`, true);
  xmlRequest.onreadystatechange = function () {
    if (xmlRequest.readyState === 4) {
      if (xmlRequest.status === 200) {
        const response = JSON.parse(xmlRequest.responseText);
        callback(null, response);
      } else {
        callback(`Error fetching data. Status code: ${xmlRequest.status}`);
      }
    }
  };
  xmlRequest.send();
}

/**
* The generateWeatherHtml() function takes an array of weather objects as input and generates an HTML string
* containing information about each weather object. It iterates through the weatherList, creates HTML elements
* for each weather object, and appends them to the 'html' string.
* 
* @param {Array} weatherList - An array of weather objects to display in HTML format.
*/

function generateWeatherHtml(weatherList) {
  let html = '';

  for (const weather of weatherList) {
    let date = new Date(weather.time);
    let hr = date.getUTCHours() + ':' + addZeroBefore(date.getUTCMinutes());

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

// Function to render weather forecast for a specific city
async function renderForecast(city) {
  try {
    getForecast(function (error, weatherForecasts) {
      if (error) {
        console.error('Error fetching forecast:', error);
        return;
      }

      let filteredForecasts = filterByCityAndType(weatherForecasts, city);
      let html = generateWeatherHtml(filteredForecasts);
      document.querySelector('.data').innerHTML = html;
    });
  } catch (error) {
    console.error('Error rendering weather forecast:', error);
  }
}
document.getElementById("myCityDropdown").onchange = function () {
  // Gets the selected option's value
  var selectedValue = this.value;
  renderForecast(selectedValue);
};

function filterByCityAndType(data, city, type = null) {
  let filteredData = [];

  for (const weather of data) {
    if (weather.place.toLowerCase() === city.toLowerCase()) {
      if (type === null || weather.type === type) {
        filteredData.push(weather);
      }
    }
  }

  return filteredData;
}

function addZeroBefore(n) {
  return n < 10 ? "0" + n : n.toString();
}

function filterByDate(data, daysAgo = 1) {
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - daysAgo);
  return data.filter((w) => new Date(w.time).getDate() == targetDate.getDate());
}

function getMinMaxTemp(city) {
  try {
    xmlRequest.open("GET", `${baseUrl}/data`, true);
    xmlRequest.onreadystatechange = function () {
      if (xmlRequest.readyState === 4 && xmlRequest.status === 200) {
        let weatherData = JSON.parse(xmlRequest.responseText);
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

          document.querySelector(".data").innerHTML = minMaxTempHtml;
        } else {
          console.log("No temperature data available for the specified city.");
        }
      }
    };
    xmlRequest.send();
  } catch (error) {
    console.error("Error getting min/max temperature:", error);
  }
}

// Function to calculate and display the total precipitation
function calculateTotalPrecipitation(city) {
  try {
    xmlRequest.open("GET", `${baseUrl}/data`, true);
    xmlRequest.onreadystatechange = function () {
      if (xmlRequest.readyState === 4 && xmlRequest.status === 200) {
        let weatherData = JSON.parse(xmlRequest.responseText);
        let precipitationData = filterByCityAndType(
          weatherData,
          city,
          "precipitation"
        );
        let previousDayData = filterByDate(precipitationData);

        if (previousDayData.length > 0) {
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
          console.log(
            "No precipitation data available for the specified city."
          );
        }
      }
    };
    xmlRequest.send();
  } catch (error) {
    console.error("Error calculating total precipitation:", error);
  }
}

// Function to calculate and display the average wind speed
function calculateAverageWindSpeed(city) {
  try {
    xmlRequest.open("GET", `${baseUrl}/data`, true);
    xmlRequest.onreadystatechange = function () {
      if (xmlRequest.readyState === 4 && xmlRequest.status === 200) {
        let weatherData = JSON.parse(xmlRequest.responseText);
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
      }
    };
    xmlRequest.send();
  } catch (error) {
    console.error("Error calculating average wind speed:", error);
  }
}

// Function to display the latest measurements for a city
function displayLatestMeasurements(city) {
  try {
    xmlRequest.open("GET", `${baseUrl}/data`, true);
    xmlRequest.onreadystatechange = function () {
      if (xmlRequest.readyState === 4 && xmlRequest.status === 200) {
        let weatherData = JSON.parse(xmlRequest.responseText);

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
      }
    };
    xmlRequest.send();
  } catch (error) {
    console.error("Error displaying latest measurements:", error);
  }
}
