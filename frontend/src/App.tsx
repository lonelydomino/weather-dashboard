import { useState, useEffect } from 'react'
import './App.css'
import { TemperatureChart, PrecipitationChart, WeatherMap, WeatherIcon, DynamicBackground } from './components'
import { API_ENDPOINTS } from './config'

// Type definitions
interface WeatherData {
  city: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  current: {
    temperature_c: number;
    temperature_f: number;
    condition: string;
    icon: string;
    humidity: number;
    wind_kph: number;
    wind_direction: number;
    pressure_mb: number;
    uv: number;
    feels_like_c: number;
    feels_like_f: number;
  };
  last_updated: string;
}

interface ForecastData {
  date: string;
  max_temp_c: number;
  min_temp_c: number;
  max_temp_f: number;
  min_temp_f: number;
  condition: string;
  icon: string;
  precipitation_mm: number;
  max_wind_kph: number;
  uv: number;
  sunrise: string;
  sunset: string;
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('fahrenheit');

  // Check location permission on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
      });
    }
  }, []);

  // Debug effect for forecast data
  useEffect(() => {
    if (forecast) {
      console.log('Forecast state updated:', forecast);
      console.log('Forecast length:', forecast.length);
      console.log('First forecast item:', forecast[0]);
    }
  }, [forecast]);

  // Debug effect for weather data
  useEffect(() => {
    if (weather) {
      console.log('Weather state updated:', weather);
      console.log('Weather city:', weather.city);
    }
  }, [weather]);

  // Function to get weather by coordinates
  const getWeatherByCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.CURRENT_WEATHER(`${lat},${lon}`));
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        console.error('Failed to get weather for your location');
      }
    } catch (err) {
      console.error('Failed to fetch weather data for your location');
    }
  };

  // Function to detect user location
  const detectLocation = () => {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoordinates(latitude, longitude);
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);
        setLocationPermission('denied');
        setIsDetectingLocation(false);
      }
    );
  };

  // Function to fetch weather data
  const fetchWeatherData = async (cityName: string) => {
    try {
      // Fetch current weather
      const weatherResponse = await fetch(API_ENDPOINTS.CURRENT_WEATHER(cityName));
      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        console.log('Weather data received:', weatherData);
        setWeather(weatherData);
      } else {
        console.error('City not found or weather data unavailable');
        return;
      }

      // Fetch forecast data
      const forecastResponse = await fetch(API_ENDPOINTS.FORECAST(cityName));
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        console.log('Forecast data received:', forecastData);
        console.log('Forecast array:', forecastData.forecast);
        setForecast(forecastData.forecast);
      } else {
        console.error('Forecast response not ok:', forecastResponse.status, forecastResponse.statusText);
      }
    } catch (err) {
      console.error('Failed to fetch weather data. Is the backend running?');
    }
  };

  // Function to handle search
  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <DynamicBackground weather={weather}>
      <div className="App">
        <header className="App-header">
          <h1>🌤️ Weather Dashboard</h1>
          
          {/* Temperature Toggle */}
          <div className="temperature-toggle">
            <button 
              className={`toggle-button ${temperatureUnit === 'celsius' ? 'active' : ''}`}
              onClick={() => setTemperatureUnit('celsius')}
            >
              °C
            </button>
            <button 
              className={`toggle-button ${temperatureUnit === 'fahrenheit' ? 'active' : ''}`}
              onClick={() => setTemperatureUnit('fahrenheit')}
            >
              °F
            </button>
          </div>
        </header>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="city-input"
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
            
            {/* Location Detection */}
            <div className="location-section">
              <button 
                onClick={detectLocation} 
                className="location-button"
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? '📍 Detecting...' : '📍 Use My Location'}
              </button>
              
              {locationPermission === 'denied' && (
                <div className="location-hint">
                  Location access denied. Please enable location permissions in your browser.
                </div>
              )}
              
              {isDetectingLocation && (
                <div className="location-hint">
                  Getting your location...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Weather Display */}
        {weather && (
          <section className="weather-display">
            <div className="weather-info">
              <div className="location">
                <h2>{weather.city}, {weather.region}</h2>
                <p>{weather.country}</p>
              </div>
              <div className="condition">
                <WeatherIcon condition={weather.current.condition} />
              </div>
              <div className="details">
                <div className="temperature">
                  {temperatureUnit === 'celsius' 
                    ? `${weather.current.temperature_c}°C` 
                    : `${weather.current.temperature_f}°F`
                  }
                </div>
                <div className="feels-like">
                  Feels like: {temperatureUnit === 'celsius' 
                    ? `${weather.current.feels_like_c}°C` 
                    : `${weather.current.feels_like_f}°F`
                  }
                </div>
                <div className="weather-details">
                  <div>Humidity: {weather.current.humidity}%</div>
                  <div>Wind: {weather.current.wind_kph} km/h</div>
                  <div>Pressure: {weather.current.pressure_mb} mb</div>
                  <div>UV Index: {weather.current.uv}</div>
                </div>
                <div className="last-updated">
                  Last updated: {weather.last_updated}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Charts Section */}
        {forecast && forecast.length > 0 && (
          <section className="charts-section">
            <div className="chart-container">
              <TemperatureChart key={`temp-${city}-${temperatureUnit}`} forecast={forecast} temperatureUnit={temperatureUnit} />
            </div>
            <div className="chart-container">
              <PrecipitationChart key={`precip-${city}`} forecast={forecast} />
            </div>
          </section>
        )}
        
        {/* Weather Map */}
        {weather && (
          <section className="map-section">
            <div className="weather-map">
              <WeatherMap weather={weather} forecast={forecast} city={city} temperatureUnit={temperatureUnit} />
            </div>
          </section>
        )}
      </div>
    </DynamicBackground>
  );
}

export default App;

