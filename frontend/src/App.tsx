import { useState, useEffect } from 'react'
import './App.css'
import { TemperatureChart, PrecipitationChart, WeatherMap, WeatherIcon, DynamicBackground } from './components'

function App() {
  // State variables to store our data
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      } else {
        console.error('Forecast response not ok:', forecastResponse.status, forecastResponse.statusText);
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
              onKeyPress={(e) => e.key === 'Enter' && fetchWeatherData()}
            />
            <button onClick={fetchWeatherData} className="search-button">
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
            <h2>Weather Map</h2>
            <div className="weather-map">
              <WeatherMap weather={weather} forecast={forecast} city={city} />
            </div>
          </section>
        )}
      </div>
    </DynamicBackground>
  );
}

export default App

