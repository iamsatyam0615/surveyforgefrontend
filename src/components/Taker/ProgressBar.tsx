'use client';

export default function ProgressBar() {
  // Simple progress indicator
  return (
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: '50%' }}
        />
      </div>
    </div>
  );
}
