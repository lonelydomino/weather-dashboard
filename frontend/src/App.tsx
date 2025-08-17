import { useState } from 'react'
import './App.css'

function App() {
  // State variables to store our data
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch weather data from our backend
  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8000/api/weather/current/${city}`);
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        setError('City not found or weather data unavailable');
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
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}

export default App
