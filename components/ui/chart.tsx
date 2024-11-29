"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export function Chart({ data }: ChartProps) {
  const chartData: ChartData<'pie'> = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    })),
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: null,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
} 