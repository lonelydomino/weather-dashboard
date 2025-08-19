import { useEffect, useState } from 'react';

interface WeatherData {
  current: {
    condition: string;
  };
}

interface DynamicBackgroundProps {
  weather: WeatherData | null;
  children: React.ReactNode;
}

interface BackgroundStyle {
  '--overlay'?: string;
  '--sun-moon-position'?: string;
  '--sun-moon'?: string;
  [key: string]: string | undefined;
}

const DynamicBackground = ({ weather, children }: DynamicBackgroundProps) => {
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>({});

  useEffect(() => {
    if (!weather) return;

    const getBackgroundStyle = (): BackgroundStyle => {
      const condition = weather.current.condition.toLowerCase();
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18;

      if (condition.includes('rain') || condition.includes('drizzle')) {
        return {
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
          '--overlay': 'rgba(52, 73, 94, 0.3)',
          '--sun-moon-position': '20% 20%',
          '--sun-moon': '🌧️'
        };
      } else if (condition.includes('snow') || condition.includes('sleet')) {
        return {
          background: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 50%, #95a5a6 100%)',
          '--overlay': 'rgba(236, 240, 241, 0.3)',
          '--sun-moon-position': '20% 20%',
          '--sun-moon': '❄️'
        };
      } else if (condition.includes('thunder') || condition.includes('storm')) {
        return {
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
          '--overlay': 'rgba(52, 73, 94, 0.4)',
          '--sun-moon-position': '20% 20%',
          '--sun-moon': '⛈️'
        };
      } else if (condition.includes('fog') || condition.includes('mist')) {
        return {
          background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 50%, #7f8c8d 100%)',
          '--overlay': 'rgba(189, 195, 199, 0.3)',
          '--sun-moon-position': '20% 20%',
          '--sun-moon': '🌫️'
        };
      } else if (condition.includes('wind') || condition.includes('breezy')) {
        return {
          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)',
          '--overlay': 'rgba(116, 185, 255, 0.2)',
          '--sun-moon-position': '20% 20%',
          '--sun-moon': '💨'
        };
      } else if (isDaytime) {
        if (condition.includes('sunny') || condition.includes('clear')) {
          return {
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)',
            '--overlay': 'rgba(116, 185, 255, 0.2)',
            '--sun-moon-position': '20% 20%',
            '--sun-moon': '☀️'
          };
        } else if (condition.includes('cloudy') || condition.includes('overcast')) {
          return {
            background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 50%, #7f8c8d 100%)',
            '--overlay': 'rgba(189, 195, 199, 0.3)',
            '--sun-moon-position': '20% 20%',
            '--sun-moon': '☁️'
          };
        } else {
          return {
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)',
            '--overlay': 'rgba(116, 185, 255, 0.2)',
            '--sun-moon-position': '20% 20%',
            '--sun-moon': '⛅'
          };
        }
      } else {
        // Nighttime
        if (condition.includes('clear')) {
          return {
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
            '--overlay': 'rgba(44, 62, 80, 0.3)',
            '--sun-moon-position': '20% 20%',
            '--sun-moon': '🌙'
          };
        } else {
          return {
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
            '--overlay': 'rgba(44, 62, 80, 0.3)',
            '--sun-moon-position': '20% 20%',
            '--sun-moon': '🌙'
          };
        }
      }
    };

    setBackgroundStyle(getBackgroundStyle());
  }, [weather]);

  return (
    <div className="dynamic-background" style={backgroundStyle}>
      <div className="background-overlay" style={{ background: backgroundStyle['--overlay'] }}></div>
      <div 
        className="sun-moon-icon" 
        style={{ 
          top: backgroundStyle['--sun-moon-position']?.split(' ')[0] || '20%', 
          left: backgroundStyle['--sun-moon-position']?.split(' ')[1] || '20%' 
        }}
      >
        {backgroundStyle['--sun-moon']}
      </div>
      {children}
    </div>
  );
};

export default DynamicBackground;
