import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const IntegrityChart = ({ stats }) => {
  const data = {
    labels: ['Healthy', 'Critical'],
    datasets: [
      {
        data: [stats.healthy_assets, stats.critical_issues],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)', // Green-500
          'rgba(239, 68, 68, 0.6)', // Red-500
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  return (
    <div className="relative h-64 w-64 mx-auto flex items-center justify-center">
      <div className="absolute text-center">
        <p className="text-3xl font-jetbrains font-bold text-white">
          {Math.round((stats.healthy_assets / stats.total_assets) * 100) || 0}%
        </p>
        <p className="text-[10px] uppercase text-sl-muted tracking-widest">Integrity Index</p>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default IntegrityChart;
