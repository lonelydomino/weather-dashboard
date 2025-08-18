import { useState, useEffect } from 'react'
import './App.css'
import { TemperatureChart, PrecipitationChart, WeatherMap, WeatherIcon } from './components'

function App() {
  // State variables to store our data
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('celsius'); // 'celsius' or 'fahrenheit'

  // Check location permission on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
      });
    }
  }, []);

  // Function to get weather by coordinates
  const getWeatherByCoordinates = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    
    try {
      // Use coordinates directly with weather API
      const coordinates = `${lat},${lon}`;
      await fetchWeatherData(coordinates);
    } catch (err) {
      setError('Failed to get weather for your location');
    } finally {
      setLoading(false);
    }
  };

  // Function to detect user's location
  const detectLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoordinates(latitude, longitude);
        setIsDetectingLocation(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions or search manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable. Please search manually.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out. Please try again or search manually.');
            break;
          default:
            setError('An error occurred while getting your location. Please search manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Function to fetch weather data (extracted from fetchWeather)
  const fetchWeatherData = async (cityName: string) => {
    try {
      // Fetch current weather
      const weatherResponse = await fetch(`http://localhost:8000/api/weather/current/${cityName}`);
      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
      } else {
        setError('City not found or weather data unavailable');
        return;
      }

      // Fetch forecast data
      const forecastResponse = await fetch(`http://localhost:8000/api/weather/forecast/${cityName}`);
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.forecast);
      }
    } catch (err) {
      setError('Failed to fetch weather data. Is the backend running?');
    }
  };

  // Function to fetch weather data from search
  const fetchWeather = async () => {
    if (!city.trim()) return;
    await fetchWeatherData(city);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌤️ Weather Dashboard</h1>
        
        {/* Temperature Unit Toggle */}
        <div className="temperature-toggle">
          <button 
            onClick={() => setTemperatureUnit('celsius')}
            className={`toggle-button ${temperatureUnit === 'celsius' ? 'active' : ''}`}
          >
            °C
          </button>
          <button 
            onClick={() => setTemperatureUnit('fahrenheit')}
            className={`toggle-button ${temperatureUnit === 'fahrenheit' ? 'active' : ''}`}
          >
            °F
          </button>
        </div>
        
        {/* Location Detection Section */}
        <div className="location-section">
          <button 
            onClick={detectLocation}
            disabled={isDetectingLocation || loading}
            className="location-button"
          >
            {isDetectingLocation ? '📍 Detecting...' : '📍 Use My Location'}
          </button>
          <div className="location-info">
            {isDetectingLocation && (
              <small className="location-hint">
                Getting your location...
              </small>
            )}
            {locationPermission === 'denied' && !isDetectingLocation && (
              <small className="location-hint">
                Location access denied. You can still search for cities manually.
              </small>
            )}
          </div>
        </div>
        
        {/* Search Section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            className="city-input"
          />
          <button 
            onClick={fetchWeather}
            disabled={loading || !city.trim()}
            className="search-button"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <div className="weather-display">
            <h2>{weather.city}, {weather.country}</h2>
            <div className="weather-info">
              <div className="temperature">
                {temperatureUnit === 'celsius' 
                  ? `${weather.current.temperature_c}°C` 
                  : `${weather.current.temperature_f}°F`
                }
              </div>
              <div className="condition">
                <WeatherIcon condition={weather.current.condition} />
              </div>
              <div className="details">
                <p>Humidity: {weather.current.humidity}%</p>
                <p>Wind: {weather.current.wind_speed_kph} km/h</p>
                <p>Feels like: {temperatureUnit === 'celsius' 
                  ? `${weather.current.feels_like_c}°C` 
                  : `${weather.current.feels_like_f}°F`
                }</p>
                <p>Pressure: {weather.current.pressure_mb} mb</p>
                <p>UV Index: {weather.current.uv_index}</p>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {forecast && forecast.length > 0 && (
          <div className="charts-section">
            <TemperatureChart forecastData={forecast} temperatureUnit={temperatureUnit} />
            <PrecipitationChart forecastData={forecast} />
          </div>
        )}

        {/* Weather Map Section */}
        {weather && (
          <div className="map-section">
            <WeatherMap weather={weather} forecast={forecast} city={city} />
          </div>
        )}
      </header>
    </div>
  )
}

export default App

