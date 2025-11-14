'use client';

export default function QuestionSidebar() {
  const questionTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'multiple', label: 'Multiple Choice', icon: '☑️' },
    { type: 'radio', label: 'Single Choice', icon: '🔘' },
    { type: 'rating', label: 'Rating', icon: '⭐' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Question Types</h2>
      <p className="text-sm text-gray-600 mb-4">Drag and drop to add questions</p>
      
      <div className="space-y-2">
        {questionTypes.map((qt) => (
          <div
            key={qt.type}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition"
            draggable
          >
            <span className="mr-2">{qt.icon}</span>
            <span className="text-sm font-medium">{qt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
