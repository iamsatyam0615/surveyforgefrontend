'use client';

import { useEffect } from 'react';
import useResponses from '@/hooks/useResponses';
import Button from '../common/Button';

export default function ResponseTable({ surveyId }: { surveyId: string }) {
  const { responses, fetchResponses, exportCSV } = useResponses();

  useEffect(() => {
    if (surveyId) {
      fetchResponses(surveyId);
    }
  }, [surveyId, fetchResponses]);

  if (responses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center mt-6">
        <p className="text-gray-500">No responses yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Responses ({responses.length})</h2>
        <Button onClick={() => exportCSV(surveyId)} variant="secondary">
          Export CSV
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answers</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {responses.map((response) => (
              <tr key={response._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {response._id?.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(response.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {response.answers.length} answers
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
