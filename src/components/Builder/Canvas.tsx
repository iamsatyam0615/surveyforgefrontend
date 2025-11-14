'use client';

import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import useSurveyStore from '@/stores/useSurveyStore';
import useSurvey from '@/hooks/useSurvey';
import Button from '../common/Button';
import Input from '../common/Input';

export default function Canvas() {
  const router = useRouter();
  const { title, description, questions, surveyId, theme, setTitle, setDescription, addQuestion, updateQuestion, deleteQuestion } = useSurveyStore();
  const { createSurvey, updateSurvey } = useSurvey();
  const [focusTarget, setFocusTarget] = useState<{ qIndex: number; optIndex: number } | null>(null);
  const optionInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (focusTarget) {
      const key = `${focusTarget.qIndex}-${focusTarget.optIndex}`;
      optionInputRefs.current[key]?.focus();
      setFocusTarget(null);
    }
  }, [focusTarget, questions]);

  const handleSave = async () => {
    const surveyData = {
      title,
      description,
      questions,
      theme,
      active: true,
      preventDuplicates: false
    };

    try {
      if (surveyId) {
        await updateSurvey(surveyId, surveyData);
      } else {
        const newSurvey = await createSurvey(surveyData);
        router.push(`/admin/surveys/${newSurvey._id}`);
      }
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Survey Title"
            className="text-2xl font-bold"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Survey Description (optional)"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            rows={2}
          />
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((question, index) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">Question {index + 1} - {question.type}</span>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              
              <Input
                value={question.question}
                onChange={(e) => updateQuestion(index, { question: e.target.value })}
                placeholder="Enter your question"
              />

              {(question.type === 'multiple' || question.type === 'radio') && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Options:</p>
                  {question.options?.map((option, optIndex) => (
                    <Input
                      key={optIndex}
                      ref={(el: any) => {
                        optionInputRefs.current[`${index}-${optIndex}`] = el;
                      }}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || [])];
                        newOptions[optIndex] = e.target.value;
                        updateQuestion(index, { options: newOptions });
                      }}
                      placeholder={`Option ${optIndex + 1}`}
                    />
                  ))}
                  <Button
                    onClick={() => {
                      const newOptions = [...(question.options || []), ''];
                      updateQuestion(index, { options: newOptions });
                      setFocusTarget({ qIndex: index, optIndex: newOptions.length - 1 });
                    }}
                    variant="secondary"
                    className="mt-2"
                  >
                    + Add Option
                  </Button>
                </div>
              )}

              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Required</span>
              </label>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mb-4">
          <Button onClick={() => addQuestion('text')}>+ Text</Button>
          <Button onClick={() => addQuestion('multiple')}>+ Multiple Choice</Button>
          <Button onClick={() => addQuestion('radio')}>+ Single Choice</Button>
          <Button onClick={() => addQuestion('rating')}>+ Rating</Button>
        </div>

        <Button onClick={handleSave} variant="primary" className="w-full">
          {surveyId ? 'Update Survey' : 'Create Survey'}
        </Button>
      </div>
    </div>
  );
}
