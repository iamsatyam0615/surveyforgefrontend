// Google Forms Clone - ALL Question Types
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MdArrowBack, MdAdd, MdPreview, MdSave, MdColorLens, 
  MdContentCopy, MdDelete, MdImage, MdCloudUpload,
  MdGridOn, MdDateRange, MdAccessTime,
  MdTitle
} from 'react-icons/md';
import { ChevronDown, Star, Calendar, Clock, Upload, GripVertical, Sun, Moon } from 'lucide-react';
import useSurveyStore from '@/stores/useSurveyStore';
import useSurvey from '@/hooks/useSurvey';
import { PRESET_THEMES } from '@/themes/presets';
import ThemePanel from '@/components/Builder/ThemePanel';

export default function NewSurveyPage() {
  const router = useRouter();
  const { createSurvey } = useSurvey();
  const { 
    title, description, questions, theme, 
    setTitle, setDescription, setTheme, 
    addQuestion, updateQuestion, deleteQuestion
  } = useSurveyStore();
  
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const [showTheme, setShowTheme] = useState(false);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!theme) setTheme(PRESET_THEMES.minimal);
  }, [theme, setTheme]);

  const toggleCollapse = (i: number) => {
    setCollapsed(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const duplicateQuestion = (index: number) => {
    const newQ = { ...questions[index] };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQ);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('Add a title');
    setSaving(true);
    try {
      const s = await createSurvey({ title, description, questions, theme, active: true });
      router.push(`/admin/surveys/${s._id}`);
    } catch { setSaving(false); }
  };

  const questionTypes = [
    { type: 'text', label: 'Short answer', icon: 'T', desc: 'Single line text' },
    { type: 'paragraph', label: 'Paragraph', icon: '¶', desc: 'Long text' },
    { type: 'radio', label: 'Multiple choice', icon: '◉', desc: 'Pick one' },
    { type: 'multiple', label: 'Checkboxes', icon: '☑️', desc: 'Pick many' },
    { type: 'dropdown', label: 'Dropdown', icon: '▼', desc: 'Select from list' },
    { type: 'scale', label: 'Linear scale', icon: '1→10', desc: 'Rate 1 to 10' },
    { type: 'grid_radio', label: 'Multiple choice grid', icon: <MdGridOn />, desc: 'Rows & columns' },
    { type: 'grid_checkbox', label: 'Checkbox grid', icon: <MdGridOn />, desc: 'Multiple per row' },
    { type: 'rating', label: 'Star rating', icon: <Star />, desc: '1–5 stars' },
    { type: 'date', label: 'Date', icon: <Calendar />, desc: 'Calendar picker' },
    { type: 'time', label: 'Time', icon: <Clock />, desc: 'Time picker' },
    { type: 'file', label: 'File upload', icon: <Upload />, desc: 'Images, PDFs, etc.' },
    { type: 'section', label: 'Section header', icon: <MdTitle />, desc: 'Group questions' },
    { type: 'page', label: 'Page break', icon: '➤', desc: 'New page' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5 flex-1">
            <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
              <MdArrowBack size={24} />
            </Link>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Untitled form"
              className="text-2xl font-bold bg-transparent outline-none border-b-2 border-transparent focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
            </button>
            <Link href="/survey/preview" className="px-5 py-2.5 border rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdPreview /> Preview
            </Link>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2 font-medium hover:shadow-xl disabled:opacity-50">
              <MdSave /> {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
        <main className="lg:col-span-3 space-y-6">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-sm p-10 border-t-8 border-indigo-600`}>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Form description"
              className="w-full text-lg resize-none outline-none bg-transparent"
              rows={3}
            />
          </div>

          <AnimatePresence>
            {questions.map((q, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-sm border overflow-hidden`}
              >
                <div className={`flex items-center justify-between p-5 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} border-b`}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleCollapse(i)} className="flex items-center gap-3 font-medium">
                      <ChevronDown className={`w-5 h-5 transition-transform ${collapsed[i] ? '' : 'rotate-180'}`} />
                      <GripVertical className="text-gray-400 cursor-move" size={20} />
                      {(q as any).type === 'section' ? 'Section' : (q as any).type === 'page' ? 'Page break' : `Question ${i + 1}`}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => duplicateQuestion(i)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"><MdContentCopy size={18} /></button>
                    <button onClick={() => deleteQuestion(i)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600"><MdDelete size={18} /></button>
                  </div>
                </div>

                {!collapsed[i] && (
                  <div className="p-8 space-y-8">
                    {(q as any).type !== 'page' && (
                      <>
                        <input
                          value={(q as any).text || ''}
                          onChange={e => updateQuestion(i, { text: e.target.value })}
                          placeholder={(q as any).type === 'section' ? 'Section title' : 'Question'}
                          className="text-2xl font-medium w-full outline-none bg-transparent border-b-2 border-transparent focus:border-indigo-500 pb-2"
                        />
                        <textarea
                          value={(q as any).description || ''}
                          onChange={e => updateQuestion(i, { description: e.target.value })}
                          placeholder="Description (optional)"
                          className="w-full text-gray-600 dark:text-gray-400 outline-none bg-transparent"
                        />
                      </>
                    )}

                    {/* Question Type Preview */}
                    <div className="space-y-6">
                      {/* Text / Paragraph */}
                      {((q as any).type === 'text' || (q as any).type === 'paragraph') && (
                        <input 
                          type="text" 
                          placeholder={(q as any).type === 'paragraph' ? 'Long answer text' : 'Short answer text'} 
                          className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800" 
                          disabled 
                        />
                      )}

                      {/* Radio / Checkbox / Dropdown */}
                      {((q as any).type === 'radio' || (q as any).type === 'multiple' || (q as any).type === 'dropdown') && (
                        <div className="space-y-3">
                          {(q as any).options?.map((opt: string, j: number) => (
                            <div key={j} className="flex items-center gap-4">
                              <input 
                                type={(q as any).type === 'multiple' ? 'checkbox' : 'radio'} 
                                disabled 
                                className="w-5 h-5"
                              />
                              <input
                                value={opt}
                                onChange={e => {
                                  const opts = [...((q as any).options || [])];
                                  opts[j] = e.target.value;
                                  updateQuestion(i, { options: opts });
                                }}
                                placeholder={`Option ${j + 1}`}
                                className="flex-1 p-3 border-b bg-transparent outline-none"
                              />
                              <button onClick={() => {
                                const opts = (q as any).options.filter((_: any, idx: number) => idx !== j);
                                updateQuestion(i, { options: opts });
                              }} className="text-red-600 text-2xl">×</button>
                            </div>
                          ))}
                          <button 
                            onClick={() => updateQuestion(i, { options: [...((q as any).options || []), 'Option'] })}
                            className="text-indigo-600 hover:underline text-sm"
                          >
                            + Add option
                          </button>
                          {(q as any).type !== 'dropdown' && (
                            <label className="flex items-center gap-2 text-sm">
                              <input 
                                type="checkbox" 
                                checked={(q as any).hasOther || false}
                                onChange={e => updateQuestion(i, { hasOther: e.target.checked })}
                              />
                              Add "Other" option
                            </label>
                          )}
                        </div>
                      )}

                      {/* Grid */}
                      {((q as any).type === 'grid_radio' || (q as any).type === 'grid_checkbox') && (
                        <div>
                          <p className="text-sm font-medium mb-2">Rows</p>
                          {((q as any).rows || ['Row 1']).map((row: string, j: number) => (
                            <input key={j} value={row} onChange={e => {
                              const rows = [...((q as any).rows || [])];
                              rows[j] = e.target.value;
                              updateQuestion(i, { rows });
                            }} className="w-full p-2 border-b mb-2 bg-transparent" placeholder={`Row ${j + 1}`} />
                          ))}
                          <button onClick={() => updateQuestion(i, { rows: [...((q as any).rows || []), 'Row'] })} className="text-indigo-600 text-sm">+ Add row</button>
                          
                          <p className="text-sm font-medium mb-2 mt-4">Columns</p>
                          {((q as any).columns || ['Column 1']).map((col: string, j: number) => (
                            <input key={j} value={col} onChange={e => {
                              const cols = [...((q as any).columns || [])];
                              cols[j] = e.target.value;
                              updateQuestion(i, { columns: cols });
                            }} className="w-full p-2 border-b mb-2 bg-transparent" placeholder={`Column ${j + 1}`} />
                          ))}
                          <button onClick={() => updateQuestion(i, { columns: [...((q as any).columns || []), 'Column'] })} className="text-indigo-600 text-sm">+ Add column</button>
                        </div>
                      )}

                      {/* Linear Scale */}
                      {(q as any).type === 'scale' && (
                        <div className="flex items-center gap-4">
                          <input 
                            type="number" 
                            value={(q as any).min || 1} 
                            onChange={e => updateQuestion(i, { min: parseInt(e.target.value) })}
                            className="w-20 p-3 border rounded-xl text-center bg-transparent"
                          />
                          <span>to</span>
                          <input 
                            type="number" 
                            value={(q as any).max || 10} 
                            onChange={e => updateQuestion(i, { max: parseInt(e.target.value) })}
                            className="w-20 p-3 border rounded-xl text-center bg-transparent"
                          />
                        </div>
                      )}

                      {/* File Upload */}
                      {(q as any).type === 'file' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                          <MdCloudUpload size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Accepts images, PDFs, docs up to 10MB</p>
                        </div>
                      )}

                      {/* Date / Time */}
                      {(q as any).type === 'date' && <input type="date" className="p-4 border rounded-xl bg-transparent" disabled />}
                      {(q as any).type === 'time' && <input type="time" className="p-4 border rounded-xl bg-transparent" disabled />}

                      {/* Rating */}
                      {(q as any).type === 'rating' && (
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(n => <Star key={n} className="w-8 h-8 text-yellow-500" />)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(q as any).required || false}
                          onChange={e => updateQuestion(i, { required: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <span className="font-medium">Required</span>
                      </label>
                      <select
                        value={(q as any).type}
                        onChange={e => updateQuestion(i, { type: e.target.value, options: e.target.value.includes('choice') || e.target.value === 'radio' || e.target.value === 'multiple' || e.target.value === 'dropdown' ? ['Option 1'] : undefined })}
                        className="px-4 py-2 border rounded-xl bg-transparent text-sm"
                      >
                        {questionTypes.map(t => (
                          <option key={t.type} value={t.type}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => addQuestion('text')}
              className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center gap-4 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-all"
            >
              <MdAdd size={36} />
              <span className="text-lg font-medium">Add question</span>
            </button>
            <button
              onClick={() => addQuestion('section')}
              className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center gap-4 text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-all"
            >
              <MdTitle size={36} />
              <span className="text-lg font-medium">Add section</span>
            </button>
          </div>
        </main>

        <aside className="space-y-6">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-sm p-6 border`}>
            <h3 className="font-bold text-lg mb-5">Add question type</h3>
            <div className="grid grid-cols-1 gap-3">
              {questionTypes.map(t => (
                <button
                  key={t.type}
                  onClick={() => addQuestion(t.type as any)}
                  className="p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-left transition-all group flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-all flex-shrink-0">
                    {typeof t.icon === 'string' ? t.icon : t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{t.label}</p>
                    <p className="text-xs text-gray-500 truncate">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowTheme(v => !v)}
            className="w-full p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <MdColorLens size={28} /> Customize Theme
          </button>
          <AnimatePresence>
            {showTheme && <ThemePanel theme={theme} onThemeChange={setTheme} />}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
