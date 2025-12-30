'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Clock, Download } from 'lucide-react'
import { getABTestResults, getConversionFunnel, exportAnalyticsData, clearAnalyticsData } from '@/lib/form-analytics'

interface DashboardProps {
  isVisible: boolean
  onClose: () => void
}

export default function AnalyticsDashboard({ isVisible, onClose }: DashboardProps) {
  const [testResults, setTestResults] = useState<any>(null)
  const [overallFunnel, setOverallFunnel] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (isVisible) {
      refreshData()
    }
  }, [isVisible, refreshKey])

  const refreshData = () => {
    setTestResults(getABTestResults())
    setOverallFunnel(getConversionFunnel())
  }

  const handleExport = () => {
    const data = exportAnalyticsData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lbta-form-analytics-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData()
      setRefreshKey(k => k + 1)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-black">Registration Form Analytics</h2>
            <p className="font-sans text-sm text-black/60">A/B Testing Results & Conversion Metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-lbta-orange text-white rounded-full font-sans text-sm font-medium hover:bg-lbta-red transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-black rounded-full font-sans text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* A/B Test Results */}
          {testResults && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-black">Embedded Forms</h3>
                    <p className="font-sans text-sm text-black/60">New slide-up registration experience</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-sm text-black/60">Conversion Rate</p>
                    <p className="font-serif text-2xl font-bold text-green-600">
                      {testResults.embedded.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm text-black/60">Completion Rate</p>
                    <p className="font-serif text-2xl font-bold text-green-600">
                      {testResults.embedded.completionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="font-sans text-xs text-black/50">Views</p>
                      <p className="font-sans text-sm font-semibold">{testResults.embedded.programView}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-black/50">Starts</p>
                      <p className="font-sans text-sm font-semibold">{testResults.embedded.formStart}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-black/50">Completes</p>
                      <p className="font-sans text-sm font-semibold">{testResults.embedded.formComplete}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-black/50">Submits</p>
                      <p className="font-sans text-sm font-semibold">{testResults.embedded.formSubmit}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-black">Modal Forms</h3>
                    <p className="font-sans text-sm text-black/60">Original popup registration experience</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-sm text-black/60">Conversion Rate</p>
                    <p className="font-serif text-2xl font-bold text-blue-600">
                      {testResults.modal.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm text-black/60">Completion Rate</p>
                    <p className="font-serif text-2xl font-bold text-blue-600">
                      {testResults.modal.completionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="font-sans text-xs text-black/50">Views</p>
                      <p className="font-sans text-sm font-semibold">{testResults.modal.programView}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-black/50">Starts</p>
                      <p className="font-sans text-sm font-semibold">{testResults.modal.formStart}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-black/50">Completes</p>
                      <p className="font-sans text-sm font-semibold">{testResults.modal.formComplete}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-black/50">Submits</p>
                      <p className="font-sans text-sm font-semibold">{testResults.modal.formSubmit}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Improvement Summary */}
          {testResults && testResults.improvement !== 0 && (
            <div className={`rounded-xl p-6 border ${
              testResults.improvement > 0 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  testResults.improvement > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <BarChart3 className={`w-6 h-6 ${
                    testResults.improvement > 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-black">
                    Conversion Rate {testResults.improvement > 0 ? 'Improvement' : 'Decrease'}
                  </h3>
                  <p className={`font-serif text-3xl font-bold ${
                    testResults.improvement > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {testResults.improvement > 0 ? '+' : ''}{testResults.improvement.toFixed(1)}%
                  </p>
                  <p className="font-sans text-sm text-black/60 mt-1">
                    {testResults.improvement > 0 
                      ? 'Embedded forms are performing better than modal forms'
                      : 'Modal forms are currently performing better'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Overall Statistics */}
          {overallFunnel && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-lbta-orange" />
                <h3 className="font-serif text-xl font-semibold text-black">Overall Performance</h3>
              </div>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="font-sans text-sm text-black/60 mb-2">Program Views</p>
                  <p className="font-serif text-2xl font-bold text-black">{overallFunnel.programView}</p>
                </div>
                <div className="text-center">
                  <p className="font-sans text-sm text-black/60 mb-2">Form Starts</p>
                  <p className="font-serif text-2xl font-bold text-lbta-orange">{overallFunnel.formStart}</p>
                </div>
                <div className="text-center">
                  <p className="font-sans text-sm text-black/60 mb-2">Form Completes</p>
                  <p className="font-serif text-2xl font-bold text-lbta-orange">{overallFunnel.formComplete}</p>
                </div>
                <div className="text-center">
                  <p className="font-sans text-sm text-black/60 mb-2">Submissions</p>
                  <p className="font-serif text-2xl font-bold text-green-600">{overallFunnel.formSubmit}</p>
                </div>
                <div className="text-center">
                  <p className="font-sans text-sm text-black/60 mb-2">Conversion Rate</p>
                  <p className="font-serif text-2xl font-bold text-green-600">{overallFunnel.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="flex-1 bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold py-3 px-6 rounded-full transition-colors"
            >
              Refresh Data
            </button>
            <button
              onClick={handleClearData}
              className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 font-sans font-semibold py-3 px-6 rounded-full transition-colors"
            >
              Clear All Data
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-serif text-lg font-semibold text-blue-900 mb-3">Analytics Instructions</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>Conversion Rate:</strong> (Form Submits / Program Views) × 100</p>
              <p>• <strong>Completion Rate:</strong> (Form Submits / Form Starts) × 100</p>
              <p>• Data is stored locally in browser localStorage</p>
              <p>• Export data regularly for external analysis</p>
              <p>• Clear data periodically to reset testing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
