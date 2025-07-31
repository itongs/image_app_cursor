'use client';

import React from 'react';
import { AssessmentResult as AssessmentResultType } from '@/app/types';
import { Phone, AlertTriangle, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface AssessmentResultProps {
  result: AssessmentResultType;
}

const severityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};

const severityIcons = {
  low: CheckCircle,
  medium: AlertTriangle,
  high: AlertTriangle,
  critical: AlertTriangle,
};

export default function AssessmentResult({ result }: AssessmentResultProps) {
  const SeverityIcon = severityIcons[result.damageSummary.severity];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
        <p className="text-gray-600">
          Processed in {result.processingTime.toFixed(1)} seconds
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Phone Metadata */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Phone Details</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Make:</span>
              <span className="font-medium">{result.phoneMetadata.make}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model:</span>
              <span className="font-medium">{result.phoneMetadata.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Color:</span>
              <span className="font-medium">{result.phoneMetadata.color}</span>
            </div>
            {result.phoneMetadata.year && (
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-medium">{result.phoneMetadata.year}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium">
                {(result.phoneMetadata.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Damage Summary */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <SeverityIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Damage Analysis</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Description:</span>
              <p className="font-medium mt-1">{result.damageSummary.description}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Severity:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${severityColors[result.damageSummary.severity]}`}>
                {result.damageSummary.severity.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Affected Areas:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {result.damageSummary.affectedAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Repair Time:</span>
              <span className="font-medium">{result.damageSummary.estimatedRepairTime}</span>
            </div>
          </div>
        </div>

        {/* Cost Estimates */}
        <div className="card md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cost Estimates</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Repair Cost */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Repair Cost</h4>
              <div className="text-2xl font-bold text-blue-600">
                ${result.costEstimate.repairCost.min} - ${result.costEstimate.repairCost.max}
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Confidence: {(result.costEstimate.confidence * 100).toFixed(1)}%
              </p>
            </div>

            {/* Replacement Cost */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Replacement Cost</h4>
              <div className="text-2xl font-bold text-green-600">
                ${result.costEstimate.replacementCost.amount}
              </div>
              <p className="text-sm text-green-700 mt-1">
                Same model replacement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-center text-sm text-gray-500">
        Assessment completed on {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  );
} 