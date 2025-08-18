import React, { useEffect, useRef } from 'react';
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

const PrecipitationChart = ({ forecast }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Force chart update when data changes
    if (chartRef.current) {
      // Chart ref updated, forcing re-render
    }
  }, [forecast]);

  if (!forecast || forecast.length === 0) {
    return (
      <div className="precipitation-chart">
        <h3>7-Day Precipitation & Wind Forecast</h3>
        <div className="chart-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#f8f9fa' }}>
            <p>No forecast data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract dates and precipitation data
  const dates = forecast.map(day => {
    const date = new Date(day.date);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  });

  const precipitation = forecast.map(day => day.precipitation_mm);
  const maxWind = forecast.map(day => day.max_wind_kph);

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
      <h3>7-Day Precipitation & Wind Forecast</h3>
      <div className="chart-container">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default PrecipitationChart;
