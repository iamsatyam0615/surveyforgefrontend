'use client';

import { useParams } from 'next/navigation';
import ResponseTable from '@/components/Analytics/ResponseTable';
import Charts from '@/components/Analytics/Charts';
import Link from 'next/link';

export default function AnalyticsPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-2xl font-bold text-primary">
                SurveyForge
              </Link>
              <span className="text-gray-500">/ Analytics</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Survey Analytics</h1>
        <Charts surveyId={params.id as string} />
        <ResponseTable surveyId={params.id as string} />
      </div>
    </div>
  );
}
