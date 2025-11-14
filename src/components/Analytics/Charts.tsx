'use client';

import { useEffect, useState } from 'react';
import useResponses from '@/hooks/useResponses';
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

export default function Charts({ surveyId }: { surveyId: string }) {
  const { responses, fetchResponses } = useResponses();
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (surveyId) {
      fetchResponses(surveyId);
    }
  }, [surveyId, fetchResponses]);

  useEffect(() => {
    if (responses.length > 0) {
      // Simple aggregation for demonstration
      const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Responses',
            data: [responses.length, 0, 0, 0],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          }
        ]
      };
      setChartData(data);
    }
  }, [responses]);

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <p className="text-gray-500 text-center">No data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Response Analytics</h2>
      <Bar 
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Survey Responses Over Time'
            }
          }
        }}
      />
    </div>
  );
}
