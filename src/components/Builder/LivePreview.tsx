'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdContentCopy, MdQrCode2, MdPhoneIphone, MdLaptop, MdDownload } from 'react-icons/md';
import { PRESET_THEMES } from '@/themes/presets';
import { getBackgroundStyle, getButtonStyle, getCardStyle, getTextStyle } from '@/lib/themeUtils';

interface LivePreviewProps {
  survey: any;
  surveyId?: string;
}

export default function LivePreview({ survey, surveyId }: LivePreviewProps) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('Create survey to get link');
  
  const theme = survey?.theme || PRESET_THEMES.minimal;
  
  useEffect(() => {
    if (surveyId && typeof window !== 'undefined') {
      setSurveyUrl(`${window.location.origin}/survey/${surveyId}`);
    }
  }, [surveyId]);

  const handleCopyLink = () => {
    if (surveyId) {
      navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!surveyId) return;
    
    // Create a canvas from the SVG
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      
      // White background
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 50, 50, 200, 200);
        
        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `survey-qr-${surveyId}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Device Toggle & Actions */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded transition-all text-sm ${
              device === 'mobile'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MdPhoneIphone size={20} />
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded transition-all text-sm ${
              device === 'desktop'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MdLaptop size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors"
            title="Show QR Code"
          >
            <MdQrCode2 size={20} className="text-blue-600" />
          </button>
          <button
            onClick={handleCopyLink}
            disabled={!surveyId}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
            title="Copy Link"
          >
            <MdContentCopy size={18} className="text-blue-600" />
          </button>
        </div>
      </div>

  {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && surveyId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 p-5 bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="text-center">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Scan to Open Survey</h4>
              <div className="inline-block p-3 bg-white rounded border border-gray-200">
                <QRCodeSVG id="qr-code-svg" value={surveyUrl} size={200} />
              </div>
              <p className="text-sm text-gray-600 mt-4">Share this QR code with respondents</p>
              <button
                onClick={handleDownloadQR}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                <MdDownload size={20} />
                Download QR Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Success Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center text-sm font-medium"
          >
            ✓ Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

  {/* Preview Frame */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          key={device}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-gray-100 rounded-xl shadow-lg overflow-hidden ${
            device === 'mobile' ? 'w-[360px] h-[640px]' : 'w-full h-[560px]'
          }`}
          style={{
            border: device === 'mobile' ? '10px solid #1f2937' : 'none'
          }}
        >
          <div 
            className="w-full h-full overflow-y-auto"
            style={{
              ...getBackgroundStyle(theme),
              fontFamily: theme?.font || 'Inter'
            }}
          >
            {survey?.questions?.length > 0 ? (
              <div className="p-6 space-y-6">
                {/* Survey Header */}
                <div className="text-center mb-8">
                  <h1 
                    className="text-2xl font-semibold mb-2"
                    style={getTextStyle(theme)}
                  >
                    {survey.title || 'Untitled Survey'}
                  </h1>
                  {survey.description && (
                    <p 
                      className="text-sm opacity-80"
                      style={getTextStyle(theme)}
                    >
                      {survey.description}
                    </p>
                  )}
                </div>

                {/* Questions Preview (First 3) */}
                {survey.questions.slice(0, 3).map((q: any, i: number) => (
                  <div
                    key={i}
                    className={`p-4 ${theme.rounded} shadow`}
                    style={getCardStyle(theme)}
                  >
                    <p className="font-medium text-base mb-3" style={getTextStyle(theme)}>
                      {i + 1}. {q.question || 'Question text'}
                      {q.required && <span style={{ color: theme.primary }} className="ml-2">*</span>}
                    </p>

                    {q.type === 'text' && (
                      <input
                        type="text"
                        placeholder="Your answer..."
                        disabled
                        className={`w-full px-3 py-2 border ${theme.rounded} bg-white/50`}
                        style={{ borderColor: theme.primary }}
                      />
                    )}

                    {(q.type === 'multiple' || q.type === 'radio') && (
                      <div className="space-y-2">
                        {q.options?.slice(0, 3).map((opt: string, j: number) => (
                          <div key={j} className="flex items-center gap-3 p-2.5 bg-white/50 rounded">
                            <input
                              type={q.type === 'multiple' ? 'checkbox' : 'radio'}
                              disabled
                              style={{ accentColor: theme.primary }}
                            />
                            <span style={getTextStyle(theme)}>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === 'rating' && (
                      <div className="flex justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-2xl" style={{ color: theme.primary }}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {survey.questions.length > 3 && (
                  <div className="text-center text-gray-500 text-sm">
                    + {survey.questions.length - 3} more questions
                  </div>
                )}

                {/* Submit Button Preview */}
                <button
                  disabled
                  className={`w-full py-3 font-semibold ${theme.rounded} shadow`}
                  style={getButtonStyle(theme)}
                >
                  Submit Survey
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 text-sm">
                    Add questions to see preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
