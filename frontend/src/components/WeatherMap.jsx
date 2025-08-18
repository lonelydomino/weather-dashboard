import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WeatherIcon from './WeatherIcon';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WeatherMap = ({ weather, forecast, city }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // Function to get weather icon for map markers
  const getWeatherIcon = (weatherCondition) => {
    const conditionLower = weatherCondition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return '☁️';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('snow') || conditionLower.includes('sleet')) return '❄️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    if (conditionLower.includes('partly cloudy') || conditionLower.includes('scattered')) return '⛅';
    if (conditionLower.includes('windy') || conditionLower.includes('breezy')) return '💨';
    
    return '🌤️';
  };

  useEffect(() => {
    if (!weather) {
      return;
    }
    
    // Wait for the ref to be ready
    if (!mapRef.current) {
      // Use a timeout to wait for the ref to be attached
      const timer = setTimeout(() => {
        if (mapRef.current) {
          setCoordinates(prev => ({ ...prev }));
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // Find the map div within the ref container
      const mapElement = mapRef.current.querySelector('.map');
      if (!mapElement) {
        return;
      }
      mapInstanceRef.current = L.map(mapElement).setView([0, 0], 10);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Get coordinates from weather data
    let tempLat, tempLng;
    if (weather.coordinates && weather.coordinates.lat && weather.coordinates.lon) {
      tempLat = parseFloat(weather.coordinates.lat);
      tempLng = parseFloat(weather.coordinates.lon);
    } else {
      // Fallback: Try to get coordinates from city name
      // For now, we'll use some default coordinates
      tempLat = 40.7128; // Default to NYC coordinates
      tempLng = -74.0060;
    }

    // Additional validation for coordinates
    if (isNaN(tempLat) || isNaN(tempLng)) {
      tempLat = 40.7128;
      tempLng = -74.0060;
    }
    
    // Update coordinates state
    setCoordinates({ lat: tempLat, lng: tempLng });

    if (tempLat && tempLng) {
      // Set map view to the city
      mapInstanceRef.current.setView([tempLat, tempLng], 12);

      // Create custom weather icon
      const weatherIcon = L.divIcon({
        className: 'weather-marker',
        html: `
          <div class="marker-content">
            <div class="marker-temp">${Math.round(weather.current.temperature_c)}°C</div>
            <div class="marker-weather-icon">${getWeatherIcon(weather.current.condition)}</div>
          </div>
        `,
        iconSize: [80, 60],
        iconAnchor: [40, 30],
      });

      // Add weather marker
      const marker = L.marker([tempLat, tempLng], { icon: weatherIcon }).addTo(mapInstanceRef.current);

      // Add popup with weather details
      const popupContent = `
        <div class="map-popup">
          <h3>${weather.city}, ${weather.country}</h3>
          <div class="popup-weather">
            <div class="popup-temp">${weather.current.temperature_c}°C / ${weather.current.temperature_f}°F</div>
            <div class="popup-condition">${weather.current.condition}</div>
            <div class="popup-details">
              <p>Humidity: ${weather.current.humidity}%</p>
              <p>Wind: ${weather.current.wind_speed_kph} km/h</p>
              <p>Feels like: ${weather.current.feels_like_c}°C</p>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add forecast markers if available
      if (forecast && forecast.length > 0) {
        forecast.forEach((day, index) => {
          if (index < 3) { // Show next 3 days
            const forecastIcon = L.divIcon({
              className: 'forecast-marker',
              html: `
                <div class="forecast-marker-content">
                  <div class="forecast-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div class="forecast-temp">${Math.round(day.max_temp_c)}°</div>
                  <div class="forecast-weather-icon">${getWeatherIcon(day.condition)}</div>
                </div>
              `,
              iconSize: [60, 50],
              iconAnchor: [30, 25],
            });

            // Offset forecast markers slightly
            const offsetLat = coordinates.lat + (index + 1) * 0.01;
            const forecastMarker = L.marker([offsetLat, coordinates.lng], { icon: forecastIcon }).addTo(mapInstanceRef.current);
            
            const forecastPopup = `
              <div class="forecast-popup">
                <h4>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
                <div class="forecast-popup-weather">
                  <div class="forecast-popup-temp">High: ${day.max_temp_c}°C / Low: ${day.min_temp_c}°C</div>
                  <div class="forecast-popup-condition">${day.condition}</div>
                  <div class="forecast-popup-details">
                    <p>Precipitation: ${day.precipitation_mm}mm</p>
                    <p>Wind: ${day.max_wind_kph} km/h</p>
                    <p>UV: ${day.uv_index}</p>
                  </div>
                </div>
              </div>
            `;

            forecastMarker.bindPopup(forecastPopup);
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [weather, forecast, city]);
  
  // Remove the separate useEffect that was causing issues

  if (!weather) return null;
  
  // Debug the loading condition
  
  // Always render the container with ref, but conditionally show content
  return (
    <div className="weather-map" ref={mapRef}>
      <h3>Weather Map</h3>
      
      {/* Show loading state or map based on coordinates */}
      {!coordinates.lat || !coordinates.lng ? (
        <div className="map-loading">
          <p>Loading map coordinates...</p>
        </div>
      ) : null}
      
      {/* Always render map container so it can be found */}
      <div className="map-container">
        <div className="map" />
      </div>
      
      {/* Show legend only when coordinates are available */}
      {coordinates.lat && coordinates.lng && (
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-marker weather-marker"></div>
            <span>Current Weather</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker forecast-marker"></div>
            <span>3-Day Forecast</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;
