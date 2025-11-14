'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdDownload, MdShare, MdIosShare } from 'react-icons/md';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  surveyTitle: string;
}

export default function QRCodeModal({ isOpen, onClose, surveyId, surveyTitle }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const surveyUrl = typeof window !== 'undefined' ? `${window.location.origin}/survey/${surveyId}` : '';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create a larger canvas for better quality
    const scale = 4;
    const largeCanvas = document.createElement('canvas');
    const ctx = largeCanvas.getContext('2d');
    if (!ctx) return;

    largeCanvas.width = canvas.width * scale;
    largeCanvas.height = canvas.height * scale;
    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);

    const url = largeCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${surveyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-qr-code.png`;
    link.href = url;
    link.click();
  };

  const handleShare = async () => {
    // Check if native share is available
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: surveyTitle,
          text: `Check out this survey: ${surveyTitle}`,
          url: surveyUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          fallbackCopy();
        }
      }
    } else {
      // Fallback to copy
      fallbackCopy();
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[280px] overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 z-10 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <MdClose className="text-gray-600 dark:text-gray-400" size={18} />
              </button>

              {/* QR Code with Download Button */}
              <div className="relative p-6 pb-4">
                <div ref={qrRef} className="bg-white rounded-xl p-4 mx-auto w-fit">
                  <QRCodeCanvas
                    value={surveyUrl}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                
                {/* Download Button in Corner */}
                <button
                  onClick={downloadQRCode}
                  className="absolute bottom-2 right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group"
                  title="Download QR Code"
                >
                  <MdDownload className="text-white" size={20} />
                </button>
              </div>

              {/* Survey Title */}
              <div className="px-6 pb-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white text-center truncate">
                  {surveyTitle}
                </p>
              </div>

              {/* Share Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <MdShare size={18} />
                  Share Link
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
