import { create } from 'zustand';
import { SurveyQuestion, Survey, Theme } from '@/types';

interface SurveyState {
  title: string;
  description: string;
  questions: SurveyQuestion[];
  active: boolean;
  preventDuplicates: boolean;
  requireAuth: boolean;
  expiresAt: Date | null;
  expirationAction: 'show_message' | 'redirect';
  expirationMessage: string;
  redirectUrl: string;
  surveyId?: string;
  theme?: Theme;
  survey: Survey;
  
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addQuestion: (type: 'text' | 'paragraph' | 'multiple' | 'radio' | 'dropdown' | 'rating' | 'scale' | 'date' | 'time') => void;
  updateQuestion: (index: number, question: Partial<SurveyQuestion>) => void;
  deleteQuestion: (index: number) => void;
  reorderQuestions: (from: number, to: number) => void;
  setActive: (active: boolean) => void;
  setPreventDuplicates: (prevent: boolean) => void;
  setRequireAuth: (require: boolean) => void;
  setExpiresAt: (date: Date | null) => void;
  setExpirationAction: (action: 'show_message' | 'redirect') => void;
  setExpirationMessage: (message: string) => void;
  setRedirectUrl: (url: string) => void;
  setTheme: (theme: Theme) => void;
  updateSurvey: (survey: Partial<Survey>) => void;
  loadSurvey: (survey: any) => void;
  resetSurvey: () => void;
}

const initialSurvey: Survey = {
  title: '',
  description: '',
  questions: [],
  active: true,
  preventDuplicates: false,
  requireAuth: false,
  expiresAt: null,
  expirationAction: 'show_message',
  expirationMessage: 'This survey is no longer accepting responses.',
  redirectUrl: '',
};

const useSurveyStore = create<SurveyState>((set) => ({
  title: '',
  description: '',
  questions: [],
  active: true,
  preventDuplicates: false,
  requireAuth: false,
  expiresAt: null,
  expirationAction: 'show_message',
  expirationMessage: 'This survey is no longer accepting responses.',
  redirectUrl: '',
  survey: initialSurvey,
  
  setTitle: (title) => set((state) => ({ 
    title, 
    survey: { ...state.survey, title } 
  })),
  
  setDescription: (description) => set((state) => ({ 
    description,
    survey: { ...state.survey, description }
  })),
  
  addQuestion: (type) => set((state) => {
    // Determine if the question type needs options
    const needsOptions = ['multiple', 'radio', 'dropdown'].includes(type);
    
    // Set defaults for scale questions
    const defaultMin = type === 'scale' ? 1 : undefined;
    const defaultMax = type === 'scale' ? 10 : undefined;
    
    const newQuestion: SurveyQuestion = {
      type: type as any,
      question: '',
      options: needsOptions ? ['Option 1'] : undefined,
      required: false,
      min: defaultMin,
      max: defaultMax,
    };
    
    const newQuestions = [...state.questions, newQuestion];
    return {
      questions: newQuestions,
      survey: { ...state.survey, questions: newQuestions }
    };
  }),
  
  updateQuestion: (index, updates) => set((state) => {
    const newQuestions = state.questions.map((q, i) => 
      i === index ? { ...q, ...updates } : q
    );
    return {
      questions: newQuestions,
      survey: { ...state.survey, questions: newQuestions }
    };
  }),
  
  deleteQuestion: (index) => set((state) => {
    const newQuestions = state.questions.filter((_, i) => i !== index);
    return {
      questions: newQuestions,
      survey: { ...state.survey, questions: newQuestions }
    };
  }),
  
  reorderQuestions: (from, to) => set((state) => {
    const questions = [...state.questions];
    const [moved] = questions.splice(from, 1);
    questions.splice(to, 0, moved);
    return { 
      questions,
      survey: { ...state.survey, questions }
    };
  }),
  
  setActive: (active) => set((state) => ({ 
    active,
    survey: { ...state.survey, active }
  })),
  
  setPreventDuplicates: (prevent) => set((state) => ({ 
    preventDuplicates: prevent,
    survey: { ...state.survey, preventDuplicates: prevent }
  })),
  
  setRequireAuth: (require) => set((state) => ({
    requireAuth: require,
    survey: { ...state.survey, requireAuth: require }
  })),
  
  setExpiresAt: (date) => set((state) => ({ 
    expiresAt: date,
    survey: { ...state.survey, expiresAt: date ? date.toISOString() : null }
  })),
  
  setExpirationAction: (action) => set((state) => ({
    expirationAction: action,
    survey: { ...state.survey, expirationAction: action }
  })),
  
  setExpirationMessage: (message) => set((state) => ({
    expirationMessage: message,
    survey: { ...state.survey, expirationMessage: message }
  })),
  
  setRedirectUrl: (url) => set((state) => ({
    redirectUrl: url,
    survey: { ...state.survey, redirectUrl: url }
  })),
  
  setTheme: (theme) => set((state) => ({
    theme,
    survey: { ...state.survey, theme }
  })),
  
  updateSurvey: (updates) => set((state) => ({
    survey: { ...state.survey, ...updates },
    theme: updates.theme || state.theme,
    title: updates.title || state.title,
    description: updates.description || state.description,
    questions: updates.questions || state.questions,
  })),
  
  loadSurvey: (survey) => set({
    title: survey.title,
    description: survey.description || '',
    questions: survey.questions || [],
    active: survey.active,
    preventDuplicates: survey.preventDuplicates || false,
    requireAuth: survey.requireAuth || false,
    expiresAt: survey.expiresAt ? new Date(survey.expiresAt) : null,
    expirationAction: survey.expirationAction || 'show_message',
    expirationMessage: survey.expirationMessage || 'This survey is no longer accepting responses.',
    redirectUrl: survey.redirectUrl || '',
    surveyId: survey._id,
    theme: survey.theme,
    survey: survey
  }),
  
  resetSurvey: () => set({
    title: '',
    description: '',
    questions: [],
    active: true,
    preventDuplicates: false,
    requireAuth: false,
    expiresAt: null,
    expirationAction: 'show_message',
    expirationMessage: 'This survey is no longer accepting responses.',
    redirectUrl: '',
    surveyId: undefined,
    theme: undefined,
    survey: initialSurvey
  })
}));

export default useSurveyStore;
