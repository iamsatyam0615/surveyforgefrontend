'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useSurvey from '@/hooks/useSurvey';
import { MdAssessment, MdCheckCircle, MdPeople } from 'react-icons/md';

export default function OverviewCards() {
  const { surveys, fetchSurveys } = useSurvey();

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const activeSurveys = surveys.filter((s) => s.active).length;
  
  // Calculate total responses across all surveys using responseCount from backend
  const totalResponses = surveys.reduce((total, survey) => {
    return total + (survey.responseCount || 0);
  }, 0);

  const cards = [
    {
      title: 'Total Surveys',
      value: surveys.length,
      icon: MdAssessment,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Surveys',
      value: activeSurveys,
      icon: MdCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Responses',
      value: totalResponses,
      icon: MdPeople,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={`${card.textColor} text-2xl`} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${card.color} text-white text-xs font-semibold`}
            >
              Live
            </motion.div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
          <p className={`text-4xl font-bold ${card.textColor}`}>{card.value}</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {card.title === 'Total Surveys' && 'All time'}
              {card.title === 'Active Surveys' && 'Currently published'}
              {card.title === 'Total Responses' && 'Across all surveys'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
