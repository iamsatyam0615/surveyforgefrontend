'use client';

import { useEffect } from 'react';
import useSurveyStore from '@/stores/useSurveyStore';
import { QRCodeSVG } from 'qrcode.react';
import { PRESET_THEMES } from '@/themes/presets';
import { 
  getBackgroundStyle, 
  getButtonStyle, 
  getCardStyle, 
  getTextStyle,
  loadGoogleFont,
  getPatternStyle
} from '@/lib/themeUtils';

export default function Preview() {
  const { title, description, questions, surveyId, survey } = useSurveyStore();
  const theme = survey?.theme || PRESET_THEMES.minimal;
  
  const surveyUrl = surveyId 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/survey/${surveyId}`
    : '';

  // Load Google Font
  useEffect(() => {
    if (theme.font) {
      loadGoogleFont(theme.font);
    }
  }, [theme.font]);

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
      
      <div 
        className="min-h-[400px] p-6 rounded-lg shadow-lg transition-all duration-300"
        style={{
          ...getBackgroundStyle(theme),
          ...getPatternStyle(theme),
          fontFamily: theme.font,
        }}
      >
        <div 
          className={`p-6 ${theme.rounded} shadow-xl mb-4`}
          style={getCardStyle(theme)}
        >
          <h3 
            className="text-2xl font-bold mb-2" 
            style={getTextStyle(theme)}
          >
            {title || 'Untitled Survey'}
          </h3>
          {description && (
            <p className="text-sm mb-4 opacity-80" style={getTextStyle(theme)}>
              {description}
            </p>
          )}
          
          <div className="space-y-4">
            {questions.slice(0, 2).map((q, i) => (
              <div key={i} className="border-t pt-3" style={{ borderColor: theme.accent + '30' }}>
                <p className="font-medium text-sm mb-2" style={getTextStyle(theme)}>
                  {i + 1}. {q.question || 'Question text...'}
                  {q.required && <span style={{ color: theme.primary }} className="ml-1">*</span>}
                </p>
                
                {q.type === 'text' && (
                  <input 
                    type="text" 
                    disabled 
                    placeholder="Text answer..." 
                    className={`w-full p-2 border ${theme.rounded} text-sm`}
                    style={{
                      borderColor: theme.primary,
                      color: theme.text,
                    }}
                  />
                )}
                
                {q.type === 'multiple' && q.options?.slice(0, 3).map((opt, j) => (
                  <label key={j} className="flex items-center text-sm mb-1" style={getTextStyle(theme)}>
                    <input 
                      type="checkbox" 
                      disabled 
                      className="mr-2"
                      style={{ accentColor: theme.primary }}
                    />
                    {opt || `Option ${j + 1}`}
                  </label>
                ))}
                
                {q.type === 'radio' && q.options?.slice(0, 3).map((opt, j) => (
                  <label key={j} className="flex items-center text-sm mb-1" style={getTextStyle(theme)}>
                    <input 
                      type="radio" 
                      disabled 
                      name={`q${i}`} 
                      className="mr-2"
                      style={{ accentColor: theme.primary }}
                    />
                    {opt || `Option ${j + 1}`}
                  </label>
                ))}
                
                {q.type === 'rating' && (
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className="text-2xl" style={{ color: theme.primary + '50' }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {questions.length > 2 && (
              <p className="text-xs text-center opacity-50" style={getTextStyle(theme)}>
                + {questions.length - 2} more questions
              </p>
            )}
          </div>

          <button
            className={`w-full mt-6 py-3 px-6 font-semibold ${theme.rounded} transition-all`}
            style={getButtonStyle(theme)}
            disabled
          >
            Submit Survey
          </button>
        </div>
      </div>

      {surveyId && (
        <div className="bg-white p-4 rounded-lg shadow text-center mt-4">
          <h4 className="font-semibold mb-2">Share Survey</h4>
          <QRCodeSVG value={surveyUrl} size={120} className="mx-auto mb-2" />
          <p className="text-xs text-gray-600 break-all">{surveyUrl}</p>
        </div>
      )}
    </div>
  );
}
