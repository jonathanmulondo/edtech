import { useState, useEffect, useMemo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Zap, DollarSign, Clock } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { MetricCard } from '@components/data/MetricCard';
import { TimeSeriesChart } from '@components/data/TimeSeriesChart';
import { AIChatbot } from '@components/ui/AIChatbot';
import {
  predictSolarProduction,
  generateAISuggestions,
  detectAnomalies,
  predictBatteryRuntime,
  type AISuggestion,
  type EnergyPrediction,
  type AnomalyDetection
} from '@lib/ai/predictions';
import type { Site } from '@types';

// Mock data
const mockSite: Site = {
  siteId: "site_123",
  name: "Mulondo Residence",
  timezone: "Africa/Nairobi",
  location: { lat: -1.2921, lon: 36.8219, address: "Nairobi, Kenya" },
  lastSync: new Date().toISOString(),
  current: {
    solarW: 1200,
    homeW: 900,
    battery: { soc: 45, powerW: -300, voltage: 51.2, current: 5.8, temperature: 28 },
    gridW: 0
  },
  alarms: [],
  devices: []
};

const mockHistoricalData = Array.from({ length: 168 }, (_, i) => {
  const hour = (new Date().getHours() - (168 - i)) % 24;
  const isDaytime = hour >= 6 && hour <= 18;
  return {
    ts: Date.now() - (168 - i) * 3600000,
    productionW: isDaytime ? Math.random() * 2000 * Math.sin((hour - 6) / 12 * Math.PI) : 0,
    consumptionW: 400 + Math.random() * 600,
    batteryW: 0,
    gridW: 0,
    soc: 50 + Math.random() * 30
  };
});

/**
 * AI Insights & Predictions Page
 * Shows ML-powered forecasts and intelligent suggestions
 */
