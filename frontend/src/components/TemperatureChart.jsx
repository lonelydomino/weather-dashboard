import React, { useEffect, useRef } from 'react';
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
import { Line } from 'react-chartjs-2';

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

const TemperatureChart = ({ forecast, temperatureUnit = 'celsius' }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Force chart update when data changes
    if (chartRef.current) {
      // Chart ref updated, forcing re-render
    }
  }, [forecast, temperatureUnit]);

  if (!forecast || forecast.length === 0) {
    return (
      <div className="temperature-chart">
        <h3>7-Day Temperature Forecast</h3>
        <div className="chart-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#f8f9fa' }}>
            <p>No forecast data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract dates and temperatures from forecast data
  const dates = forecast.map(day => {
    const date = new Date(day.date);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  });

  const maxTemps = forecast.map(day => {
    const temp = temperatureUnit === 'celsius' ? day.max_temp_c : day.max_temp_f;
    return temp;
  });
  
  const minTemps = forecast.map(day => {
    const temp = temperatureUnit === 'celsius' ? day.min_temp_c : day.min_temp_f;
    return temp;
  });

  const data = {
    labels: dates,
    datasets: [
      {
        label: `High Temperature (${temperatureUnit === 'celsius' ? '°C' : '°F'})`,
        data: maxTemps,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ff6b6b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: `Low Temperature (${temperatureUnit === 'celsius' ? '°C' : '°F'})`,
        data: minTemps,
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4ecdc4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        position: 'top',
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
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}°${temperatureUnit === 'celsius' ? 'C' : 'F'}`;
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
          color: '#f8f9fa',
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
          color: '#f8f9fa',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + (temperatureUnit === 'celsius' ? '°C' : '°F');
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="temperature-chart">
      <h3>7-Day Temperature Forecast</h3>
      <div className="chart-container">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default TemperatureChart;
