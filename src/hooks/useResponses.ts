'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Response as SurveyResponse } from '@/types';
import io, { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function useResponses(surveyId?: string) {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchResponses = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/responses/${id}`);
      setResponses(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch responses');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitResponse = useCallback(async (surveyId: string, answers: any[]) => {
    try {
      const response = await api.post('/api/responses', { surveyId, answers });
      toast.success('Response submitted successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.msg || 'Failed to submit response';
      toast.error(message);
      throw error;
    }
  }, []);

  const exportCSV = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/api/responses/${id}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `survey-${id}-responses.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('CSV exported successfully!');
    } catch (error: any) {
      toast.error('Failed to export CSV');
      throw error;
    }
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    if (surveyId) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true
      });
      
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('joinSurvey', surveyId);
      });

      newSocket.on('newResponse', () => {
        // Refetch responses when new one arrives
        fetchResponses(surveyId);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [surveyId, fetchResponses]);

  return {
    responses,
    loading,
    fetchResponses,
    submitResponse,
    exportCSV
  };
}
