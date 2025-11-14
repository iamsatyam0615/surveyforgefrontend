export interface SurveyQuestion {
  _id?: string;
  type: 'text' | 'paragraph' | 'multiple' | 'radio' | 'dropdown' | 'rating' | 'scale' | 'date' | 'time';
  question: string;
  text?: string; // Alternative to question
  description?: string;
  options?: string[];
  required: boolean;
  min?: number; // For scale questions
  max?: number; // For scale questions
  conditional?: {
    questionId: string;
    value: string;
  };
}

export interface Theme {
  name: string;
  primary: string;
  background: string;
  accent: string;
  text: string;
  font: string;
  rounded: string;
  buttonStyle: 'filled' | 'outline' | 'soft';
  gradient: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  pattern?: 'dots' | 'waves' | 'none';
}

export interface Survey {
  _id?: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  responses?: Response[]; // Array of responses
  responseCount?: number; // Count of responses from backend
  expirationDate?: Date;
  logo?: string;
  userId?: string;
  active: boolean;
  preventDuplicates: boolean;
  requireAuth: boolean; // Require authentication to fill survey
  theme?: Theme;
  expiresAt?: string | null; // ISO string date
  isExpired?: boolean;
  expirationAction?: 'show_message' | 'redirect';
  expirationMessage?: string;
  redirectUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Answer {
  questionId: string;
  answer: any;
}

export interface Response {
  _id?: string;
  surveyId: string;
  answers: Answer[];
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  role?: string;
}
