'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Analyzing phone damage...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      <p className="mt-2 text-sm text-gray-500">This may take a few seconds...</p>
    </div>
  );
} 