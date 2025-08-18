import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

  useEffect(() => {
    console.log('=== WeatherMap useEffect triggered ===');
    console.log('Weather:', weather);
    console.log('Map ref:', mapRef.current);
    
    if (!weather) {
      console.log('Early return - no weather data');
      return;
    }
    
    // Wait for the ref to be ready
    if (!mapRef.current) {
      console.log('Map ref not ready, waiting...');
      // Use a timeout to wait for the ref to be attached
      const timer = setTimeout(() => {
        if (mapRef.current) {
          console.log('Ref is now ready, re-triggering effect');
          setCoordinates(prev => ({ ...prev }));
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // Debug: Log the weather data to see what we're getting
    console.log('Weather data for map:', weather);
    console.log('Coordinates:', weather.coordinates);
    console.log('Weather.coordinates type:', typeof weather.coordinates);
    console.log('Weather.coordinates.lat type:', typeof weather.coordinates?.lat);
    console.log('Weather.coordinates.lon type:', typeof weather.coordinates?.lon);
    console.log('Map ref current:', mapRef.current);

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      console.log('Initializing new map...');
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 10);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
      console.log('Map initialized successfully');
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
      console.log('Using API coordinates:', tempLat, tempLng);
    } else {
      console.log('No coordinates from API, using fallback');
      // Fallback: Try to get coordinates from city name
      // For now, we'll use some default coordinates
      tempLat = 40.7128; // Default to NYC coordinates
      tempLng = -74.0060;
    }

    // Additional validation for coordinates
    if (isNaN(tempLat) || isNaN(tempLng)) {
      console.log('Invalid coordinates, using fallback');
      tempLat = 40.7128;
      tempLng = -74.0060;
    }

    console.log('Final coordinates for map:', tempLat, tempLng);
    
    // Update coordinates state
    setCoordinates({ lat: tempLat, lng: tempLng });
    console.log('Coordinates state updated:', { lat: tempLat, lng: tempLng });

    if (tempLat && tempLng) {
      console.log('Setting map view to:', tempLat, tempLng);
      // Set map view to the city
      mapInstanceRef.current.setView([tempLat, tempLng], 12);
      console.log('Map view updated successfully');

      // Create custom weather icon
      const weatherIcon = L.divIcon({
        className: 'weather-marker',
        html: `
          <div class="marker-content">
            <div class="marker-temp">${Math.round(weather.current.temperature_c)}°C</div>
            <div class="marker-condition">${weather.current.condition}</div>
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
                </div>
              `,
              iconSize: [60, 40],
              iconAnchor: [30, 20],
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
  
  // Separate useEffect to handle ref initialization
  useEffect(() => {
    if (mapRef.current && weather && !mapInstanceRef.current) {
      console.log('Ref is ready, initializing map...');
      // Trigger the main useEffect by updating a state
      setCoordinates(prev => ({ ...prev }));
    }
  }, [mapRef.current, weather]);

  if (!weather) return null;
  
  // Debug the loading condition
  console.log('Render check - weather:', !!weather, 'coordinates:', coordinates, 'lat:', coordinates.lat, 'lng:', coordinates.lng);
  
  // Don't render map if coordinates are not available
  if (!coordinates.lat || !coordinates.lng) {
    console.log('Showing loading state - coordinates not ready');
    return (
      <div className="weather-map">
        <h3>Weather Map</h3>
        <div className="map-loading">
          <p>Loading map coordinates...</p>
          <p>Debug: lat={coordinates.lat}, lng={coordinates.lng}</p>
        </div>
      </div>
    );
  }
  
  console.log('Rendering map with coordinates:', coordinates.lat, coordinates.lng);

  return (
    <div className="weather-map">
      <h3>Weather Map</h3>
      
      {/* Debug info - remove this after fixing */}
      <div className="debug-info" style={{background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '10px', fontSize: '12px'}}>
        <strong>Debug Info:</strong><br/>
        City: {weather?.city}<br/>
        Coordinates: {weather?.coordinates ? `${weather.coordinates.lat}, ${weather.coordinates.lon}` : 'None'}<br/>
        Using: {coordinates.lat}, {coordinates.lng}
      </div>
      
      <div className="map-container">
        <div ref={mapRef} className="map" />
      </div>
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
    </div>
  );
};

export default WeatherMap;
