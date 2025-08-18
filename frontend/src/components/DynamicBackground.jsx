import React, { useEffect, useState } from 'react';

const DynamicBackground = ({ weather, children }) => {
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    if (!weather) return;

    const getBackgroundStyle = () => {
      const condition = weather.current.condition.toLowerCase();
      const hour = new Date().getHours();
      const isDay = hour >= 6 && hour <= 18;
      setIsDaytime(isDay);

      // Base styles for different weather conditions
      const weatherStyles = {
        // Sunny/Clear conditions
        sunny: {
          background: isDay 
            ? 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #87CEEB 75%, #98D8E8 100%)'
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%)',
          overlay: isDay 
            ? 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
          sunMoon: isDay ? '☀️' : '🌙',
          sunMoonPosition: isDay ? '20% 20%' : '80% 20%'
        },
        
        // Cloudy conditions
        cloudy: {
          background: isDay 
            ? 'linear-gradient(135deg, #B0C4DE 0%, #C8D4E6 25%, #D4E6F1 50%, #C8D4E6 75%, #B0C4DE 100%)'
            : 'linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #5d6d7e 50%, #34495e 75%, #2c3e50 100%)',
          overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          sunMoon: isDay ? '☁️' : '☁️',
          sunMoonPosition: '50% 50%'
        },
        
        // Rainy conditions
        rain: {
          background: isDay 
            ? 'linear-gradient(135deg, #4682B4 0%, #5F9EA0 25%, #708090 50%, #5F9EA0 75%, #4682B4 100%)'
            : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #3a5f7a 50%, #2a5298 75%, #1e3c72 100%)',
          overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
          sunMoon: '🌧️',
          sunMoonPosition: '50% 50%'
        },
        
        // Stormy conditions
        thunder: {
          background: isDay 
            ? 'linear-gradient(135deg, #2F4F4F 0%, #4A4A4A 25%, #696969 50%, #4A4A4A 75%, #2F4F4F 100%)'
            : 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%)',
          overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
          sunMoon: '⛈️',
          sunMoonPosition: '50% 50%'
        },
        
        // Snowy conditions
        snow: {
          background: isDay 
            ? 'linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 25%, #F8FBFF 50%, #F0F8FF 75%, #E8F4FD 100%)'
            : 'linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #5d6d7e 50%, #34495e 75%, #2c3e50 100%)',
          overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          sunMoon: '❄️',
          sunMoonPosition: '50% 50%'
        },
        
        // Foggy conditions
        fog: {
          background: isDay 
            ? 'linear-gradient(135deg, #D3D3D3 0%, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%, #D3D3D3 100%)'
            : 'linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 25%, #6a6a6a 50%, #5a5a5a 75%, #4a4a4a 100%)',
          overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          sunMoon: '🌫️',
          sunMoonPosition: '50% 50%'
        },
        
        // Windy conditions
        windy: {
          background: isDay 
            ? 'linear-gradient(135deg, #E6E6FA 0%, #F0F8FF 25%, #F8FBFF 50%, #F0F8FF 75%, #E6E6FA 100%)'
            : 'linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #5d6d7e 50%, #34495e 75%, #2c3e50 100%)',
          overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          sunMoon: '💨',
          sunMoonPosition: '50% 50%'
        }
      };

      // Determine which weather style to use
      let selectedStyle = weatherStyles.sunny; // default
      
      if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
        selectedStyle = weatherStyles.rain;
      } else if (condition.includes('thunder') || condition.includes('storm')) {
        selectedStyle = weatherStyles.thunder;
      } else if (condition.includes('snow') || condition.includes('sleet')) {
        selectedStyle = weatherStyles.snow;
      } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
        selectedStyle = weatherStyles.fog;
      } else if (condition.includes('windy') || condition.includes('breezy')) {
        selectedStyle = weatherStyles.windy;
      } else if (condition.includes('cloudy') || condition.includes('overcast') || condition.includes('partly cloudy')) {
        selectedStyle = weatherStyles.cloudy;
      }

      return {
        background: selectedStyle.background,
        '--overlay': selectedStyle.overlay,
        '--sun-moon': selectedStyle.sunMoon,
        '--sun-moon-position': selectedStyle.sunMoonPosition
      };
    };

    setBackgroundStyle(getBackgroundStyle());
  }, [weather]);

  return (
    <div className="dynamic-background" style={backgroundStyle}>
      <div className="background-overlay"></div>
      <div className="sun-moon-icon">{backgroundStyle['--sun-moon']}</div>
      {children}
    </div>
  );
};

export default DynamicBackground;
