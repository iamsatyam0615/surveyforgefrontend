'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useSurvey from '@/hooks/useSurvey';
import { MdEdit, MdBarChart, MdVisibility, MdDelete, MdAdd, MdQrCode2 } from 'react-icons/md';
import QRCodeModal from './QRCodeModal';

export default function SurveyList() {
  const { surveys, fetchSurveys, deleteSurvey } = useSurvey();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<{ id: string; title: string } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleDeleteClick = (id: string, title: string) => {
    setSurveyToDelete({ id, title });
    setDeleteConfirmText('');
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText.toLowerCase() === 'delete' && surveyToDelete) {
      await deleteSurvey(surveyToDelete.id);
      setDeleteModalOpen(false);
      setSurveyToDelete(null);
      setDeleteConfirmText('');
    }
  };

  const handleShareClick = (id: string, title: string) => {
    setSelectedSurvey({ id, title });
    setQrModalOpen(true);
  };

  if (surveys.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
          <MdAdd className="text-4xl text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No surveys yet</h3>
        <p className="text-gray-600 mb-6">Create your first survey and start collecting responses</p>
        <Link
          href="/admin/surveys/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <MdAdd size={20} />
          Create Your First Survey
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Your Surveys</h3>
        <p className="text-sm text-gray-600">Manage and track all your surveys</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Survey
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {surveys.map((survey, index) => (
              <motion.tr
                key={survey._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {survey.title?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0 max-w-xs">
                      <div className="text-sm font-semibold text-gray-900 truncate">{survey.title}</div>
                      {survey.description && (
                        <div className="text-xs text-gray-500 line-clamp-2">{survey.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      survey.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
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
                <td className="px-6 py-4 text-sm text-gray-600">
                  {survey.createdAt
                    ? new Date(survey.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleShareClick(survey._id!, survey.title)}
                      className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group/btn"
                      title="Share & QR Code"
                    >
                      <MdQrCode2 className="text-indigo-600 group-hover/btn:scale-110 transition-transform" size={18} />
                    </button>
                    <Link
                      href={`/admin/surveys/${survey._id}`}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/btn"
                      title="Edit"
                    >
                      <MdEdit className="text-blue-600 group-hover/btn:scale-110 transition-transform" size={18} />
                    </Link>
                    <Link
                      href={`/admin/analytics/${survey._id}`}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors group/btn"
                      title="Analytics"
                    >
                      <MdBarChart className="text-green-600 group-hover/btn:scale-110 transition-transform" size={18} />
                    </Link>
                    <Link
                      href={`/survey/${survey._id}`}
                      target="_blank"
                      className="p-2 hover:bg-purple-50 rounded-lg transition-colors group/btn"
                      title="View"
                    >
                      <MdVisibility className="text-purple-600 group-hover/btn:scale-110 transition-transform" size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(survey._id!, survey.title)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group/btn"
                      title="Delete"
                    >
                      <MdDelete className="text-red-600 group-hover/btn:scale-110 transition-transform" size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && surveyToDelete && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setDeleteModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <MdDelete className="text-red-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Survey</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete <span className="font-semibold">"{surveyToDelete.title}"</span>?
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Type <span className="font-mono font-semibold text-red-600">delete</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type 'delete' here"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors font-mono text-gray-900 placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Survey
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
