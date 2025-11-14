'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface ThankYouPageProps {
  surveyTitle?: string;
  theme?: any;
}

export default function ThankYouPage({ surveyTitle, theme }: ThankYouPageProps) {
  useEffect(() => {
    // Confetti explosion!
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const primaryColor = theme?.primary || '#3B82F6';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: theme?.gradient 
          ? `linear-gradient(135deg, ${theme.gradientFrom}15 0%, ${theme.gradientTo}15 100%)`
          : `${primaryColor}05`
      }}
    >
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-9xl mb-8"
        >
          🎉
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold mb-4"
          style={{ color: primaryColor }}
        >
          Thank You!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl text-gray-600 mb-8"
        >
          Your response has been recorded successfully
        </motion.p>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-gray-500 mb-12"
        >
          {surveyTitle && `Thanks for completing "${surveyTitle}"`}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Check out this survey!',
                  text: 'I just completed this survey. You should try it too!',
                  url: window.location.href.replace('/thank-you', '')
                }).catch(() => {});
              }
            }}
            className="px-8 py-4 rounded-full font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor
            }}
          >
            📤 Share with Friends
          </button>
          
          <button
            onClick={() => window.close()}
            className="px-8 py-4 bg-white rounded-full border-2 border-gray-200 font-medium text-gray-700 hover:border-gray-300 hover:scale-105 transition-all"
          >
            Close
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
