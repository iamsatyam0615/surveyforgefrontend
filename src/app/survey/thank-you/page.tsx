'use client';

import Link from 'next/link';
import Button from '@/components/common/Button';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-12 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thank You! 🎉
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Your response has been successfully submitted.
        </p>

        <div className="space-y-4">
          <p className="text-gray-500">
            We appreciate you taking the time to complete this survey.
            Your feedback is valuable to us!
          </p>

          <div className="pt-6">
            <Link href="/">
              <Button>
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
