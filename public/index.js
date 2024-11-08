// OpenWeatherMapのAPIキーを設定
const weatherApiKey = "c5de0f88d504e119048364cecf8224e6";
const ipInfoToken = "05c587fcf48fb2";
const datalen = 5; //表示させるデータ数

// 英語表記の都市名とcity_codeのマッピング
const cityCodes = {
  "Sapporo": "016010",
  "Sendai": "040010",
  "Tokyo": "130010",
  "Yokohama": "140010",
  "Nagoya": "230010",
  "Kyoto": "260010",
  "Osaka": "270000",
  "Kobe": "280010",
  "Hiroshima": "340010",
  "Fukuoka": "400010",
  "Naha": "471010",
  // 必要に応じて他の都市も追加
};

// city_codeを取得する関数
function getCityCode(cityName) {
  return cityCodes[cityName] || null;
}


// city_codeを取得する関数
function getCityCode(cityName) {
  return cityCodes[cityName] || null;
}


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
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("週間天気の取得に失敗しました");
    return null;
  }
}

// 天気に応じて画像を選択する関数
function selectimg(weather) {
  const imglist = {
    "clear sky": "weather_img/sunny.png",
    "few clouds": "weather_img/sunny.png",
    "scattered clouds": "weather_img/cloudy.png",
    "broken clouds": "weather_img/cloudy.png",
    "overcast clouds": "weather_img/cloudy.png",
    "light rain": "weather_img/rainy.png",
    "moderate rain": "weather_img/rainy.png",
    "heavy intensity rain": "weather_img/rainy.png",
    "very heavy rain": "weather_img/rainy.png",
    "extreme rain": "weather_img/rainy.png",
    "freezing rain": "weather_img/rainy.png",
    "light snow": "weather_img/snow.png",
    "snow": "weather_img/snow.png",
    "heavy snow": "weather_img/snow.png",
    "sleet": "weather_img/snow.png",
    "shower rain": "weather_img/rainy.png",
    "thunderstorm": "weather_img/storm.png", // 雷雨用
    "mist": "weather_img/mist.png", // 霧用
  };

  return imglist[weather] || ""; // デフォルト画像
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
  let date = new Date(data.dt * 1000);
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
  for (let i = 0; i < datalen; i++) {
    const row = document.createElement("tr");
    const timeCell = document.createElement("td");
    const tempCell = document.createElement("td");
    const rainCell = document.createElement("td");
    const descCell = document.createElement("td");

    var date = new Date(list[i].dt_txt + ' UTC');
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

// 週間天気を表示する関数
function displayWeeklyWeather(weatherData) {
  const weeklyForecastData = document.getElementById("weekly-forecast");

  // 今日の日付を取得
  const today = new Date();
  const todayDate = today.getDate(); // 今日の日付

  // 週間天気データから予報を表示
  weatherData.forecasts.forEach((forecast) => {
    // 今日の予報を除外
    if (forecast.date === today.toISOString().split('T')[0]) {
      return; // 今日の予報はスキップ
    }

    // 日付を「11月6日」の形式に変更
    const date = new Date(forecast.date);
    const month = date.getMonth() + 1; // 月（0始まりなので+1）
    const day = date.getDate(); // 日

    // 最高気温・最低気温をtemperatureオブジェクトから取得
    const highLowTemp = `${forecast.temperature.max.celsius}℃ / ${forecast.temperature.min.celsius}℃`;

    // 降水確率を取得
    const precipitation = forecast.chanceOfRain || 0; // 降水確率

    // 天気に基づいた画像を選択
    const imgurl = selectimg(forecast.telop); // 天気によって画像を選択

    const row = document.createElement("tr");

    // 日付セルを作成
    const dateCell = document.createElement("td");
    dateCell.textContent = `${month}月${day}日`;

    // 最高気温・最低気温セルを作成
    const tempCell = document.createElement("td");
    tempCell.textContent = highLowTemp;

    // 降水確率セルを作成
    const rainCell = document.createElement("td");
    rainCell.textContent = `${(Number(precipitation.T00_06.split("%")[0]) + Number(precipitation.T06_12.split("%")[0]) + Number(precipitation.T12_18.split("%")[0]) + Number(precipitation.T18_24.split("%")[0]))/4}%`;

    // 天気セルを作成
    const weatherCell = document.createElement("td");
    weatherCell.textContent = langJP(forecast.telop); // 天気情報（日本語化）



    row.appendChild(dateCell);
    row.appendChild(tempCell);
    row.appendChild(rainCell);
    row.appendChild(weatherCell);

    weeklyForecastData.appendChild(row);
  });
}




async function init() {
  // IPアドレスから地域を取得
  const locationData = await fetchLocation();
  const [lat, lon] = locationData.loc.split(",");

  // 現在の天気を取得
  const weatherData_now = await fetchWeather_now(lat, lon);
  displayWeather_now(weatherData_now, locationData);

  // 3時間ごとの天気を取得
  const weatherData_table = await fetchWeather_table(lat, lon);
  displayWeather_table(weatherData_table.list);

  // 地域名からcity_codeを取得
  const cityCode = getCityCode(locationData.city);
  if (cityCode) {
    const weeklyWeatherData = await fetchWeeklyWeather(cityCode);
    if (weeklyWeatherData) {
      displayWeeklyWeather(weeklyWeatherData);
    }
  } else {
    console.log("対応する地域コードが見つかりませんでした。");
  }
}



// ページ読み込み時に初期化
window.onload = init;