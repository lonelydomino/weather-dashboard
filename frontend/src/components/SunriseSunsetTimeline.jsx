import React from 'react';

const SunriseSunsetTimeline = ({ forecast, temperatureUnit = 'fahrenheit' }) => {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="sunrise-sunset-timeline">
        <div className="timeline-header">
          <h3>🌅 Sunrise & Sunset</h3>
        </div>
        <div className="timeline-content">
          <p>No forecast data available</p>
        </div>
      </div>
    );
  }

  // Get today's sunrise/sunset data
  const today = forecast[0];
  const sunriseTime = today.sunrise;
  const sunsetTime = today.sunset;

  // Parse times for calculations
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  const sunriseHour = parseTime(sunriseTime);
  const sunsetHour = parseTime(sunsetTime);
  const currentHour = new Date().getHours() + new Date().getMinutes() / 60;

  // Calculate golden hour times (1 hour before sunset, 1 hour after sunrise)
  const goldenHourStart = sunsetHour - 1;
  const goldenHourEnd = sunriseHour + 1;

  // Determine current period
  const getCurrentPeriod = () => {
    if (currentHour >= sunriseHour && currentHour < sunriseHour + 1) return 'sunrise';
    if (currentHour >= goldenHourStart && currentHour < sunsetHour) return 'golden-hour';
    if (currentHour >= sunsetHour && currentHour < sunsetHour + 1) return 'sunset';
    if (currentHour >= 22 || currentHour < 6) return 'night';
    if (currentHour >= 6 && currentHour < sunsetHour) return 'day';
    return 'evening';
  };

  const currentPeriod = getCurrentPeriod();

  // Get period icon and color
  const getPeriodInfo = (period) => {
    switch (period) {
      case 'sunrise':
        return { icon: '🌅', color: '#FF6B6B', label: 'Sunrise' };
      case 'golden-hour':
        return { icon: '✨', color: '#FFD93D', label: 'Golden Hour' };
      case 'sunset':
        return { icon: '🌇', color: '#FF8E53', label: 'Sunset' };
      case 'night':
        return { icon: '🌙', color: '#4A90E2', label: 'Night' };
      case 'day':
        return { icon: '☀️', color: '#FFD93D', label: 'Day' };
      case 'evening':
        return { icon: '🌆', color: '#9B59B6', label: 'Evening' };
      default:
        return { icon: '🌤️', color: '#95A5A6', label: 'Unknown' };
    }
  };

  const periodInfo = getPeriodInfo(currentPeriod);

  // Format time for display
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate day length
  const dayLength = sunsetHour - sunriseHour;
  const dayLengthHours = Math.floor(dayLength);
  const dayLengthMinutes = Math.round((dayLength - dayLengthHours) * 60);

  return (
    <div className="sunrise-sunset-timeline">
      <div className="timeline-header">
        <h3>🌅 Sunrise & Sunset</h3>
        <div className="current-period">
          <span className="period-icon">{periodInfo.icon}</span>
          <span className="period-label">{periodInfo.label}</span>
        </div>
      </div>
      
      <div className="timeline-content">
        <div className="time-display">
          <div className="time-item sunrise">
            <div className="time-icon">🌅</div>
            <div className="time-info">
              <div className="time-label">Sunrise</div>
              <div className="time-value">{formatTime(sunriseTime)}</div>
            </div>
          </div>
          
          <div className="time-item sunset">
            <div className="time-icon">🌇</div>
            <div className="time-info">
              <div className="time-label">Sunset</div>
              <div className="time-value">{formatTime(sunsetTime)}</div>
            </div>
          </div>
        </div>

        <div className="day-info">
          <div className="day-length">
            <span className="day-length-icon">⏱️</span>
            <span className="day-length-text">
              Day Length: {dayLengthHours}h {dayLengthMinutes}m
            </span>
          </div>
          
          <div className="golden-hours">
            <div className="golden-hour-item">
              <span className="golden-hour-icon">✨</span>
              <span className="golden-hour-text">
                Golden Hour: {formatTime(sunriseTime)} - {formatTime(sunsetTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-visual">
          <div className="timeline-bar">
            <div className="timeline-marker sunrise-marker" style={{ left: '0%' }}>
              <span className="marker-icon">🌅</span>
              <span className="marker-time">{formatTime(sunriseTime)}</span>
            </div>
            
            <div className="timeline-marker sunset-marker" style={{ left: '100%' }}>
              <span className="marker-icon">🌇</span>
              <span className="marker-time">{formatTime(sunsetTime)}</span>
            </div>
            
            <div className="timeline-marker current-marker" 
                 style={{ 
                   left: `${Math.max(0, Math.min(100, ((currentHour - sunriseHour) / (sunsetHour - sunriseHour)) * 100))}%` 
                 }}>
              <span className="marker-icon">📍</span>
              <span className="marker-label">Now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunsetTimeline;
