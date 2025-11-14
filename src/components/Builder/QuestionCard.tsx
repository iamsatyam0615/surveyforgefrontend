'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MdDragIndicator, MdDelete, MdContentCopy } from 'react-icons/md';

interface QuestionCardProps {
  question: any;
  index: number;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
  theme?: any;
  shouldFocus?: boolean;
}

const questionIcons: Record<string, string> = {
  text: '📝',
  paragraph: '📄',
  multiple: '☑️',
  radio: '🔘',
  dropdown: '📋',
  rating: '⭐',
  scale: '📊',
  date: '📅',
  time: '🕐'
};

export default function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  theme,
  shouldFocus = false
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastOptionIndex, setLastOptionIndex] = useState<number | null>(null);
  const optionInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const primaryColor = theme?.primary || '#7C3AED';

  // Drag and Drop
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
      if (onMove && item.index !== index) {
        onMove(item.index, index);
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
    if (dragHandleRef.current && onMove) {
      drag(dragHandleRef.current);
    }
  }, [drag, onMove]);

  // Auto-focus the newly added option input
  useEffect(() => {
    if (lastOptionIndex !== null && optionInputRefs.current[lastOptionIndex]) {
      optionInputRefs.current[lastOptionIndex]?.focus();
      setLastOptionIndex(null);
    }
  }, [lastOptionIndex, question.options]);

  // Auto-focus question input when new question is added
  useEffect(() => {
    if (shouldFocus && questionInputRef.current && isExpanded) {
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 100);
    }
  }, [shouldFocus, isExpanded]);

  return (
    <div ref={drop as any} className="relative">
      {/* Drop indicator line */}
      {isOver && !isDragging && (
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full shadow-lg z-10"
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ 
          opacity: isDragging ? 0.5 : 1, 
          y: 0,
          scale: isDragging ? 1.02 : 1,
          rotateZ: isDragging ? 2 : 0,
        }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ 
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={`group ${isDragging ? 'cursor-grabbing shadow-2xl' : ''}`}
      >
        <div className={`bg-white border rounded-lg overflow-hidden transition-all ${
          isDragging ? 'border-blue-400 ring-2 ring-blue-300 shadow-xl' : 'border-gray-200'
        } ${isOver && !isDragging ? 'border-blue-400 border-2 bg-blue-50/30' : ''}`}>
          {/* Header */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-200 bg-gray-50/60">
            {onMove && (
              <div 
                ref={dragHandleRef}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-all hover:scale-110 p-1 rounded hover:bg-gray-100"
                title="Drag to reorder"
              >
                <MdDragIndicator size={20} />
              </div>
            )}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{questionIcons[question.type]}</span>
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-semibold rounded">
              Q{index + 1}
            </span>
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
              {question.type === 'text' && 'Short Answer'}
              {question.type === 'paragraph' && 'Paragraph'}
              {question.type === 'multiple' && 'Multiple Choice'}
              {question.type === 'radio' && 'Single Choice'}
              {question.type === 'dropdown' && 'Dropdown'}
              {question.type === 'rating' && 'Star Rating'}
              {question.type === 'scale' && 'Linear Scale'}
              {question.type === 'date' && 'Date'}
              {question.type === 'time' && 'Time'}
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onDuplicate}
              className="p-2 hover:bg-blue-50 rounded-md"
              title="Duplicate"
            >
              <MdContentCopy size={16} className="text-blue-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 rounded-md"
              title="Delete"
            >
              <MdDelete size={16} className="text-red-600" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg className={`w-4 h-4 transition-transform text-gray-700 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question Content */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="p-5 space-y-4"
          >
            {/* Question Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
              <input
                ref={questionInputRef}
                type="text"
                value={question.question}
                onChange={(e) => onUpdate({ question: e.target.value })}
                placeholder="Enter your question…"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Options (for multiple choice, radio, and dropdown) */}
            {(question.type === 'multiple' || question.type === 'radio' || question.type === 'dropdown') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {question.options?.map((option: string, optIndex: number) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-medium w-5 text-right">{optIndex + 1}.</span>
                      <input
                        ref={(el) => {
                          optionInputRefs.current[optIndex] = el;
                        }}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[optIndex] = e.target.value;
                          onUpdate({ options: newOptions });
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {question.options.length > 1 && (
                        <button
                          onClick={() => {
                            const newOptions = question.options.filter((_: any, i: number) => i !== optIndex);
                            onUpdate({ options: newOptions });
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <MdDelete size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(question.options || []), ''];
                      onUpdate({ options: newOptions });
                      setLastOptionIndex(newOptions.length - 1);
                    }}
                    className="w-full px-3 py-2 border border-dashed border-gray-300 rounded text-gray-600 hover:border-blue-400 hover:text-blue-600 text-sm"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {/* Scale Min/Max Settings */}
            {question.type === 'scale' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Scale Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum
                    </label>
                    <input
                      type="number"
                      value={question.min || 1}
                      onChange={(e) => onUpdate({ min: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum
                    </label>
                    <input
                      type="number"
                      value={question.max || 10}
                      onChange={(e) => onUpdate({ max: parseInt(e.target.value) || 10 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Required Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  style={{ accentColor: primaryColor }}
                />
                <span className="text-xs font-medium text-gray-700">Required</span>
              </label>
            </div>
          </motion.div>
        )}
      </div>
      </motion.div>
    </div>
  );
}
