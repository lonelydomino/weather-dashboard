import React from 'react';

const WeatherIcon = ({ condition, size = 'large', className = '' }) => {
  // Map weather conditions to appropriate icons
  const getWeatherIcon = (weatherCondition) => {
    const conditionLower = weatherCondition.toLowerCase();
    
    // Sunny/Clear conditions
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return '☀️';
    }
    
    // Cloudy conditions
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return '☁️';
    }
    
    // Rainy conditions
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      return '🌧️';
    }
    
    // Stormy conditions
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return '⛈️';
    }
    
    // Snowy conditions
    if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
      return '❄️';
    }
    
    // Foggy/Misty conditions
    if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
      return '🌫️';
    }
    
    // Partly cloudy
    if (conditionLower.includes('partly cloudy') || conditionLower.includes('scattered clouds')) {
      return '⛅';
    }
    
    // Windy conditions
    if (conditionLower.includes('windy') || conditionLower.includes('breezy')) {
      return '💨';
    }
    
    // Hot conditions
    if (conditionLower.includes('hot') || conditionLower.includes('scorching')) {
      return '🔥';
    }
    
    // Cold conditions
    if (conditionLower.includes('cold') || conditionLower.includes('freezing')) {
      return '🥶';
    }
    
    // Default fallback
    return '🌤️';
  };

  // Get icon size classes
  const getSizeClass = (iconSize) => {
    switch (iconSize) {
      case 'small':
        return 'weather-icon-small';
      case 'medium':
        return 'weather-icon-medium';
      case 'large':
        return 'weather-icon-large';
      case 'xlarge':
        return 'weather-icon-xlarge';
      default:
        return 'weather-icon-large';
    }
  };

  const icon = getWeatherIcon(condition);
  const sizeClass = getSizeClass(size);

  return (
    <div className={`weather-icon ${sizeClass} ${className}`}>
      <span className="weather-icon-emoji" role="img" aria-label={condition}>
        {icon}
      </span>
      <div className="weather-icon-label">{condition}</div>
    </div>
  );
};

export default WeatherIcon;
