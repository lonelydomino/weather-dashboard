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
        console.log('Raw forecast response:', forecastData);
        console.log('Forecast data structure:', {
          hasForecast: !!forecastData.forecast,
          forecastLength: forecastData.forecast?.length,
          forecastKeys: forecastData.forecast?.[0] ? Object.keys(forecastData.forecast[0]) : [],
          sampleForecast: forecastData.forecast?.[0]
        });
        setForecast(forecastData.forecast);
        console.log('Set forecast state:', forecastData.forecast);
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
              {console.log('Rendering TemperatureChart with forecast:', forecast)}
              {console.log('Forecast data for TemperatureChart:', {
                length: forecast.length,
                firstDay: forecast[0],
                hasMaxTemp: forecast[0]?.max_temp_c !== undefined,
                hasMinTemp: forecast[0]?.min_temp_c !== undefined
              })}
              <TemperatureChart forecast={forecast} temperatureUnit={temperatureUnit} />
            </div>
            <div className="chart-container">
              {console.log('Rendering PrecipitationChart with forecast:', forecast)}
              {console.log('Forecast data for PrecipitationChart:', {
                length: forecast.length,
                firstDay: forecast[0],
                hasPrecipitation: forecast[0]?.precipitation_mm !== undefined,
                hasWind: forecast[0]?.max_wind_kph !== undefined
              })}
              <PrecipitationChart forecast={forecast} />
            </div>
          </section>
        )}
        
        {/* Debug: Show forecast data if available */}
        {forecast && forecast.length > 0 && (
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', margin: '1rem', borderRadius: '10px' }}>
            <h4>Debug: Forecast Data</h4>
            <pre style={{ color: 'white', fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(forecast, null, 2)}
            </pre>
          </div>
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

