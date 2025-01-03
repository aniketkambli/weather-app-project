const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const cache = new NodeCache({ stdTTL: 1800, checkperiod: 120 });

const WEATHERAPI_API_KEY = process.env.WEATHERAPI_API_KEY;
const WEATHERAPI_API_URL = 'http://api.weatherapi.com/v1/';

const getCurrentWeather = async (cityName) => {
  const url = `${WEATHERAPI_API_URL}current.json?key=${WEATHERAPI_API_KEY}&q=${cityName}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching current weather');
  }
};

const getForecastData = async (cityName) => {
  const url = `${WEATHERAPI_API_URL}forecast.json?key=${WEATHERAPI_API_KEY}&q=${cityName}&days=5`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching forecast data');
  }
};

const getWeatherByCoordinates = async (lat, lon) => {
  const url = `${WEATHERAPI_API_URL}current.json?key=${WEATHERAPI_API_KEY}&q=${lat},${lon}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching weather by coordinates');
  }
};

const getForecastByCoordinates = async (lat, lon) => {
  const url = `${WEATHERAPI_API_URL}forecast.json?key=${WEATHERAPI_API_KEY}&q=${lat},${lon}&days=5`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching forecast by coordinates');
  }
};

app.get('/get-weather', async (req, res) => {
  const { cityName, lat, lon } = req.query;

  try {
    let cacheKey = cityName || `${lat},${lon}`;
    let cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data');
      return res.json(cachedData);
    }

    let currentWeather, forecastData;

    if (cityName) {
      currentWeather = await getCurrentWeather(cityName);
      forecastData = await getForecastData(cityName);
    } else if (lat && lon) {
      currentWeather = await getWeatherByCoordinates(lat, lon);
      forecastData = await getForecastByCoordinates(lat, lon);
    } else {
      return res.status(400).json({ error: 'City or coordinates required' });
    }

    const weatherInfo = {
      currentWeather,
      forecastData,
    };

    cache.set(cacheKey, weatherInfo);

    res.json(weatherInfo);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
