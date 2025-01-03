import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { API_URL } from './url';

function App() {
  const [cityName, setCityName] = useState('');
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geolocationError, setGeolocationError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setError(null);

    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/get-weather?cityName=${cityName}`);
      setWeatherInfo(response.data);
    } catch (err) {
      setWeatherInfo(null);
      setError('Error fetching weather, please try again with a different city.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByGeolocation = async (lat, lon) => {
    setError(null);

    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/get-weather?lat=${lat}&lon=${lon}`
      );
      setWeatherInfo(response.data);
      setError('');
    } catch (err) {
      setWeatherInfo(null);
      setGeolocationError('Unable to fetch weather for your location.');
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (event) => {
    setCityName(event.target.value);
    if (/\d/.test(event.target.value)) {
      setError('City name should not contain numbers.');
    } else {
      setError('');
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetchWeather(cityName);
  };

  const getGeolocation = () => {
    setCityName('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByGeolocation(latitude, longitude);
        },
        (error) => {
          setGeolocationError('Geolocation is not available or denied.');
        }
      );
    } else {
      setGeolocationError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="App">
      <div className="weather-container">
        <h1>Weather Dashboard</h1>
        <button className="geo-button" onClick={getGeolocation}>
          Use My Location
        </button>
        <form onSubmit={onSubmit} className="weather-form">
          <input
            type="text"
            value={cityName}
            onChange={handleCityChange}
            placeholder="Enter city name"
            className="cityName-input"
          />
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !cityName.trim()}
            style={{
              backgroundColor: loading || !cityName.trim() ? '#b0c4de' : '#007bff',
              cursor: loading || !cityName.trim() ? 'not-allowed' : 'pointer',
              color: loading || !cityName.trim() ? '#6c757d' : '#fff',
            }}
          >
            {loading ? 'Loading Weather Data' : 'Get Weather'}
          </button>

        </form>
        {geolocationError && <p className="error">{geolocationError}</p>}
        {error && <p className="error">{error}</p>}
        {weatherInfo && (
          <div className="weather-card">
            <h2 className="location-name">{weatherInfo.currentWeather.location.name}</h2>
            <p className="weather-condition">
              {weatherInfo.currentWeather.current.condition.text}
            </p>
            <img
              className="weather-icon"
              src={`http:${weatherInfo.currentWeather.current.condition.icon}`}
              alt={weatherInfo.currentWeather.current.condition.text}
            />
            <div className="current-weather-details">
              <p>Temperature: {weatherInfo.currentWeather.current.temp_c}°C</p>
              <p>Humidity: {weatherInfo.currentWeather.current.humidity}%</p>
            </div>
            <h3 className="forecast-title">5-Day Forecast</h3>
            <div className="forecast-container">
              {weatherInfo.forecastData.forecast.forecastday.map((forecast, index) => (
                <div key={index} className="forecast-card">
                  <h4>{forecast.date}</h4>
                  <p>{forecast.day.avgtemp_c}°C</p>
                  <p>{forecast.day.condition.text}</p>
                  <img
                    className="forecast-icon"
                    src={`http:${forecast.day.condition.icon}`}
                    alt={forecast.day.condition.text}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
