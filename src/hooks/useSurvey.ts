'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Survey } from '@/types';
import useSurveyStore from '@/stores/useSurveyStore';
import toast from 'react-hot-toast';

export default function useSurvey() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const { loadSurvey: loadSurveyToStore } = useSurveyStore();

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/surveys');
      setSurveys(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSurvey = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/surveys/${id}`);
      loadSurveyToStore(response.data);
      return response.data;
    } catch (error: any) {
      toast.error('Failed to load survey');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadSurveyToStore]);

  const loadPublicSurvey = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await api.get(`/api/surveys/public/${id}?_t=${timestamp}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.msg || 'Failed to load survey';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSurvey = useCallback(async (surveyData: Partial<Survey>) => {
    try {
      const response = await api.post('/api/surveys', surveyData);
      toast.success('Survey created successfully!');
      return response.data;
    } catch (error: any) {
      console.error('Create survey error:', error.response?.data || error);
      const message = error.response?.data?.msg || error.response?.data?.message || 'Failed to create survey';
      toast.error(message);
      throw error;
    }
  }, []);

  const updateSurvey = useCallback(async (id: string, surveyData: Partial<Survey>) => {
    try {
      const response = await api.put(`/api/surveys/${id}`, surveyData);
      toast.success('Survey updated successfully!');
      return response.data;
    } catch (error: any) {
      toast.error('Failed to update survey');
      throw error;
    }
  }, []);

  const deleteSurvey = useCallback(async (id: string) => {
    try {
      await api.delete(`/api/surveys/${id}`);
      toast.success('Survey deleted successfully!');
      setSurveys(surveys.filter(s => s._id !== id));
    } catch (error: any) {
      toast.error('Failed to delete survey');
      throw error;
    }
  }, [surveys]);

  return {
    surveys,
    loading,
    fetchSurveys,
    loadSurvey,
    loadPublicSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey
  };
}
