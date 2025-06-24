import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#E5E7EB',
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleColor: '#F3F4F6',
      bodyColor: '#F3F4F6',
      borderColor: '#4B5563',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    x: {
      grid: {
        color: 'rgba(75, 85, 99, 0.1)',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
  },
};

const ChartComponent = ({ chartData, chartType = 'bar', title, className = '', isLoading = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    try {
      // Create new chart instance
      chartInstance.current = new ChartJS(ctx, {
        type: chartType,
        data: chartData,
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: !!title,
              text: title,
              color: '#F3F4F6',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType, title]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-800/50 rounded-lg p-8 ${className}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
          <div className="h-40 w-full bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className={`flex items-center justify-center bg-gray-800/50 rounded-lg p-8 ${className}`}>
        <p className="text-gray-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[400px] bg-gray-800/50 rounded-lg p-4 ${className}`}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartComponent;