export function AIInsights() {
  const [selectedTab, setSelectedTab] = useState<'predictions' | 'suggestions' | 'anomalies'>('suggestions');

  // Generate predictions
  const predictions = useMemo(() =>
    predictSolarProduction(mockHistoricalData),
    [mockHistoricalData]
  );

  // Generate AI suggestions
  const suggestions = useMemo(() =>
    generateAISuggestions(mockSite, mockHistoricalData, predictions),
    [mockSite, mockHistoricalData, predictions]
  );

  // Detect anomalies
  const anomaly = useMemo(() =>
    detectAnomalies(mockSite, mockHistoricalData),
    [mockSite, mockHistoricalData]
  );

  // Battery runtime prediction
  const batteryPrediction = useMemo(() =>
    predictBatteryRuntime(mockSite.current.battery.soc, mockSite.current.homeW),
    [mockSite]
  );

  // Calculate potential savings from all suggestions
  const totalPotentialSavings = suggestions
    .filter(s => s.potentialSavings)
    .reduce((sum, s) => sum + (s.potentialSavings || 0), 0);

  return (
    <div className="safe-container py-4 space-y-4 bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-3xl font-light text-white mb-1 tracking-tight">
          AI <span className="font-semibold text-lime-400">Insights</span>
        </h1>
        <p className="text-sm text-gray-400">
          Powered by machine learning • Updated just now
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Potential Savings"
          value={`$${totalPotentialSavings}`}
          subtitle="This month"
          icon={DollarSign}
          status="positive"
        />
        <MetricCard
          title="AI Suggestions"
          value={suggestions.length}
          subtitle="Active recommendations"
          icon={Lightbulb}
          status="neutral"
        />
        <MetricCard
          title="Battery Runtime"
          value={batteryPrediction.hoursRemaining.toFixed(1)}
          unit="hrs"
          subtitle={`${(batteryPrediction.confidence * 100).toFixed(0)}% confidence`}
          icon={Clock}
          status="neutral"
        />
      </div>

      {/* Anomaly Alert */}
      {anomaly.detected && (
        <div className={`border-l-4 rounded-lg p-4 bg-[#1a1a1a] ${
          anomaly.severity === 'critical'
            ? 'border-red-500'
            : 'border-amber-500'
        }`}>
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={anomaly.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}
              size={24}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                Anomaly Detected: {anomaly.type?.replace('_', ' ').toUpperCase()}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                {anomaly.message}
              </p>
              <div className="text-sm text-gray-400 mb-2">
                <strong>Expected:</strong> {anomaly.expectedValue.toFixed(0)}W •
                <strong className="ml-2">Actual:</strong> {anomaly.actualValue.toFixed(0)}W •
                <strong className="ml-2">Deviation:</strong> {anomaly.deviation.toFixed(0)}%
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-300">
                  Possible causes
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-gray-400">
                  {anomaly.possibleCauses.map((cause, i) => (
                    <li key={i}>• {cause}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex gap-4">
          {[
            { id: 'suggestions', label: 'AI Suggestions', icon: Lightbulb },
            { id: 'predictions', label: 'Forecasts', icon: TrendingUp },
            { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'border-lime-400 text-lime-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* AI Suggestions Tab */}
      {selectedTab === 'suggestions' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Our AI analyzes your energy patterns and provides personalized recommendations to maximize savings and efficiency.
          </p>

          {suggestions.length === 0 ? (
            <div className="text-center py-12 bg-[#1a1a1a] rounded-lg border border-gray-800">
              <Lightbulb className="mx-auto h-12 w-12 text-gray-500 mb-3" />
              <p className="text-gray-400">
                No suggestions at the moment. You're doing great! 🎉
              </p>
            </div>
          ) : (
            suggestions.map(suggestion => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))
          )}
        </div>
      )}

      {/* Predictions Tab */}
      {selectedTab === 'predictions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              24-Hour Solar Production Forecast
            </h2>
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
              <TimeSeriesChart
                data={predictions.map(p => ({
                  ts: new Date(p.timestamp).getTime(),
                  productionW: p.predictedProductionW,
                  consumptionW: p.predictedConsumptionW,
                  batteryW: 0,
                  gridW: 0
                }))}
                height={300}
              />
              <p className="mt-4 text-sm text-gray-400">
                Predictions based on historical patterns, weather forecast, and ML algorithms
              </p>
            </div>
          </div>

          {/* Prediction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-white mb-3">
                Next 6 Hours
              </h3>
              <div className="space-y-2">
                {predictions.slice(0, 6).map((pred, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {new Date(pred.timestamp).getHours()}:00
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {(pred.predictedProductionW / 1000).toFixed(1)} kW
                      </span>
                      <span className="text-xs text-gray-500">
                        {(pred.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-white mb-3">
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Peak Production</span>
                  <span className="font-semibold text-white">
                    {(Math.max(...predictions.map(p => p.predictedProductionW)) / 1000).toFixed(1)} kW
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Expected</span>
                  <span className="font-semibold text-white">
                    {(predictions.reduce((sum, p) => sum + p.predictedProductionW, 0) / 1000).toFixed(1)} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Confidence</span>
                  <span className="font-semibold text-white">
                    {(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anomalies Tab */}
      {selectedTab === 'anomalies' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            AI-powered anomaly detection monitors your system 24/7 for unusual patterns.
          </p>

          {!anomaly.detected ? (
            <div className="text-center py-12 bg-[#1a1a1a] rounded-lg border border-gray-800">
              <Zap className="mx-auto h-12 w-12 text-lime-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">
                System Operating Normally
              </h3>
              <p className="text-gray-400">
                No anomalies detected in the last 24 hours
              </p>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
              <div className="flex items-start gap-4">
                <AlertTriangle className="text-amber-400 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {anomaly.type?.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {anomaly.message}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#0f0f0f] rounded p-3 border border-gray-800">
                      <div className="text-xs text-gray-500 mb-1">Expected</div>
                      <div className="text-lg font-semibold text-white">
                        {anomaly.expectedValue.toFixed(0)}W
                      </div>
                    </div>
                    <div className="bg-[#0f0f0f] rounded p-3 border border-gray-800">
                      <div className="text-xs text-gray-500 mb-1">Actual</div>
                      <div className="text-lg font-semibold text-white">
                        {anomaly.actualValue.toFixed(0)}W
                      </div>
                    </div>
                    <div className="bg-[#0f0f0f] rounded p-3 border border-gray-800">
                      <div className="text-xs text-gray-500 mb-1">Deviation</div>
                      <div className="text-lg font-semibold text-amber-400">
                        {anomaly.deviation.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-2">
                      Possible Causes
                    </h4>
                    <ul className="space-y-1">
                      {anomaly.possibleCauses.map((cause, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-lime-400 mt-1">•</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}

/**
 * Individual suggestion card component
 */
function SuggestionCard({ suggestion }: { suggestion: AISuggestion }) {
  const priorityColors = {
    low: 'border-blue-500 bg-[#1a1a1a]',
    medium: 'border-lime-400 bg-[#1a1a1a]',
    high: 'border-amber-500 bg-[#1a1a1a]',
    critical: 'border-red-500 bg-[#1a1a1a]'
  };

  const priorityIcons = {
    low: '💡',
    medium: '⚡',
    high: '⚠️',
    critical: '🚨'
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 ${priorityColors[suggestion.priority]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{priorityIcons[suggestion.priority]}</span>
            <h3 className="font-semibold text-white">
              {suggestion.title}
            </h3>
            {suggestion.potentialSavings && (
              <span className="ml-auto px-2 py-1 bg-lime-400/20 text-lime-400 text-xs font-medium rounded">
                Save ${suggestion.potentialSavings}/mo
              </span>
            )}
          </div>

          <p className="text-sm text-gray-400 mb-2">
            {suggestion.description}
          </p>

          {suggestion.estimatedImpact && (
            <p className="text-xs text-gray-500 mb-2">
              💰 {suggestion.estimatedImpact}
            </p>
          )}

          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-gray-500">
              Why this suggestion?
            </summary>
            <p className="mt-1 text-xs text-gray-400">
              {suggestion.reasoning}
            </p>
          </details>
        </div>

        {suggestion.actionable && suggestion.action && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => alert(`Executing: ${suggestion.action?.type}`)}
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
}
