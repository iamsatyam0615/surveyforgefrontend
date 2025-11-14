// ✅ Google Forms Clone - ALL Question Types
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  MdArrowBack, MdAdd, MdPreview, MdSave, MdColorLens, 
  MdContentCopy, MdDelete, MdImage, MdVideoLibrary,
  MdGridOn, MdDateRange, MdAccessTime, MdCloudUpload,
  MdTitle, MdDragHandle
} from 'react-icons/md';
import { ChevronDown, Star, Calendar, Clock, Upload, GripVertical, Sun, Moon } from 'lucide-react';
import useSurveyStore from '@/stores/useSurveyStore';
import useSurvey from '@/hooks/useSurvey';
import { PRESET_THEMES } from '@/themes/presets';
import ThemePanel from '@/components/Builder/ThemePanel';

// Draggable Question Item Component
interface DraggableQuestionProps {
  question: any;
  index: number;
  collapsed: boolean;
  toggleCollapse: (index: number) => void;
  updateQuestion: (index: number, updates: any) => void;
  deleteQuestion: (index: number) => void;
  moveQuestion: (fromIndex: number, toIndex: number) => void;
  shouldFocus?: boolean;
}

const DraggableQuestion = ({ 
  question, 
  index, 
  collapsed, 
  toggleCollapse, 
  updateQuestion, 
  deleteQuestion,
  moveQuestion,
  shouldFocus = false
}: DraggableQuestionProps) => {
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const optionInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const [lastAddedOptionIndex, setLastAddedOptionIndex] = useState<number | null>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'QUESTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<{ index: number }, void, { isOver: boolean }>({
    accept: 'QUESTION',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item, monitor) => {
      if (item.index !== index) {
        moveQuestion(item.index, index);
        item.index = index;
      }

      // Smooth auto-scroll when dragging near edges
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const scrollThreshold = 150;
        const maxScrollSpeed = 15;
        
        // Calculate scroll speed based on distance from edge
        const distanceFromTop = clientOffset.y;
        const distanceFromBottom = window.innerHeight - clientOffset.y;
        
        if (distanceFromTop < scrollThreshold) {
          const speed = maxScrollSpeed * (1 - distanceFromTop / scrollThreshold);
          window.scrollBy({ top: -speed, behavior: 'auto' });
        } else if (distanceFromBottom < scrollThreshold) {
          const speed = maxScrollSpeed * (1 - distanceFromBottom / scrollThreshold);
          window.scrollBy({ top: speed, behavior: 'auto' });
        }
      }
    },
  });

  // Connect drag handle to drag ref
  useEffect(() => {
    if (dragHandleRef.current) {
      drag(dragHandleRef.current);
    }
  }, [drag]);

  // Auto-focus newly added option
  useEffect(() => {
    if (lastAddedOptionIndex !== null && optionInputRefs.current[lastAddedOptionIndex]) {
      optionInputRefs.current[lastAddedOptionIndex]?.focus();
      setLastAddedOptionIndex(null);
    }
  }, [lastAddedOptionIndex, question.options]);

  // Auto-focus question input when new question is added
  useEffect(() => {
    if (shouldFocus && questionInputRef.current && !collapsed) {
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 100);
    }
  }, [shouldFocus, collapsed]);

  return (
    <div ref={drop as any} className="relative">
      {/* Drop indicator line */}
      {isOver && !isDragging && (
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full shadow-lg z-10"
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isDragging ? 0.5 : 1, 
          y: 0,
          scale: isDragging ? 1.02 : 1,
          rotateZ: isDragging ? 2 : 0,
          boxShadow: isDragging ? '0 25px 50px -12px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.1)'
        }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors ${
          isDragging ? 'ring-2 ring-blue-400 border-blue-300' : 'border-gray-200'
        } ${isOver && !isDragging ? 'border-blue-400 border-2 bg-blue-50/30' : ''}`}
      >
        {/* Question Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-2 flex-1">
            <div
              ref={dragHandleRef}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded transition-all hover:scale-110"
              title="Drag to reorder"
            >
              <MdDragHandle size={20} className="text-gray-500" />
            </div>
            <button
              onClick={() => toggleCollapse(index)}
              className="flex items-center gap-2 flex-1 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform text-gray-700 ${collapsed ? '' : 'rotate-180'}`}
              />
              <span className="font-medium text-gray-700">Question {index + 1}</span>
            </button>
          </div>
          <button
            onClick={() => deleteQuestion(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <MdDelete size={20} />
          </button>
        </div>

        {!collapsed && (
          <div className="p-6 space-y-4">
            {/* Question Text */}
            <input
              ref={questionInputRef}
              type="text"
              value={(question as any).question || (question as any).text || ''}
              onChange={(e) => updateQuestion(index, { question: e.target.value })}
              placeholder="Enter your question"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Question Type Selector */}
            <select
              value={question.type}
              onChange={(e) => updateQuestion(index, { type: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text">Short Answer</option>
              <option value="paragraph">Paragraph</option>
              <option value="multiple">Multiple Choice</option>
              <option value="radio">Single Choice</option>
              <option value="dropdown">Dropdown</option>
              <option value="rating">Star Rating</option>
              <option value="scale">Linear Scale</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
            </select>

            {/* Options for Multiple Choice, Radio, Dropdown */}
            {(question.type === 'multiple' || question.type === 'radio' || question.type === 'dropdown') && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Options:</p>
                {question.options?.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                      disabled
                      className="w-5 h-5"
                    />
                    <input
                      ref={(el) => {
                        optionInputRefs.current[optIndex] = el;
                      }}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || [])];
                        newOptions[optIndex] = e.target.value;
                        updateQuestion(index, { options: newOptions });
                      }}
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {question.options && question.options.length > 1 && (
                      <button
                        onClick={() => {
                          const newOptions = question.options?.filter((_: any, i: number) => i !== optIndex);
                          updateQuestion(index, { options: newOptions });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <MdDelete size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...(question.options || []), ''];
                    updateQuestion(index, { options: newOptions });
                    setLastAddedOptionIndex(newOptions.length - 1);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add option
                </button>
              </div>
            )}

            {/* Scale Min/Max Settings */}
            {question.type === 'scale' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={(question as any).min || 1}
                    onChange={(e) => updateQuestion(index, { min: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={(question as any).max || 10}
                    onChange={(e) => updateQuestion(index, { max: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* Required Toggle */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.required || false}
                onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Required</span>
            </label>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default function NewSurveyPage() {
  const router = useRouter();
  const { createSurvey } = useSurvey();
  const { 
    title, 
    description,
    questions, 
    theme,
    requireAuth,
    expiresAt,
    expirationAction,
    expirationMessage,
    redirectUrl,
    setTitle,
    setDescription,
    setTheme,
    setRequireAuth,
    setExpiresAt,
    setExpirationAction,
    setExpirationMessage,
    setRedirectUrl,
    addQuestion, 
    updateQuestion, 
    deleteQuestion,
    reorderQuestions,
    resetSurvey
  } = useSurveyStore();

  const [showTheme, setShowTheme] = useState(false);
  const [saving, setSaving] = useState(false);

  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const [lastAddedQuestionIndex, setLastAddedQuestionIndex] = useState<number | null>(null);

  // Reset survey store when component mounts (new survey)
  useEffect(() => {
    resetSurvey();
  }, []);

  useEffect(() => {
    if (!theme) setTheme(PRESET_THEMES.minimal);
  }, [theme, setTheme]);

  const handleAddQuestion = (type: any) => {
    addQuestion(type);
    setLastAddedQuestionIndex(questions.length);
    setCollapsed(prev => [...prev, false]);
    // Reset after a short delay
    setTimeout(() => setLastAddedQuestionIndex(null), 500);
  };

  const toggleCollapse = (i: number) => {
    setCollapsed((prev) => {
      const updated = [...prev];
      updated[i] = !updated[i];
      return updated;
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please add a survey title');
      return;
    }
    setSaving(true);
    try {
      const surveyData: any = {
        title,
        description,
        questions,
        theme,
        requireAuth,
        active: true,
        expirationDate: expiresAt ? expiresAt.toISOString() : null,
      };
      
      const survey = await createSurvey(surveyData);
      router.push(`/admin/surveys/${survey._id}`);
    } catch (error) {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white shadow-sm border-b"
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3 flex-1">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              <MdArrowBack size={24} />
            </Link>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Survey Title"
              className="bg-transparent border-b border-transparent focus:border-blue-500 px-1 text-lg font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/survey/preview"
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              <MdPreview size={18} /> Preview
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <MdSave size={18} /> {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-6">

        {/* BUILDER */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-4"
        >
          {/* Survey Description */}
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add survey description…"
              className="w-full text-sm bg-transparent resize-none focus:outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Questions */}
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              <AnimatePresence>
                {questions.map((q, index) => (
                  <DraggableQuestion
                    key={index}
                    question={q}
                    index={index}
                    collapsed={collapsed[index] || false}
                    toggleCollapse={toggleCollapse}
                    updateQuestion={updateQuestion}
                    deleteQuestion={deleteQuestion}
                    moveQuestion={reorderQuestions}
                    shouldFocus={index === lastAddedQuestionIndex}
                  />
                ))}
              </AnimatePresence>
            </div>
          </DndProvider>

          {/* ADD NEW QUESTION */}
          <button
            onClick={() => handleAddQuestion('text')}
            className="w-full py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700 font-medium"
          >
            <MdAdd size={20} /> Add Question
          </button>
        </motion.main>

        {/* SIDEBAR */}
        <motion.aside
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-white p-5 rounded-xl shadow-sm border space-y-6 h-fit"
        >
          {/* Fields */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Add field</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[
                { type: 'text', label: 'Short Answer', icon: '📝' },
                { type: 'paragraph', label: 'Paragraph', icon: '📄' },
                { type: 'radio', label: 'Single Choice', icon: '🔘' },
                { type: 'multiple', label: 'Multiple Choice', icon: '☑️' },
                { type: 'dropdown', label: 'Dropdown', icon: '📋' },
                { type: 'rating', label: 'Star Rating', icon: '⭐' },
                { type: 'scale', label: 'Linear Scale', icon: '📊' },
                { type: 'date', label: 'Date', icon: '📅' },
                { type: 'time', label: 'Time', icon: '🕐' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleAddQuestion(item.type as any)}
                  className="w-full px-3 py-2.5 text-left rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Survey Settings */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Settings</p>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Require Login</p>
                    <p className="text-xs text-gray-500">Only logged-in users can respond</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={requireAuth}
                  onChange={(e) => setRequireAuth(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600"
                />
              </label>

              {/* Expiration Settings */}
              <div className="p-3 rounded-lg border bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Set Expiration</p>
                      <p className="text-xs text-gray-500">Auto-close survey at a specific date/time</p>
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
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {expiresAt && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                    <div>
                      <label className="text-sm font-semibold text-gray-800 block mb-2">Closes on</label>
                      <input
                        type="datetime-local"
                        value={expiresAt.toISOString().slice(0, 16)}
                        onChange={(e) => setExpiresAt(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setShowTheme((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gray-900 text-white"
          >
            <MdColorLens size={18} /> Theme
          </button>

          <AnimatePresence>
            {showTheme && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ThemePanel theme={theme || PRESET_THEMES.minimal} onThemeChange={(t) => setTheme(t)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      </div>
    </div>
  );
}