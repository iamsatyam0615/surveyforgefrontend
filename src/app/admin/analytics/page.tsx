'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useSurvey from '@/hooks/useSurvey';
import { MdDownload, MdVisibility, MdBarChart, MdArrowBack } from 'react-icons/md';
import axios from 'axios';

interface ResponseData {
  _id: string;
  surveyId: string;
  answers: { questionId: string; answer: any }[];
  timestamp: string;
  ip?: string;
}

export default function AnalyticsPage() {
  const { surveys, fetchSurveys } = useSurvey();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const downloadCSV = async (surveyId: string, surveyTitle: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch responses for this survey
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/responses/${surveyId}`,
        {
          headers: { 'x-auth-token': token }
        }
      );

      const responses: ResponseData[] = response.data;
      
      if (responses.length === 0) {
        alert('No responses to download for this survey');
        return;
      }

      // Find the survey to get question details
      const survey = surveys.find(s => s._id === surveyId);
      if (!survey) return;

      // Create CSV headers
      const headers = ['Response ID', 'Timestamp', 'IP Address'];
      survey.questions.forEach((q) => {
        headers.push(q.question || q.text || 'Question');
      });

      // Create CSV rows
      const rows = responses.map((resp) => {
        const row: string[] = [
          resp._id,
          new Date(resp.timestamp).toLocaleString(),
          resp.ip || 'N/A'
        ];

        // Add answers in order of questions
        survey.questions.forEach((q) => {
          const answer = resp.answers.find(a => a.questionId === q._id);
          if (answer) {
            // Handle different answer types
            if (Array.isArray(answer.answer)) {
              row.push(answer.answer.join(', '));
            } else if (typeof answer.answer === 'object') {
              row.push(JSON.stringify(answer.answer));
            } else {
              row.push(String(answer.answer || ''));
            }
          } else {
            row.push('');
          }
        });

        return row;
      });

      // Generate CSV content
      const csvContent = [
        headers.map(h => `"${h}"`).join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${surveyTitle.replace(/[^a-z0-9]/gi, '_')}_responses.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (surveys.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <MdArrowBack size={18} />
              Back to Dashboard
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-6">
              <MdBarChart className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No surveys yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Create your first survey to see analytics</p>
            <Link
              href="/admin/surveys/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Create Your First Survey
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <MdArrowBack size={18} />
            Back to Dashboard
          </Link>
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and download response data for all your surveys
            </p>
          </div>
        </div>

        {/* Surveys Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Survey
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Responses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {surveys.map((survey, index) => (
                  <motion.tr
                    key={survey._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Survey Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {survey.title?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {survey.title}
                          </div>
                          {survey.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {survey.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Questions Count */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {survey.questions?.length || 0}
                      </div>
                    </td>

                    {/* Responses Count */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {survey.responseCount || 0}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          survey.active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            survey.active ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        {survey.active ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/analytics/${survey._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg transition-colors text-sm font-medium"
                        >
                          <MdVisibility size={16} />
                          View Details
                        </Link>
                        <button
                          onClick={() => downloadCSV(survey._id!, survey.title)}
                          disabled={loading || !survey.responseCount}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MdDownload size={16} />
                          {loading ? 'Downloading...' : 'Download CSV'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
