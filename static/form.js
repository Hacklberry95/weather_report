const baseUrl = 'http://localhost:8080';
const xmlRequest = new XMLHttpRequest();


function addData() {
    
   
    const value = document.getElementById('value').value;
    const type = document.getElementById('valueType').value;
    const unit = document.getElementById('unit').value;
    const time = document.getElementById('time').value;
    const place = document.getElementById('place').value;

    const data = {       
        value: Number (value),
        type: type,
        unit: unit,
        time: time,
        place: place,
    };

    xmlRequest.open('POST', `${baseUrl}/data`, true);
    xmlRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlRequest.onreadystatechange = function () {
      if (xmlRequest.readyState === 4) {
        if (xmlRequest.status === 201) {
          const response = JSON.parse(xmlRequest.responseText);
          callback(null, response);
        } else {
          callback(`Error fetching forecast. Status code: ${xmlRequest.status}`);
        }
      }
    };
    xmlRequest.send(JSON.stringify(data));

    // console.log(`Location: ${place}`);
    // console.log(`Temperature: ${temperatureValue}°C`);
    // console.log(`Precipitation: ${precipitationValue}mm`);
    // console.log(`Wind Speed: ${windSpeedValue}km/h`);
    // console.log(`Cloud Coverage: ${cloudCoverageValue}%`);
}

function clearData() {
    // This will clear the form input fields.
    document.getElementById('weatherForm').reset();
}