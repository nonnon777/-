// OpenWeatherMapのAPIキーを設定
const weatherApiKey = "c5de0f88d504e119048364cecf8224e6";
const ipInfoToken = "05c587fcf48fb2";
const datalen = 5; //表示させるデータ数

// 位置情報を取得
async function fetchLocation() {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${ipInfoToken}`);
    if (!res.ok) {
      throw new Error(`HTTPエラー: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("地域の取得に失敗しました");
    return 0;
  }
}

//気象庁データから地域idを取得
async function fetchCityCode(cityName) {
  try {
    const res = await fetch("https://weather.tsukumijima.net/primary_area.xml");
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // cityタグのリストを取得
    const cities = xmlDoc.getElementsByTagName("city");
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      const title = city.getAttribute("title");

      // `cityName`と一致するタイトルの`id`を返す
      if (title === cityName) {
        return city.getAttribute("id");
      }
    }
    console.log("一致する地域コードが見つかりませんでした");
    return null;
  } catch (error) {
    console.log("地域コードの取得に失敗しました");
    return null;
  }
}

// 天気データを取得
async function fetchWeather_now(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`
  );
  const data = await res.json();
  console.log(data);
  return data;
}
async function fetchWeather_table(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`
  );
  const data = await res.json();
  console.log(data);
  return data;
}
//週間天気取得
async function fetchWeeklyWeather(cityCode) {
  try {
    const res = await fetch(`https://weather.tsukumijima.net/api/forecast/city/${cityCode}`);
    if (!res.ok) {
      throw new Error(`HTTPエラー: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("週間天気の取得に失敗しました");
    return null;
  }
}

function selectimg(weather) {
  const imglist = [
    "sunny.png",
    "cloudy",
    "cloudy_to_rainy.png",
    "rainy.png",
    "cloudy.png",
    "suno.png",
  ];

  if(["clear sky","few clouds"].includes(weather)){
    return "weather_img/sunny.png";
  }else if(["scattered clouds","broken clouds","overcast clouds"].includes(weather)){
    return "weather_img/cloudy.png";
  }else if(["light rain","moderate rain","heavy intensity rain","very heavy rain","extremerain","freezing rain"].includes(weather)){
    return "weather_img/rainy.png";
  }else if(["snow"].includes(weather)){
    return "weather_img/snow.png"
  }

}
//英語表記を日本語に（日本語でも取得できるけど翻訳に違和感があったので）
function langJP(weathername) {
  const translations = {
    "clear sky": "快晴",
    "few clouds": "晴れ",
    "scattered clouds": "曇り",
    "broken clouds": "曇りがち",
    "overcast clouds": "曇り空",
    "light rain": "小雨",
    "moderate rain": "雨",
    "heavy intensity rain": "強い雨",
    "very heavy rain": "非常に強い雨",
    "extreme rain": "激しい雨",
    "freezing rain": "氷雨",
    "light snow": "小雪",
    "snow": "雪",
    "heavy snow": "大雪",
    "sleet": "みぞれ",
    "shower rain": "にわか雨",
    "thunderstorm": "雷雨",
    "mist": "霧",
    "smoke": "煙霧",
    "haze": "もや",
    "fog": "濃霧",
    "sand": "砂嵐",
    "dust": "粉塵",
    "ash": "火山灰",
    "squall": "突風",
    "tornado": "竜巻",
  };

  return translations[weathername] || weathername;
}

//現在の天気を表示
function displayWeather_now(data, location) {
  const date = new Date(data.dt * 1000);
  document.getElementById(
    "time"
  ).textContent = `現在の天気（${date.getHours()}時${date.getMinutes()}分時点）`;
  document.getElementById(
    "location"
  ).textContent = `地域:${location.city}, ${location.region}`;
  document.getElementById("temp").textContent = `気温: ${
    Math.round((data.main.temp - 273.16) * 10) / 10
  }℃ / 体感温度:${
    Math.round((data.main.feels_like - 273.16) * 10) / 10
  }℃ / 湿度:${Math.round(data.main.humidity)}%`;
  document.getElementById("description").textContent = `天気: ${langJP(
    data.weather[0].description
  )}`;
}

//3時間ごとの天気データを表示。どこまで表示させるかは datalen（個数） で設定する
function displayWeather_table(list) {
  const forecastData = document.getElementById("forecast-data");
  for (let i = 2; i < datalen; i++) {
    const row = document.createElement("tr");
    const timeCell = document.createElement("td");
    const tempCell = document.createElement("td");
    const rainCell = document.createElement("td");
    const descCell = document.createElement("td");

    var date = new Date(list[i].dt_txt);
    timeCell.textContent = `${
      date.getMonth() + 1
    }月${date.getDate()}日${date.getHours()}時`;
    tempCell.textContent = `${
      Math.round((list[i].main.temp - 273.16) * 10) / 10
    }℃`;
    rainCell.textContent = `${Math.round(list[i].pop * 100)}`;
    descCell.textContent = langJP(list[i].weather[0].description);
    var imgurl = selectimg(list[i].weather[0].description);
    descCell.innerHTML += `<img src="${imgurl}" class="weather_img"/>`;
    row.appendChild(timeCell);
    row.appendChild(tempCell);
    row.appendChild(rainCell);
    row.appendChild(descCell);
    forecastData.appendChild(row);
  }
}
//週間天気を表示
// 週間天気を表示
function displayWeeklyWeather(data) {
  const weeklyForecast = document.getElementById("weekly-forecast-data");
  weeklyForecast.innerHTML = ""; // 既存のデータをクリア

  data.forecasts.forEach((forecast) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    const tempCell = document.createElement("td");
    const descCell = document.createElement("td");

    // 日付
    dateCell.textContent = `${forecast.dateLabel} (${forecast.date})`;

    // 気温（最高/最低）
    const maxTemp = forecast.temperature.max ? `${forecast.temperature.max.celsius}℃` : "N/A";
    const minTemp = forecast.temperature.min ? `${forecast.temperature.min.celsius}℃` : "N/A";
    tempCell.textContent = `${maxTemp} / ${minTemp}`;

    // 天気情報
    descCell.textContent = forecast.telop;
    const img = document.createElement("img");
    img.src = forecast.image.url;
    img.alt = forecast.telop;
    img.classList.add("weather_img");
    descCell.appendChild(img);

    row.appendChild(dateCell);
    row.appendChild(tempCell);
    row.appendChild(descCell);
    weeklyForecast.appendChild(row);
  });
}

async function init() {
  // ipアドレスから地域を取得
  const locationData = await fetchLocation();
  const [lat, lon] = locationData.loc.split(",");

  // 現在の天気を取得
  const weatherData_now = await fetchWeather_now(lat, lon);
  displayWeather_now(weatherData_now, locationData);

  // 3時間ごとの天気を取得
  const weatherData_table = await fetchWeather_table(lat, lon);
  displayWeather_table(weatherData_table.list);

  // 地域コードを取得して週間天気を取得
  const cityCode = await fetchCityCode(locationData.city); // locationData.cityを使用して地域名に対応するコードを取得
  if (cityCode) {
    const weeklyWeatherData = await fetchWeeklyWeather(cityCode);
    if (weeklyWeatherData) {
      displayWeeklyWeather(weeklyWeatherData);
    }
  }
}


// ページ読み込み時に初期化
window.onload = init;