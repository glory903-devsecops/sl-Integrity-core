import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DepartmentChart = ({ deptStats }) => {
  const labels = Object.keys(deptStats);
  const totalData = labels.map(label => deptStats[label].total);
  const healthyData = labels.map(label => deptStats[label].healthy);

  const data = {
    labels,
    datasets: [
      {
        label: 'Healthy Assets',
        data: healthyData,
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green-500
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Critical Assets',
        data: labels.map((label, idx) => totalData[idx] - healthyData[idx]),
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red-500
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a1a1aa', // zinc-400
          font: { family: 'Inter, sans-serif', size: 10 }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#71717a', font: { size: 9 } }
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a', font: { size: 9 } }
      }
    }
  };

  return (
    <div className="h-64 w-full px-2">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DepartmentChart;
