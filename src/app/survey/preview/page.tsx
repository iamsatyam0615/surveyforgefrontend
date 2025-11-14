'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSurveyStore from '@/stores/useSurveyStore';
import { MdArrowBack } from 'react-icons/md';
import Link from 'next/link';

export default function PreviewPage() {
  const router = useRouter();
  const { title, description, questions, theme } = useSurveyStore();
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    if (!title || questions.length === 0) {
      alert('Please create a survey first before previewing');
      router.push('/admin/surveys/new');
    }
  }, [title, questions, router]);

  const renderQuestion = (q: any, index: number) => {
    const questionText = q.text || q.question || `Question ${index + 1}`;
    const questionType = q.type || 'text';

    return (
      <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <label className="block mb-4">
          <span className="text-lg font-semibold text-gray-900">
            {index + 1}. {questionText}
            {q.required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>

        {questionType === 'text' && (
          <input
            type="text"
            value={answers[index] || ''}
            onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
            placeholder="Your answer..."
          />
        )}

        {questionType === 'multipleChoice' && (
          <div className="space-y-3">
            {(q.options || []).map((option: string, i: number) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {questionType === 'checkbox' && (
          <div className="space-y-3">
            {(q.options || []).map((option: string, i: number) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={(answers[index] || []).includes(option)}
                  onChange={(e) => {
                    const current = answers[index] || [];
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter((o: string) => o !== option);
                    setAnswers({ ...answers, [index]: updated });
                  }}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {questionType === 'rating' && (
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: q.max || 5 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setAnswers({ ...answers, [index]: num })}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  answers[index] === num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!title) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/admin/surveys/new" className="hover:opacity-80">
            <MdArrowBack size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Preview Mode</h1>
            <p className="text-blue-100 text-sm">This is how your survey will look to respondents</p>
          </div>
        </div>
      </div>

      {/* Survey Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="border-l-4 border-blue-600 pl-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
            {description && <p className="text-gray-600 text-lg">{description}</p>}
          </div>

          <div className="space-y-6">
            {questions.map((q, index) => renderQuestion(q, index))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Preview Mode:</strong> This is a preview. Responses will not be saved.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/admin/surveys/new"
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all text-center"
            >
              Back to Editor
            </Link>
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              onClick={() => alert('This is preview mode. Publish your survey to collect real responses!')}
            >
              Submit (Preview)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
