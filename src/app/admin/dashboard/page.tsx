// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import OverviewCards from '@/components/Dashboard/OverviewCards';
import SurveyList from '@/components/Dashboard/SurveyList';
import Link from 'next/link';
import { 
  HiOutlinePlusCircle, 
  HiOutlineLogout, 
  HiOutlineViewGrid, 
  HiOutlineChartBar,
  HiMenu,
  HiX,
  HiSun,
  HiMoon
} from 'react-icons/hi';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors`}>
      {/* TOPBAR - Mobile & Desktop */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                SF
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                SurveyForge
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {darkMode ? <HiSun size={20} className="text-yellow-500" /> : <HiMoon size={20} className="text-gray-600 dark:text-gray-300" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-20">
        {/* SIDEBAR - Desktop + Mobile Slide-in */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-6 py-8 space-y-2">
              <Link 
                href="/admin/dashboard" 
                className="flex items-center gap-4 px-5 py-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-semibold"
                onClick={() => setSidebarOpen(false)}
              >
                <HiOutlineViewGrid size={22} />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/admin/analytics" 
                className="flex items-center gap-4 px-5 py-3.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-all"
                onClick={() => setSidebarOpen(false)}
              >
                <HiOutlineChartBar size={22} />
                <span>Analytics</span>
              </Link>
            </nav>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="sm:hidden mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.email}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/admin/login';
                }}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 font-semibold hover:bg-red-100 dark:hover:bg-red-900/70 transition-all"
              >
                <HiOutlineLogout size={22} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">

            
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user.name || 'Creator'}</span> 
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Here's what's happening with your surveys today</p>
              </div>
              <Link
                href="/admin/surveys/new"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <HiOutlinePlusCircle size={26} />
                Create New Survey
              </Link>
            </div>

            {/* Overview Cards */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <OverviewCards />
            </motion.div>

            {/* Recent Surveys */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Surveys</h2>
                  <Link href="/admin/surveys" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                    View all →
                  </Link>
                </div>
                <SurveyList />
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}