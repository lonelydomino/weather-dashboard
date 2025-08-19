interface WeatherIconProps {
  condition: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

const WeatherIcon = ({ condition, size = 'large', className = '' }: WeatherIconProps) => {
  const getWeatherIcon = (weatherCondition: string): string => {
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

  const getSizeClass = (iconSize: string): string => {
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
