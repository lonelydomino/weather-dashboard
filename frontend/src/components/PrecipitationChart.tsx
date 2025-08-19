import { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ForecastData {
  date: string;
  precipitation_mm: number;
  max_wind_kph: number;
  condition: string;
}

interface PrecipitationChartProps {
  forecast: ForecastData[];
}

const PrecipitationChart = ({ forecast }: PrecipitationChartProps) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [forecast]);

  if (!forecast || forecast.length === 0) {
    return (
      <div className="precipitation-chart">
        <h3>Precipitation & Wind Forecast</h3>
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

  const precipitation = forecast.map(day => day.precipitation_mm);
  const maxWind = forecast.map(day => day.max_wind_kph);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Precipitation (mm)',
        data: precipitation,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'Max Wind (km/h)',
        data: maxWind,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        yAxisID: 'y1'
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
            weight: 'bold'
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
            if (label.includes('Precipitation')) {
              return `${label}: ${value} mm`;
            } else {
              return `${label}: ${value} km/h`;
            }
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
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
            return `${value} mm`;
          }
        },
        title: {
          display: true,
          text: 'Precipitation (mm)',
          color: '#e9ecef',
          font: {
            size: 12
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#e9ecef',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return `${value} km/h`;
          }
        },
        title: {
          display: true,
          text: 'Wind Speed (km/h)',
          color: '#e9ecef',
          font: {
            size: 12
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
    <div className="precipitation-chart">
      <h3>Precipitation & Wind Forecast</h3>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default PrecipitationChart;
