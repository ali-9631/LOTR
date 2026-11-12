function getFahrenheit(tempCelsius) {
  let tempFahrenheit = (tempCelsius * 9 / 5) + 32;
  return tempFahrenheit;
}

function getKelvin(tempCelsius) {
  let tempKelvin = tempCelsius + 273.15;
  return tempKelvin;
}

function getStatus(tempCelsius) {
  if (tempCelsius < 0) {
    return "Status: Freezing";
  } else if (tempCelsius >= 0 && tempCelsius < 10) {
    return "Status: Cold";
  } else if (tempCelsius >= 10 && tempCelsius < 20) {
    return "Status: Mild";
} else if (tempCelsius >= 20 && tempCelsius < 30) {
  return "Status: Warm";
} else {
  return "Status: Hot";
}
}

function getWindchill(windSpeed, tempCelsius) {
    let windChill = 13.12 + 0.6215 * tempCelsius - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * tempCelsius * Math.pow(windSpeed, 0.16);
    return windChill;
}

function getWeatherReport(cityName, tempCelsius, windSpeed) {
console.log("Weather Report for " + cityName);
console.log("Temperature: " + tempCelsius + "°C");
console.log("Temperature: " + getFahrenheit(tempCelsius) + "°F");
console.log("Temperature: " + getKelvin(tempCelsius) + "K");
console.log(getStatus(tempCelsius));
console.log("Wind chill: " + getWindchill(windSpeed, tempCelsius).toFixed(2) + "°C");
console.log("---");
}

getWeatherReport("Amsterdam", 22, 15);

getWeatherReport("Berlin", 15, 20);

getWeatherReport("Copenhagen", -5, 25);
