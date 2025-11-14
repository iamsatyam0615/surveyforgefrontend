// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

export default function Home() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/admin/login'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors relative">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-40" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all group shadow-lg z-50"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <HiSun size={24} className="text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <HiMoon size={24} className="text-gray-600 group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-bold text-3xl shadow-2xl mb-10"
        >
          SF
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
        >
          SurveyForge
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Build professional surveys in minutes. Clean design, powerful analytics, zero clutter.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { title: "Beautiful Forms", desc: "Google-level design, fully customizable" },
            { title: "Real-time Analytics", desc: "See responses as they come in" },
            { title: "Export & Share", desc: "PDF, CSV, or public link" },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">Redirecting to your dashboard...</span>
          </div>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:shadow-xl transform hover:scale-105"
          >
            Open Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Or <Link href="/admin/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">click here</Link> if not redirected
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 SurveyForge. Made with <span className="text-red-500">♥</span> for clean design.
        </p>
      </div>
    </div>
  );
}