import { useState } from 'react';
import { Sun, Home, Battery, Zap, AlertCircle } from 'lucide-react';
import { TimeSeriesChart } from '@components/data/TimeSeriesChart';
import { AIChatbot } from '@components/ui/AIChatbot';
import { formatPower, formatRelativeTime } from '@lib/utils/format';
import type { Site } from '@types';

// Mock data for demo
const mockSite: Site = {
  siteId: "site_123",
  name: "Mulondo Residence",
  timezone: "Africa/Nairobi",
  location: {
    lat: -1.2921,
    lon: 36.8219,
    address: "Nairobi, Kenya"
  },
  lastSync: new Date().toISOString(),
  current: {
    solarW: 1520,
    homeW: 900,
    battery: {
      soc: 68,
      powerW: -200,
      voltage: 51.2,
      current: 3.9,
      temperature: 28,
      timeToFull: 120,
      timeToEmpty: 340
    },
    gridW: -420
  },
  alarms: [
    {
      id: "alarm_1",
      level: "warn",
      text: "Battery temperature slightly elevated (28°C)",
      timestamp: new Date().toISOString(),
      acknowledged: false
    }
  ],
  devices: []
};

const mockTimeSeriesData = [
  { ts: Date.now() - 11 * 3600000, productionW: 0, consumptionW: 450, batteryW: 450, gridW: 0, soc: 68 },
  { ts: Date.now() - 10 * 3600000, productionW: 120, consumptionW: 480, batteryW: 360, gridW: 0, soc: 66 },
  { ts: Date.now() - 9 * 3600000, productionW: 580, consumptionW: 520, batteryW: -60, gridW: 0, soc: 67 },
  { ts: Date.now() - 8 * 3600000, productionW: 1200, consumptionW: 600, batteryW: -400, gridW: -200, soc: 70 },
  { ts: Date.now() - 7 * 3600000, productionW: 1680, consumptionW: 750, batteryW: -600, gridW: -330, soc: 75 },
  { ts: Date.now() - 6 * 3600000, productionW: 1520, consumptionW: 900, batteryW: -200, gridW: -420, soc: 78 },
  { ts: Date.now() - 5 * 3600000, productionW: 1340, consumptionW: 820, batteryW: -300, gridW: -220, soc: 80 },
  { ts: Date.now() - 4 * 3600000, productionW: 920, consumptionW: 780, batteryW: -140, gridW: 0, soc: 81 },
  { ts: Date.now() - 3 * 3600000, productionW: 320, consumptionW: 650, batteryW: 330, gridW: 0, soc: 79 },
  { ts: Date.now() - 2 * 3600000, productionW: 0, consumptionW: 720, batteryW: 720, gridW: 0, soc: 76 },
  { ts: Date.now() - 1 * 3600000, productionW: 0, consumptionW: 580, batteryW: 580, gridW: 0, soc: 73 },
  { ts: Date.now(), productionW: 0, consumptionW: 420, batteryW: 420, gridW: 0, soc: 71 }
];

/**
 * Main dashboard page - Premium iOS-style design
 * Full-screen gradient with floating white cards
 */
export function Dashboard() {
  const [selectedSite, setSelectedSite] = useState('site_123');

  // Using mock data for demo
  const site = mockSite;
  const { current, alarms } = site;
  const gridExporting = current.gridW < 0;
  const syncStatus = { status: 'synced' as const };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pb-24">
      {/* Hero Section */}
      <div className="pt-4 pb-4 px-6 mt-4">
        <h1 className="text-4xl font-light text-white leading-tight mb-2 tracking-tight">
          Welcome <span className="font-semibold text-lime-400">Jonathan</span>
        </h1>
        <p className="text-gray-400 text-sm mb-3">
          Last sync: {formatRelativeTime(site.lastSync)}
          <span
            className={`ml-2 inline-block w-2 h-2 rounded-full ${
              syncStatus.status === 'synced' ? 'bg-lime-400' : 'bg-gray-600'
            }`}
          />
        </p>

        {/* Property Selector Pill */}
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-full text-gray-300 font-medium text-sm hover:bg-[#242424] transition-all shadow-xl"
        >
          <span>{site.name}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* System Alert Card */}
      {alarms.length > 0 && (
        <div className="px-6 mb-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-xl border border-amber-900/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-400 mb-1">
                  System Alerts
                </h3>
                <ul className="space-y-0.5">
                  {alarms.map((alarm) => (
                    <li key={alarm.id} className="text-xs text-gray-400">
                      {alarm.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid - Individual Floating Cards */}
      <div className="px-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Solar Card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-xl border border-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <Sun className="text-white" size={22} />
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">
                {formatPower(current.solarW).split(' ')[0]}
              </div>
              <div className="text-xs font-semibold text-gray-400 mb-1">
                {formatPower(current.solarW).split(' ')[1]}
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                Solar Production
              </div>
            </div>
          </div>

          {/* Home Card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-xl border border-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <Home className="text-white" size={22} />
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">
                {formatPower(current.homeW).split(' ')[0]}
              </div>
              <div className="text-xs font-semibold text-gray-400 mb-1">
                {formatPower(current.homeW).split(' ')[1]}
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                Home Usage
              </div>
            </div>
          </div>

          {/* Grid Card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-xl border border-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${gridExporting ? 'from-lime-400 to-green-500' : 'from-gray-600 to-gray-700'} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                <Zap className="text-white" size={22} />
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">
                {formatPower(Math.abs(current.gridW)).split(' ')[0]}
              </div>
              <div className="text-xs font-semibold text-gray-400 mb-1">
                {formatPower(Math.abs(current.gridW)).split(' ')[1]}
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                {gridExporting ? 'Grid Export' : 'Grid Import'}
              </div>
            </div>
          </div>

          {/* Battery Card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-xl border border-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <Battery className="text-white" size={22} />
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">
                {current.battery.soc}
              </div>
              <div className="text-xs font-semibold text-gray-400 mb-1">
                %
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                {current.battery.powerW < 0 ? 'Charging' : 'Discharging'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="px-6 mb-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
          <h2 className="text-lg font-bold text-white mb-4">
            Last 24 Hours
          </h2>
          <TimeSeriesChart data={mockTimeSeriesData} height={180} />
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
