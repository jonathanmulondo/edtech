import { useState } from 'react';
import { Activity, Sun, Battery, Zap, Server, Cpu, HardDrive, TrendingUp } from 'lucide-react';
import { MetricCard } from '@components/data/MetricCard';

/**
 * System Overview Page
 * Detailed solar panel system information and status
 */
export function AutomationPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'maintenance'>('overview');

  return (
    <div className="safe-container py-4 space-y-4 bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-3xl font-light text-white mb-1 tracking-tight">
          System <span className="font-semibold text-lime-400">Overview</span>
        </h1>
        <p className="text-sm text-gray-400">
          Detailed solar panel system information
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="System Status"
          value="Online"
          subtitle="All systems operational"
          icon={Activity}
          status="positive"
        />
        <MetricCard
          title="Uptime"
          value="99.8%"
          subtitle="Last 30 days"
          icon={TrendingUp}
          status="positive"
        />
        <MetricCard
          title="Total Panels"
          value="12"
          subtitle="400W each"
          icon={Sun}
          status="neutral"
        />
        <MetricCard
          title="System Age"
          value="2.3 yrs"
          subtitle="Installed Mar 2022"
          icon={Server}
          status="neutral"
        />
      </div>

      {/* Real-Time System Status */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={20} className="text-lime-400" />
          Real-Time Status
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <Sun className="text-amber-400" size={20} />
              <div>
                <p className="font-semibold text-white text-sm">Solar Production</p>
                <p className="text-xs text-gray-500">Current output</p>
              </div>
            </div>
            <span className="text-xl font-bold text-lime-400">1.5 kW</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <Battery className="text-purple-400" size={20} />
              <div>
                <p className="font-semibold text-white text-sm">Battery Status</p>
                <p className="text-xs text-gray-500">State of charge</p>
              </div>
            </div>
            <span className="text-xl font-bold text-purple-400">68%</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <Zap className="text-green-400" size={20} />
              <div>
                <p className="font-semibold text-white text-sm">Grid Export</p>
                <p className="text-xs text-gray-500">Surplus energy</p>
              </div>
            </div>
            <span className="text-xl font-bold text-green-400">420 W</span>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-lime-400" />
          Performance Analytics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Daily Average</p>
            <p className="text-2xl font-bold text-white">24.5 kWh</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Peak Power</p>
            <p className="text-2xl font-bold text-white">4.2 kW</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Efficiency</p>
            <p className="text-2xl font-bold text-lime-400">92.3%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Capacity Factor</p>
            <p className="text-2xl font-bold text-white">18.2%</p>
          </div>
        </div>
      </div>

      {/* Component Health */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Cpu size={20} className="text-lime-400" />
          Component Health
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
              <span className="text-sm text-white">Solar Inverter</span>
            </div>
            <span className="text-xs font-semibold text-lime-400">Excellent</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
              <span className="text-sm text-white">Battery Bank</span>
            </div>
            <span className="text-xs font-semibold text-lime-400">Good</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-sm text-white">Panel Cleanliness</span>
            </div>
            <span className="text-xs font-semibold text-amber-400">Fair</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
              <span className="text-sm text-white">Charge Controller</span>
            </div>
            <span className="text-xs font-semibold text-lime-400">Excellent</span>
          </div>
        </div>
      </div>

      {/* Maintenance Insights */}
      <div className="bg-[#1a1a1a] border-l-4 border-amber-500 rounded-lg p-4">
        <h3 className="font-semibold text-amber-400 mb-2 text-sm flex items-center gap-2">
          <HardDrive size={16} />
          Maintenance Recommendation
        </h3>
        <p className="text-xs text-gray-400 mb-2">
          Panel cleaning recommended within 2 weeks. Production has decreased by 8% compared to last month.
        </p>
        <button className="text-xs font-semibold text-amber-400 hover:text-amber-300">
          Schedule Maintenance →
        </button>
      </div>
    </div>
  );
}
