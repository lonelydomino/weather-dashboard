import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PrecipitationChart = ({ forecastData }) => {
  if (!forecastData || forecastData.length === 0) {
    return null;
  }

  // Extract dates and precipitation data
  const dates = forecastData.map(day => {
    const date = new Date(day.date);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  });

  const precipitation = forecastData.map(day => day.precipitation_mm);
  const maxWind = forecastData.map(day => day.max_wind_kph);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Precipitation (mm)',
        data: precipitation,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Max Wind Speed (km/h)',
        data: maxWind,
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            if (context.dataset.label.includes('Precipitation')) {
              return `${context.dataset.label}: ${context.parsed.y}mm`;
            } else {
              return `${context.dataset.label}: ${context.parsed.y} km/h`;
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
          color: '#f8f9fa',
          font: {
            size: 12
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
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
            return value + 'mm';
          }
        },
        title: {
          display: true,
          text: 'Precipitation (mm)',
          color: '#f8f9fa',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#f8f9fa',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + ' km/h';
          }
        },
        title: {
          display: true,
          text: 'Wind Speed (km/h)',
          color: '#f8f9fa',
          font: {
            size: 14,
            weight: 'bold'
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
    <div className="precipitation-chart">
      <h3>Precipitation & Wind Forecast</h3>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PrecipitationChart;
