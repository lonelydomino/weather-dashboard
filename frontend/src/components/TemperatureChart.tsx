import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastData {
  date: string;
  max_temp_c: number;
  min_temp_c: number;
  max_temp_f: number;
  min_temp_f: number;
  condition: string;
}

interface TemperatureChartProps {
  forecast: ForecastData[];
  temperatureUnit?: 'celsius' | 'fahrenheit';
}

const TemperatureChart = ({ forecast, temperatureUnit = 'fahrenheit' }: TemperatureChartProps) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [forecast, temperatureUnit]);

  if (!forecast || forecast.length === 0) {
    return (
      <div className="temperature-chart">
        <h3>Temperature Forecast</h3>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No forecast data available
        </div>
      </div>
    );
  }

  // Process forecast data
  const dates = forecast.map(day => {
    const date = new Date(day.date);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  const maxTemps = forecast.map(day => {
    return temperatureUnit === 'celsius' ? day.max_temp_c : day.max_temp_f;
  });

  const minTemps = forecast.map(day => {
    return temperatureUnit === 'celsius' ? day.min_temp_c : day.min_temp_f;
  });

  const data = {
    labels: dates,
    datasets: [
      {
        label: `Max Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`,
        data: maxTemps,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ff6b6b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: `Min Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`,
        data: minTemps,
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4ecdc4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f8f9fa',
          font: {
            size: 14,
            weight: 'bold' as const
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}°${temperatureUnit === 'celsius' ? 'C' : 'F'}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#e9ecef',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#e9ecef',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return `${value}°${temperatureUnit === 'celsius' ? 'C' : 'F'}`;
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    }
  };

  return (
    <div className="temperature-chart">
      <h3>Temperature Forecast</h3>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default TemperatureChart;
