import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Zap, Download } from 'lucide-react';
import { MetricCard } from '@components/data/MetricCard';
import { TimeSeriesChart } from '@components/data/TimeSeriesChart';
import { Button } from '@components/ui/Button';

/**
 * Financial Dashboard & ROI Tracking
 * Track savings, earnings, and return on investment
 */
export function FinancialDashboard() {
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('month');

  // Mock financial data
  const financialData = {
    thisMonth: {
      gridSavings: 1240,
      exportEarnings: 380,
      totalSavings: 1620,
      gridCostAvoided: 2100,
      comparison: 12 // % vs last month
    },
    thisYear: {
      gridSavings: 12450,
      exportEarnings: 3680,
      totalSavings: 16130,
      gridCostAvoided: 21000,
      comparison: 18
    },
    systemCost: 8500,
    installDate: '2024-01-15',
    paybackPeriod: 6.2,
    lifetimeSavings: 18420,
    co2Saved: 9.4 // tonnes
  };

  const current = timeRange === 'month' ? financialData.thisMonth : financialData.thisYear;
  const monthsSinceInstall = Math.floor(
    (Date.now() - new Date(financialData.installDate).getTime()) / (30 * 24 * 3600 * 1000)
  );
  const roiProgress = (financialData.lifetimeSavings / financialData.systemCost) * 100;

  return (
    <div className="safe-container py-4 md:py-6 space-y-6 bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-lime-400/20 rounded-lg">
            <DollarSign className="text-lime-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Financial Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Track your savings and return on investment
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'month' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'year' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Savings"
          value={`$${current.totalSavings.toLocaleString()}`}
          subtitle={timeRange === 'month' ? 'This month' : 'This year'}
          icon={PiggyBank}
          status="positive"
          trend={{ value: current.comparison, label: 'vs last period' }}
        />
        <MetricCard
          title="Grid Savings"
          value={`$${current.gridSavings.toLocaleString()}`}
          subtitle="Avoided costs"
          icon={Zap}
          status="positive"
        />
        <MetricCard
          title="Export Earnings"
          value={`$${current.exportEarnings.toLocaleString()}`}
          subtitle="Sold to grid"
          icon={TrendingUp}
          status="positive"
        />
        <MetricCard
          title="ROI Progress"
          value={`${roiProgress.toFixed(1)}%`}
          subtitle={`${financialData.paybackPeriod} years to payback`}
          icon={TrendingUp}
          status="positive"
        />
      </div>

      {/* ROI Progress Bar */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">
            Investment Recovery
          </h3>
          <span className="text-sm text-gray-400">
            ${financialData.lifetimeSavings.toLocaleString()} / ${financialData.systemCost.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-4 bg-[#0f0f0f] rounded-full overflow-hidden border border-gray-800">
          <div
            className="h-full bg-gradient-to-r from-lime-400 to-green-400 transition-all duration-500"
            style={{ width: `${Math.min(roiProgress, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          {roiProgress >= 100 ? (
            <span className="text-lime-400 font-medium">✅ System has paid for itself!</span>
          ) : (
            <>Estimated {financialData.paybackPeriod} years until break-even ({monthsSinceInstall} months elapsed)</>
          )}
        </p>
      </div>

      {/* Savings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Savings Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <span className="text-gray-400">Grid electricity avoided</span>
              <span className="font-semibold text-white">
                ${current.gridCostAvoided.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <span className="text-gray-400">Solar self-consumption</span>
              <span className="font-semibold text-lime-400">
                ${current.gridSavings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <span className="text-gray-400">Grid export revenue</span>
              <span className="font-semibold text-green-400">
                +${current.exportEarnings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-white">Net Savings</span>
              <span className="text-xl font-bold text-lime-400">
                ${current.totalSavings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Environmental Impact
          </h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-lime-400/20 rounded-lg border border-gray-800">
              <div className="text-3xl font-bold text-lime-400 mb-1">
                {financialData.co2Saved} tonnes
              </div>
              <div className="text-sm text-gray-400">
                CO₂ emissions prevented
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#0f0f0f] rounded border border-gray-800">
                <div className="text-lg font-semibold text-white">
                  {Math.floor(financialData.co2Saved * 47)} 🌳
                </div>
                <div className="text-xs text-gray-500">Trees equivalent</div>
              </div>
              <div className="p-3 bg-[#0f0f0f] rounded border border-gray-800">
                <div className="text-lg font-semibold text-white">
                  {Math.floor(financialData.co2Saved * 3200)} km
                </div>
                <div className="text-xs text-gray-500">Car miles offset</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Report */}
      <div className="flex justify-end">
        <Button variant="secondary">
          <Download size={18} className="mr-2" />
          Export Financial Report
        </Button>
      </div>
    </div>
  );
}
