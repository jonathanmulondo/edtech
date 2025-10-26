import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, User, Key, Shield, LogOut } from 'lucide-react';
import { Toggle } from '@components/ui/Toggle';
import { Select } from '@components/ui/Select';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { useAuth } from '@lib/auth/AuthContext';
import { useToastStore } from '@lib/hooks/useToast';

/**
 * Settings & User Preferences Page
 * Pure Dark Theme
 */
export function SettingsPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  const [settings, setSettings] = useState({
    language: 'en',
    currency: 'KES',
    notifications: {
      push: true,
      email: true,
      sms: false,
      lowBattery: true,
      systemAlerts: true,
      weatherWarnings: true,
      dailySummary: false
    },
    tariff: {
      peakRate: 0.22,
      offPeakRate: 0.12,
      exportRate: 0.08
    }
  });

  const handleLogout = () => {
    logout();
    addToast({
      type: 'success',
      message: 'Successfully logged out',
    });
    navigate('/login');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedSetting = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [key]: value
      }
    }));
  };

  return (
    <div className="safe-container py-4 space-y-4 bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-3xl font-light text-white mb-1 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-400">
          Customize your Senergy experience
        </p>
      </div>

      {/* Account Section */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="text-lime-400" />
          <h2 className="text-base font-bold text-white">
            Account
          </h2>
        </div>
        <div className="space-y-4">
          <Input
            label="Full Name"
            defaultValue="Jonathan Mulondo"
          />
          <Input
            label="Email"
            type="email"
            defaultValue="jonathan@example.com"
          />
          <Input
            label="Phone Number"
            type="tel"
            defaultValue="+254 712 345 678"
          />
          <button className="w-full py-3 bg-gradient-to-r from-lime-400 to-green-400 hover:from-lime-500 hover:to-green-500 text-black font-semibold rounded-xl transition-all">
            Save Changes
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-lime-400" />
          <h2 className="text-base font-bold text-white">
            Preferences
          </h2>
        </div>
        <div className="space-y-4">
          <Select
            label="Language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'sw', label: 'Swahili' }
            ]}
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
          />
          <Select
            label="Currency"
            options={[
              { value: 'KES', label: 'KES (Kenyan Shilling)' },
              { value: 'USD', label: 'USD (US Dollar)' },
              { value: 'EUR', label: 'EUR (Euro)' }
            ]}
            value={settings.currency}
            onChange={(e) => updateSetting('currency', e.target.value)}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={20} className="text-lime-400" />
          <h2 className="text-base font-bold text-white">
            Notifications
          </h2>
        </div>
        <div className="space-y-4">
          <Toggle
            label="Push Notifications"
            description="Receive notifications in your browser"
            checked={settings.notifications.push}
            onChange={(e) => updateNestedSetting('notifications', 'push', e.target.checked)}
          />
          <Toggle
            label="Email Notifications"
            description="Receive notifications via email"
            checked={settings.notifications.email}
            onChange={(e) => updateNestedSetting('notifications', 'email', e.target.checked)}
          />
          <Toggle
            label="SMS Alerts"
            description="Critical alerts via text message"
            checked={settings.notifications.sms}
            onChange={(e) => updateNestedSetting('notifications', 'sms', e.target.checked)}
          />

          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="font-medium text-white mb-3">Alert Types</h3>
            <div className="space-y-3">
              <Toggle
                label="Low Battery Warnings"
                checked={settings.notifications.lowBattery}
                onChange={(e) => updateNestedSetting('notifications', 'lowBattery', e.target.checked)}
              />
              <Toggle
                label="System Alerts"
                checked={settings.notifications.systemAlerts}
                onChange={(e) => updateNestedSetting('notifications', 'systemAlerts', e.target.checked)}
              />
              <Toggle
                label="Weather Warnings"
                checked={settings.notifications.weatherWarnings}
                onChange={(e) => updateNestedSetting('notifications', 'weatherWarnings', e.target.checked)}
              />
              <Toggle
                label="Daily Summary"
                checked={settings.notifications.dailySummary}
                onChange={(e) => updateNestedSetting('notifications', 'dailySummary', e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tariff Settings */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">
          Electricity Tariff
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Configure your electricity rates for accurate savings calculations
        </p>
        <div className="space-y-4">
          <Input
            label="Peak Rate ($/kWh)"
            type="number"
            step="0.01"
            value={settings.tariff.peakRate}
            onChange={(e) => updateNestedSetting('tariff', 'peakRate', parseFloat(e.target.value))}
          />
          <Input
            label="Off-Peak Rate ($/kWh)"
            type="number"
            step="0.01"
            value={settings.tariff.offPeakRate}
            onChange={(e) => updateNestedSetting('tariff', 'offPeakRate', parseFloat(e.target.value))}
          />
          <Input
            label="Export Rate ($/kWh)"
            type="number"
            step="0.01"
            value={settings.tariff.exportRate}
            onChange={(e) => updateNestedSetting('tariff', 'exportRate', parseFloat(e.target.value))}
            helperText="Rate you receive for exporting power to grid"
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-xl border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={20} className="text-lime-400" />
          <h2 className="text-base font-bold text-white">
            Security
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-xl text-gray-300 hover:bg-gray-800/50 transition-all">
              <Key size={16} />
              Change Password
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-xl text-gray-300 hover:bg-gray-800/50 transition-all">
              Generate API Token
            </button>
            <p className="text-xs text-gray-500 mt-1">
              For third-party integrations
            </p>
          </div>
          <div className="pt-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] border border-red-900/50 rounded-xl text-red-400 hover:bg-red-900/20 transition-all"
            >
              <LogOut size={16} />
              Log Out
            </button>
            {user && (
              <p className="text-xs text-gray-500 mt-1">
                Logged in as {user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 bg-[#0f0f0f] border border-gray-800 rounded-xl text-gray-300 hover:bg-gray-800/50 transition-all">
          Cancel
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-lime-400 to-green-400 hover:from-lime-500 hover:to-green-500 text-black font-semibold rounded-xl transition-all">
          Save All Settings
        </button>
      </div>
    </div>
  );
}
