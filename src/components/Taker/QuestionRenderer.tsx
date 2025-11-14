'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSurvey from '@/hooks/useSurvey';
import useResponses from '@/hooks/useResponses';
import Button from '../common/Button';
import { PRESET_THEMES } from '@/themes/presets';
import { 
  getBackgroundStyle, 
  getButtonStyle, 
  getCardStyle, 
  getTextStyle,
  getInputStyle,
  loadGoogleFont,
  getPatternStyle
} from '@/lib/themeUtils';

export default function QuestionRenderer({ surveyId }: { surveyId: string }) {
  const router = useRouter();
  const { loadPublicSurvey } = useSurvey();
  const { submitResponse } = useResponses();
  const [survey, setSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const theme = survey?.theme || PRESET_THEMES.minimal;

  useEffect(() => {
    loadPublicSurvey(surveyId).then(data => {
      setSurvey(data);
      setLoading(false);
      if (data?.theme?.font) {
        loadGoogleFont(data.theme.font);
      }
    }).catch(() => {
      setLoading(false);
    });
  }, [surveyId, loadPublicSurvey]);

  const handleSubmit = async () => {
    // Validate required questions
    const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    setSubmitting(true);
    try {
      await submitResponse(surveyId, answerArray);
      router.push('/survey/thank-you');
    } catch (error) {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p>Loading survey...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-red-600">Survey not found or has expired.</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8 transition-all duration-300"
      style={{
        ...getBackgroundStyle(theme),
        ...getPatternStyle(theme),
        fontFamily: theme.font,
      }}
    >
      <div 
        className={`max-w-3xl mx-auto p-8 shadow-xl ${theme.rounded}`}
        style={getCardStyle(theme)}
      >
        <h1 
          className="text-4xl font-bold mb-4" 
          style={getTextStyle(theme)}
        >
          {survey.title}
        </h1>
        {survey.description && (
          <p className="text-lg mb-8 opacity-80" style={getTextStyle(theme)}>
            {survey.description}
          </p>
        )}

        <div className="space-y-8">
          {survey.questions.map((question: any, index: number) => (
            <div key={question._id || index} className="pb-8 border-b" style={{ borderColor: theme.accent + '30' }}>
              <label className="block text-xl font-semibold mb-4" style={getTextStyle(theme)}>
                {index + 1}. {question.question}
                {question.required && <span style={{ color: theme.primary }} className="ml-2">*</span>}
              </label>

              {question.type === 'text' && (
                <input
                  type="text"
                  className={`w-full p-4 border-2 ${theme.rounded} focus:outline-none focus:ring-2 transition-all`}
                  style={{
                    ...getInputStyle(theme),
                    backgroundColor: theme.background === '#0F172A' ? '#1E293B' : '#FFFFFF',
                  }}
                  placeholder="Your answer..."
                  onChange={(e) => setAnswers({ ...answers, [question._id]: e.target.value })}
                />
              )}

              {question.type === 'multiple' && question.options.map((option: string, optIndex: number) => (
                <label key={optIndex} className="flex items-center mb-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mr-4 h-5 w-5 cursor-pointer"
                    style={{ accentColor: theme.primary }}
                    onChange={(e) => {
                      const current = answers[question._id] || [];
                      if (e.target.checked) {
                        setAnswers({ ...answers, [question._id]: [...current, option] });
                      } else {
                        setAnswers({ ...answers, [question._id]: current.filter((v: string) => v !== option) });
                      }
                    }}
                  />
                  <span className="text-lg group-hover:opacity-80 transition-opacity" style={getTextStyle(theme)}>
                    {option}
                  </span>
                </label>
              ))}

              {question.type === 'radio' && question.options.map((option: string, optIndex: number) => (
                <label key={optIndex} className="flex items-center mb-3 cursor-pointer group">
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    className="mr-4 h-5 w-5 cursor-pointer"
                    style={{ accentColor: theme.primary }}
                    onChange={() => setAnswers({ ...answers, [question._id]: option })}
                  />
                  <span className="text-lg group-hover:opacity-80 transition-opacity" style={getTextStyle(theme)}>
                    {option}
                  </span>
                </label>
              ))}

              {question.type === 'rating' && (
                <div className="flex space-x-3">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      className="text-5xl hover:scale-125 transition-transform"
                      onClick={() => setAnswers({ ...answers, [question._id]: rating })}
                      style={{ 
                        color: answers[question._id] >= rating ? theme.primary : theme.accent + '30' 
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full mt-8 py-4 px-8 text-lg font-bold ${theme.rounded} transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          style={getButtonStyle(theme)}
        >
          {submitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </div>
    </div>
  );
}
