'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useSurvey from '@/hooks/useSurvey';
import { MdEdit, MdBarChart, MdVisibility, MdDelete, MdAdd, MdQrCode2, MdCheckCircle, MdCancel } from 'react-icons/md';
import QRCodeModal from '@/components/Dashboard/QRCodeModal';

export default function SurveysPage() {
  const { surveys, fetchSurveys, deleteSurvey } = useSurvey();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      await deleteSurvey(id);
    }
  };

  const handleShareClick = (id: string, title: string) => {
    setSelectedSurvey({ id, title });
    setQrModalOpen(true);
  };

  const getResponseCount = (survey: any) => {
    return survey.responseCount || 0;
  };

  const isAcceptingResponses = (survey: any) => {
    if (!survey.active) return false;
    
    if (survey.expirationDate) {
      const expirationDate = new Date(survey.expirationDate);
      const now = new Date();
      return now < expirationDate;
    }
    
    return true;
  };

  if (surveys.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-6">
              <MdAdd className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No surveys yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Create your first survey and start collecting responses</p>
            <Link
              href="/admin/surveys/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <MdAdd size={24} />
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
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">All Surveys</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all your surveys • {surveys.length} total
              </p>
            </div>
            <Link
              href="/admin/surveys/new"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <MdAdd size={20} />
              New Survey
            </Link>
          </div>
        </div>

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 gap-6">
          {surveys.map((survey, index) => {
            const responseCount = getResponseCount(survey);
            const accepting = isAcceptingResponses(survey);
            
            return (
              <motion.div
                key={survey._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start gap-6">
                  {/* Survey Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {survey.title?.charAt(0).toUpperCase() || 'S'}
                  </div>

                  {/* Survey Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                          {survey.title}
                        </h3>
                        {survey.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {survey.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                            accepting
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {accepting ? (
                            <>
                              <MdCheckCircle className="mr-1.5" size={16} />
                              Accepting Responses
                            </>
                          ) : (
                            <>
                              <MdCancel className="mr-1.5" size={16} />
                              Not Accepting
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {responseCount}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Response{responseCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                      
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Created: {survey.createdAt
                            ? new Date(survey.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </div>
                      </div>
                      
                      {survey.expirationDate && (
                        <>
                          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Expires: {new Date(survey.expirationDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareClick(survey._id!, survey.title)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors font-medium"
                        title="Share & QR Code"
                      >
                        <MdQrCode2 size={18} />
                        Share
                      </button>
                      
                      <Link
                        href={`/admin/surveys/${survey._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors font-medium"
                      >
                        <MdEdit size={18} />
                        Edit
                      </Link>
                      
                      <Link
                        href={`/admin/analytics/${survey._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-colors font-medium"
                      >
                        <MdBarChart size={18} />
                        Analytics
                      </Link>
                      
                      <Link
                        href={`/survey/${survey._id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg transition-colors font-medium"
                      >
                        <MdVisibility size={18} />
                        Preview
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(survey._id!)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors font-medium ml-auto"
                      >
                        <MdDelete size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedSurvey && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          surveyId={selectedSurvey.id}
          surveyTitle={selectedSurvey.title}
        />
      )}
    </div>
  );
}
