"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Module Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function SalesChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return 'Rp ' + context.parsed.y.toLocaleString('id-ID');
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        ticks: { 
          color: '#9ca3af',
          font: { size: 10 },
          callback: function(value) {
            return (value / 1000) + 'k';
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 10 } }
      }
    },
    elements: {
      line: { tension: 0.4 } // Garis melengkung halus
    }
  };

  const data = {
    labels: ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'],
    datasets: [
      {
        fill: true,
        label: 'Penjualan',
        data: [120000, 190000, 150000, 250000, 220000, 300000, 280000],
        borderColor: '#f97316', // Orange-500 Hex (approx)
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#f97316',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return <Line options={options} data={data} />;
}