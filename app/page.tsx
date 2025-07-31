'use client';

import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import AssessmentResult from './components/AssessmentResult';
import LoadingSpinner from './components/LoadingSpinner';
import { AssessmentResult as AssessmentResultType } from './types';
import { Shield, Smartphone, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResultType | null>(null);

  const handleImageSelect = async (imageUrl: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        setResult(data.result);
        toast.success('Assessment completed successfully!');
      } else {
        toast.error(data.error || 'Failed to process image');
      }
    } catch (error) {
      console.error('Assessment error:', error);
      toast.error('Failed to connect to assessment service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Phone Damage Assessor
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              AI-Powered Insurance Tool
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Intelligent Phone Damage Assessment
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload a photo of a damaged phone and get instant AI-powered analysis including 
              device identification, damage assessment, and cost estimates for insurance claims.
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <Smartphone className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Device Recognition</h3>
                <p className="text-sm text-gray-600">
                  Automatically identify phone make, model, color, and year
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <Shield className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Damage Analysis</h3>
                <p className="text-sm text-gray-600">
                  Detailed damage assessment with severity classification
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Cost Estimation</h3>
                <p className="text-sm text-gray-600">
                  Accurate repair and replacement cost estimates
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Upload Phone Image
            </h3>
            <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Results Section */}
          {result && !isLoading && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <AssessmentResult result={result} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Phone Damage Assessor - Insurance AI Tool</p>
            <p className="mt-1">Powered by advanced computer vision and AI analysis</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 