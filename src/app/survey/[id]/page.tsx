'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useSurvey from '@/hooks/useSurvey';
import useResponses from '@/hooks/useResponses';
import { PRESET_THEMES } from '@/themes/presets';
import { loadGoogleFont } from '@/lib/themeUtils';
import ThankYouPage from '@/components/Survey/ThankYouPage';
import confetti from 'canvas-confetti';

export default function SurveyTakerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { loadPublicSurvey } = useSurvey();
  const { submitResponse } = useResponses();
  
  const [survey, setSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [authRequired, setAuthRequired] = useState(false);
  const [surveyNotFound, setSurveyNotFound] = useState(false);
  const [surveyExpired, setSurveyExpired] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const theme = survey?.theme || PRESET_THEMES.minimal;
  const questions = survey?.questions || [];

  // Check authentication on client side
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Decode token to get user email
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.user?.email || null);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    // Reset all state when survey ID changes
    setSurvey(null);
    setLoading(true);
    setSurveyExpired(false);
    setSurveyNotFound(false);
    setAuthRequired(false);
    setExpirationDate(null);
    
    loadPublicSurvey(params.id)
      .then(data => {
        setSurvey(data);
        setLoading(false);
        if (data?.theme?.font) {
          loadGoogleFont(data.theme.font);
        }
      })
      .catch((error) => {
        setLoading(false);
        // Check the type of error
        if (error.response?.status === 401) {
          setAuthRequired(true);
        } else if (error.response?.status === 410) {
          // Survey has expired
          setSurveyExpired(true);
          // Check both expiresAt (new) and expirationDate (old) fields
          const expiryDate = error.response?.data?.expiresAt || error.response?.data?.expirationDate;
          setExpirationDate(expiryDate);
        } else {
          setSurveyNotFound(true);
        }
      });
  }, [params.id, loadPublicSurvey]);

  // Auto-redirect countdown for auth-required surveys
  useEffect(() => {
    if ((survey?.requireAuth && !isAuthenticated && authChecked) || authRequired) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(`/auth/login?redirect=/survey/${params.id}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [survey, isAuthenticated, authChecked, authRequired, params.id, router]);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredQuestions = questions.filter((q: any) => q.required);
    const missing = requiredQuestions.some((q: any) => !answers[q._id]);

    if (missing) {
      alert('Please fill in all required questions.');
      return;
    }

    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      await submitResponse(params.id, answerArray);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853']
      });

      setSubmitted(true);
    } catch (error) {
      setSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  // Loading
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading survey...</p>
        </div>
      </div>
    );
  }

  // Not Found
  if (surveyNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center"
        >
          <div className="text-8xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Survey not found</h2>
          <p className="text-gray-600 mb-8">The survey may have been deleted or the link is incorrect.</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Survey Expired
  if (surveyExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 max-w-lg text-center relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10">
            {/* Clock Icon */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-8xl mb-6"
            >
              ⏰
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Survey Closed
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              This survey is <span className="font-semibold text-red-600 dark:text-red-400">no longer accepting responses</span>.
            </p>

            {expirationDate && (
              <div className="bg-orange-50 dark:bg-gray-700 rounded-xl p-4 mb-8">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Closed on:</p>
                <p className="text-md font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(expirationDate).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            )}

            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authentication Required
  if ((survey?.requireAuth && !isAuthenticated) || authRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 max-w-lg text-center relative overflow-hidden"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10">
            {/* Lock Icon with animation */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-8xl mb-6"
            >
              🔒
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Required
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              This survey requires you to be logged in to access it.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Don't have an account? You can create one in seconds!
            </p>

            {/* Auto-redirect timer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800"
            >
              <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-semibold">
                  Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
                </span>
              </div>
            </motion.div>

            {/* Manual action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/auth/login?redirect=/survey/${params.id}`)}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Login Now
              </button>
              
              <button
                onClick={() => router.push(`/auth/register?redirect=/survey/${params.id}`)}
                className="w-full px-8 py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-semibold rounded-xl border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all"
              >
                Create New Account
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                ← Back to Home
              </button>
            </div>

            {/* Help text */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <strong className="text-gray-700 dark:text-gray-300">Why do I need to login?</strong>
                <br />
                The survey creator has enabled authentication to ensure only registered users can participate.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Thank You
  if (submitted) {
    return <ThankYouPage surveyTitle={survey.title} theme={theme} />;
  }

  // Main Survey – Google Forms Classic View (All questions at once, centered)
  return (
    <div 
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
      style={{ fontFamily: theme?.font || 'Roboto, sans-serif' }}
    >
      {/* Google Forms Purple Top Bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: theme?.primary || '#673AB7' }}
      />

      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-10 py-8 bg-white border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              {survey.title}
            </h1>
            {survey.description && (
              <p className="text-sm text-gray-600 mb-6">{survey.description}</p>
            )}
            
            {/* Show authenticated user email */}
            {isAuthenticated && userEmail && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-700 font-medium">📧 Signed in as:</span>
                  <span className="text-blue-900 font-semibold">{userEmail}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span className="text-red-600">* Required</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-10 pb-10">
            <div className="space-y-8 pt-6">
              {questions.map((q: any, index: number) => {
                const answer = answers[q._id];
                const isRequired = q.required;

                return (
                  <motion.div
                    key={q._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 pb-8 last:border-0 last:pb-0"
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-start gap-2">
                        <span className="text-gray-600">{index + 1}.</span>
                        <span>{q.text || q.question}</span>
                        {isRequired && <span className="text-red-600 ml-1">*</span>}
                      </h3>
                      {q.description && (
                        <p className="text-sm text-gray-600 mt-2">{q.description}</p>
                      )}
                    </div>

                    {/* Short Text */}
                    {q.type === 'text' && (
                      <div>
                        <input
                          type="text"
                          value={answer || ''}
                          onChange={(e) => handleAnswer(q._id, e.target.value)}
                          placeholder="Your answer"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
                          required={isRequired}
                        />
                      </div>
                    )}

                    {/* Paragraph / Long Text */}
                    {q.type === 'paragraph' && (
                      <div>
                        <textarea
                          value={answer || ''}
                          onChange={(e) => handleAnswer(q._id, e.target.value)}
                          placeholder="Your answer"
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                          required={isRequired}
                        />
                      </div>
                    )}

                    {/* Dropdown */}
                    {q.type === 'dropdown' && (
                      <div>
                        <select
                          value={answer || ''}
                          onChange={(e) => handleAnswer(q._id, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-gray-900"
                          required={isRequired}
                        >
                          <option value="">Choose...</option>
                          {q.options?.map((option: string, i: number) => (
                            <option key={i} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Date Picker */}
                    {q.type === 'date' && (
                      <div>
                        <input
                          type="date"
                          value={answer || ''}
                          onChange={(e) => handleAnswer(q._id, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-gray-900"
                          required={isRequired}
                        />
                      </div>
                    )}

                    {/* Time Picker */}
                    {q.type === 'time' && (
                      <div>
                        <input
                          type="time"
                          value={answer || ''}
                          onChange={(e) => handleAnswer(q._id, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-gray-900"
                          required={isRequired}
                        />
                      </div>
                    )}

                    {/* Linear Scale */}
                    {q.type === 'scale' && (
                      <div className="flex flex-wrap gap-3 justify-center mt-4">
                        {Array.from({ length: (q.max || 10) - (q.min || 1) + 1 }, (_, i) => (q.min || 1) + i).map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleAnswer(q._id, num)}
                            className={`w-14 h-14 rounded-xl font-bold text-lg transition-all ${
                              answer === num
                                ? 'bg-blue-600 text-white scale-110'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Radio / Single Choice */}
                    {q.type === 'radio' && (
                      <div className="space-y-3 mt-4">
                        {q.options?.map((option: string, i: number) => (
                          <label
                            key={i}
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
                          >
                            <input
                              type="radio"
                              name={q._id}
                              value={option}
                              checked={answer === option}
                              onChange={() => handleAnswer(q._id, option)}
                              className="w-5 h-5 text-blue-600"
                              required={isRequired && !answer}
                            />
                            <span className="text-gray-800 text-lg">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Multiple Choice */}
                    {q.type === 'multiple' && (
                      <div className="space-y-3 mt-4">
                        {q.options?.map((option: string, i: number) => {
                          const selected = (answer || []).includes(option);
                          return (
                            <label
                              key={i}
                              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) => {
                                  const arr = answer || [];
                                  if (e.target.checked) {
                                    handleAnswer(q._id, [...arr, option]);
                                  } else {
                                    handleAnswer(q._id, arr.filter((o: string) => o !== option));
                                  }
                                }}
                                className="w-5 h-5 text-blue-600 rounded"
                              />
                              <span className="text-gray-800 text-lg">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Rating */}
                    {q.type === 'rating' && (
                      <div className="flex justify-center gap-6 py-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleAnswer(q._id, star)}
                            className="group"
                          >
                            <motion.div
                              whileHover={{ scale: 1.3 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-6xl transition-all"
                              style={{ color: answer >= star ? '#FBBC05' : '#E0E0E0' }}
                            >
                              {answer >= star ? '★' : '☆'}
                            </motion.div>
                            <span className="block text-xs text-gray-600 mt-2">
                              {star === 1 ? 'Poor' : star === 5 ? 'Great' : star}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="mt-12 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </motion.button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-10 py-6 text-center text-sm text-gray-600 border-t border-gray-100">
            <p>Powered by <span className="font-semibold">SurveyForge</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}