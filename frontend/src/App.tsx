import { useState } from 'react'
import './App.css'
import { TemperatureChart, PrecipitationChart } from './components'

function App() {
  // State variables to store our data
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch weather data from our backend
  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(`http://localhost:8000/api/weather/current/${city}`);
      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
      } else {
        setError('City not found or weather data unavailable');
        return;
      }

      // Fetch forecast data
      const forecastResponse = await fetch(`http://localhost:8000/api/weather/forecast/${city}`);
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.forecast);
      }
    } catch (err) {
      setError('Failed to fetch weather data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌤️ Weather Dashboard</h1>
        
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
                {weather.current.temperature_c}°C / {weather.current.temperature_f}°F
              </div>
              <div className="condition">
                {weather.current.condition}
              </div>
              <div className="details">
                <p>Humidity: {weather.current.humidity}%</p>
                <p>Wind: {weather.current.wind_speed_kph} km/h</p>
                <p>Feels like: {weather.current.feels_like_c}°C</p>
                <p>Pressure: {weather.current.pressure_mb} mb</p>
                <p>UV Index: {weather.current.uv_index}</p>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {forecast && forecast.length > 0 && (
          <div className="charts-section">
            <TemperatureChart forecastData={forecast} />
            <PrecipitationChart forecastData={forecast} />
          </div>
        )}
      </header>
    </div>
  )
}

export default App
