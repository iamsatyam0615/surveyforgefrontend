'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { User } from '@/types';
import toast from 'react-hot-toast';

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/check');
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await api.post('/api/auth/login', data);
      setUser(response.data.user);
      toast.success('Logged in successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.msg || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const signup = async (data: { email: string; password: string }) => {
    try {
      const response = await api.post('/api/auth/signup', data);
      setUser(response.data.user);
      toast.success('Account created successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.msg || 'Signup failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  return { user, loading, login, signup, logout, checkAuth };
}
