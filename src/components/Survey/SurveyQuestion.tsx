'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SurveyQuestionProps {
  question: any;
  index: number;
  total: number;
  answer: any;
  onAnswer: (answer: any) => void;
  onNext: () => void;
  onPrev: () => void;
  theme?: any;
  isFirst: boolean;
  isLast: boolean;
}

export default function SurveyQuestion({
  question,
  index,
  total,
  answer,
  onAnswer,
  onNext,
  onPrev,
  theme,
  isFirst,
  isLast
}: SurveyQuestionProps) {
  const [error, setError] = useState('');
  const primaryColor = theme?.primary || '#3B82F6';
  const accentColor = theme?.accent || '#1F2937';

  const handleNext = () => {
    if (question.required && !answer) {
      setError('This question is required');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    onNext();
  };

  const handleAnswerChange = (value: any) => {
    setError('');
    onAnswer(value);
  };

  return (
    <motion.div
      key={question._id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-120px)] flex flex-col justify-center py-8 px-6"
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Question Number Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center px-4 py-2 rounded-full mb-6 text-sm font-medium"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor
          }}
        >
          Question {index + 1} of {total}
        </motion.div>

        {/* Question Text */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 leading-tight"
        >
          {question.question}
          {question.required && (
            <span style={{ color: primaryColor }} className="ml-2">*</span>
          )}
        </motion.h2>

        {/* Answer Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          {/* Text Input */}
          {question.type === 'text' && (
            <input
              type="text"
              value={answer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              placeholder="Type your answer here..."
              autoFocus
              className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none transition-all duration-300"
              style={{
                borderColor: answer ? primaryColor : undefined,
                boxShadow: answer ? `0 0 0 3px ${primaryColor}15` : undefined
              }}
            />
          )}

          {/* Multiple Choice */}
          {question.type === 'multiple' && (
            <div className="space-y-3">
              {question.options?.map((option: string, optIndex: number) => {
                const isSelected = answer?.includes(option);
                return (
                  <motion.label
                    key={optIndex}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: isSelected ? primaryColor : '#E5E7EB',
                      backgroundColor: isSelected ? `${primaryColor}05` : 'white',
                      boxShadow: isSelected ? `0 4px 12px ${primaryColor}20` : undefined
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const current = answer || [];
                        if (e.target.checked) {
                          handleAnswerChange([...current, option]);
                        } else {
                          handleAnswerChange(current.filter((v: string) => v !== option));
                        }
                      }}
                      className="w-6 h-6 rounded-lg cursor-pointer"
                      style={{ accentColor: primaryColor }}
                    />
                    <span className="ml-4 text-lg font-medium text-gray-800">{option}</span>
                  </motion.label>
                );
              })}
            </div>
          )}

          {/* Radio (Single Choice) */}
          {question.type === 'radio' && (
            <div className="space-y-3">
              {question.options?.map((option: string, optIndex: number) => {
                const isSelected = answer === option;
                return (
                  <motion.label
                    key={optIndex}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleAnswerChange(option);
                      setTimeout(() => handleNext(), 300);
                    }}
                    className="flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: isSelected ? primaryColor : '#E5E7EB',
                      backgroundColor: isSelected ? `${primaryColor}05` : 'white',
                      boxShadow: isSelected ? `0 4px 12px ${primaryColor}20` : undefined
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: isSelected ? primaryColor : '#9CA3AF' }}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        />
                      )}
                    </div>
                    <span className="ml-4 text-lg font-medium text-gray-800">{option}</span>
                  </motion.label>
                );
              })}
            </div>
          )}

          {/* Star Rating */}
          {question.type === 'rating' && (
            <div className="flex justify-center gap-4 py-8">
              {[1, 2, 3, 4, 5].map((rating) => {
                const isActive = answer >= rating;
                return (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      handleAnswerChange(rating);
                      setTimeout(() => handleNext(), 400);
                    }}
                    className="text-7xl sm:text-8xl transition-all"
                    style={{
                      color: isActive ? primaryColor : '#E5E7EB',
                      filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'none'
                    }}
                  >
                    {isActive ? '⭐' : '☆'}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-between"
        >
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="px-8 py-4 rounded-full font-semibold bg-white border-2 border-gray-200 hover:border-gray-300 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            ← Back
          </button>
          
          <button
            onClick={handleNext}
            className="px-12 py-4 rounded-full font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            {isLast ? 'Submit 🎉' : 'Next →'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
