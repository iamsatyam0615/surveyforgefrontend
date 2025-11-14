'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import confetti from 'canvas-confetti';
import useSurvey from '@/hooks/useSurvey';
import useSurveyStore from '@/stores/useSurveyStore';
import { PRESET_THEMES } from '@/themes/presets';
import { MdArrowBack, MdVisibility, MdShare, MdCheck } from 'react-icons/md';
import QuestionCard from '@/components/Builder/QuestionCard';
import ThemePanel from '@/components/Builder/ThemePanel';
import LivePreview from '@/components/Builder/LivePreview';
import Link from 'next/link';
import { useRef } from 'react';

export default function EditSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const { loadSurvey, updateSurvey: updateSurveyAPI, loading } = useSurvey();
  const { 
    survey, 
    title,
    description,
    questions, 
    theme,
    requireAuth,
    expiresAt,
    setTitle,
    setDescription,
    setTheme,
    setRequireAuth,
    setExpiresAt,
    addQuestion, 
    updateQuestion, 
    deleteQuestion,
    reorderQuestions
  } = useSurveyStore();

  const [saving, setSaving] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastAddedQuestionIndex, setLastAddedQuestionIndex] = useState<number | null>(null);
  const themePanelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to theme panel when it becomes visible
  useEffect(() => {
    if (showTheme && themePanelRef.current) {
      setTimeout(() => {
        themePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [showTheme]);

  useEffect(() => {
    if (params.id) {
      loadSurvey(params.id as string).then((surveyData) => {
        if (surveyData?.expirationDate) {
          setExpiresAt(new Date(surveyData.expirationDate));
        }
      });
    }
  }, [params.id, loadSurvey]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: any = {
        title,
        description,
        questions,
        theme,
        requireAuth,
        active: true,
        expirationDate: expiresAt ? expiresAt.toISOString() : null,
      };
      
      await updateSurveyAPI(params.id as string, updateData);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };

  const handleDuplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, { ...questionToDuplicate });
  };

  const handleAddQuestion = (type: any) => {
    addQuestion(type);
    setLastAddedQuestionIndex(questions.length);
    // Reset after a short delay
    setTimeout(() => setLastAddedQuestionIndex(null), 500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/survey/${params.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
          />
          <p className="text-lg text-gray-700 font-medium">Loading your survey...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Simplified Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link
                href="/admin/dashboard"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
              >
                <MdArrowBack size={20} />
              </Link>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your survey a name..."
                  className="w-full text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none placeholder-gray-400"
                />
                <p className="text-sm text-gray-500 mt-0.5">{questions?.length || 0} question{(questions?.length || 0) !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/survey/${params.id}`}
                target="_blank"
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-900 font-medium transition-shadow inline-flex items-center gap-2"
              >
                <MdVisibility size={18} />
                Preview
              </Link>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPreview}
                  onChange={(e) => setShowPreview(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-900 font-medium transition-shadow inline-flex items-center gap-2"
                >
                  <MdShare size={18} />
                  Share
                </button>
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 z-50"
                    >
                      <p className="text-sm text-gray-600 mb-3">Share your survey</p>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/survey/${params.id}`}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-sm"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-shadow inline-flex items-center gap-2"
                        >
                          {copied ? <><MdCheck size={16} /> Copied!</> : 'Copy'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-12' : 'grid-cols-9'}`}>
          
          {/* Left Sidebar - Question Types */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Questions</h3>
              <div className="space-y-1.5 max-h-[calc(100vh-300px)] overflow-y-auto">
                {[
                  { type: 'text', icon: '📝', label: 'Short Answer', desc: 'Short response' },
                  { type: 'paragraph', icon: '📄', label: 'Paragraph', desc: 'Long text' },
                  { type: 'radio', icon: '🔘', label: 'Single Choice', desc: 'Pick one' },
                  { type: 'multiple', icon: '☑️', label: 'Multiple Choice', desc: 'Pick many' },
                  { type: 'dropdown', icon: '📋', label: 'Dropdown', desc: 'Select menu' },
                  { type: 'rating', icon: '⭐', label: 'Star Rating', desc: 'Rate with stars' },
                  { type: 'scale', icon: '📊', label: 'Linear Scale', desc: 'Number scale' },
                  { type: 'date', icon: '📅', label: 'Date', desc: 'Pick a date' },
                  { type: 'time', icon: '🕐', label: 'Time', desc: 'Pick a time' }
                ].map((item, idx) => (
                  <motion.button
                    key={item.type}
                    onClick={() => handleAddQuestion(item.type as any)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-2.5 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[10px] text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Settings</p>
                
                <label className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔒</span>
                    <div>
                      <p className="text-xs font-medium text-gray-700">Require Login</p>
                      <p className="text-[9px] text-gray-500">Only logged-in users</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireAuth}
                    onChange={(e) => setRequireAuth(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600"
                  />
                </label>

                {/* Expiration Settings */}
                <div className="p-2.5 rounded-lg border bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⏰</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Set Expiration</p>
                        <p className="text-[9px] text-gray-500">Auto-close at date/time</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!expiresAt}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const defaultDate = new Date();
                            defaultDate.setDate(defaultDate.getDate() + 7);
                            setExpiresAt(defaultDate);
                          } else {
                            setExpiresAt(null);
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-[18px] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {expiresAt && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <label className="text-[10px] font-semibold text-gray-800 block mb-1.5">Closes on</label>
                      <input
                        type="datetime-local"
                        value={expiresAt.toISOString().slice(0, 16)}
                        onChange={(e) => setExpiresAt(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-[9px] text-gray-600 mt-1">
                        Form will automatically close at this time
                      </p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowTheme(!showTheme)}
                  className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-shadow flex items-center justify-center gap-2"
                >
                  🎨 {showTheme ? 'Hide Styling' : 'Change Style'}
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Center - Survey Builder */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`space-y-5 ${showPreview ? 'col-span-6' : 'col-span-6'}`}
          >
            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">Survey Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what this survey is about..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
              />
            </motion.div>

            {/* Questions List */}
            <DndProvider backend={HTML5Backend}>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {questions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl mx-auto mb-4">
                        👈
                      </div>
                      <p className="text-2xl font-semibold text-gray-900 mb-2">Start building your survey</p>
                      <p className="text-sm text-gray-600">Choose a question type from the left to get started</p>
                    </motion.div>
                  ) : (
                    questions.map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <QuestionCard
                          question={question}
                          index={index}
                          onUpdate={(updates) => updateQuestion(index, updates)}
                          onDelete={() => deleteQuestion(index)}
                          onDuplicate={() => handleDuplicateQuestion(index)}
                          onMove={reorderQuestions}
                          theme={theme}
                          shouldFocus={index === lastAddedQuestionIndex}
                        />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </DndProvider>

            {/* Theme Panel - at the bottom */}
            <AnimatePresence>
              {showTheme && (
                <motion.div
                  ref={themePanelRef}
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
                >
                  <div className="p-6">
                    <ThemePanel
                      theme={theme || PRESET_THEMES.minimal}
                      onThemeChange={(t) => setTheme(t)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>

          {/* Right Sidebar - Live Preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="col-span-3"
              >
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-gray-900">Preview</h3>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">See how it looks to others</p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <LivePreview 
                        survey={{ title, description, questions, theme }} 
                        surveyId={params.id as string} 
                      />
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
