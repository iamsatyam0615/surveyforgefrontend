'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  theme?: any;
}

export default function ProgressBar({ current, total, theme }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1.5 bg-gray-200/50 backdrop-blur-sm">
        <motion.div
          className="h-full"
          style={{
            background: theme?.gradient 
              ? `linear-gradient(90deg, ${theme.gradientFrom || theme.primary}, ${theme.gradientTo || theme.accent})`
              : theme?.primary || '#3B82F6'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-3 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Question {current} of {total}
          </span>
          <span className="text-gray-500">{percentage}% Complete</span>
        </div>
      </div>
    </div>
  );
}
