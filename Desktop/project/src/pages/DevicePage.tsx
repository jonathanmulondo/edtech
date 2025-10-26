import { useState } from 'react';
import { Settings, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import { KPIRow } from '@components/data/MetricCard';
import { Slider } from '@components/controls/Slider';
import { Button } from '@components/ui/Button';
import { Toggle } from '@components/ui/Toggle';
import { formatRelativeTime } from '@lib/utils/format';
import type { Device, MotorControlState } from '@types';

/**
 * Device details page
 * Shows telemetry, motor control, logs, and diagnostics
 */
export function DevicePage() {
  const [motorAngle, setMotorAngle] = useState(45);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isMoving, setIsMoving] = useState(false);

  // Mock device data
  const device: Device = {
    deviceId: 'dev_001',
    type: 'solar-tracker',
    name: 'Solar Tracker #1',
    status: 'online',
    firmwareVersion: '2.1.4',
    lastSeen: new Date().toISOString(),
    capabilities: {
      motorControl: true,
      remoteControl: true,
      dataLogging: true,
    },
  };

  const motorState: MotorControlState = {
    currentAngle: 45,
    targetAngle: 45,
    isMoving: false,
    limits: { min: 0, max: 90 },
    presets: [
      { id: 'park', name: 'Park', angle: 0 },
      { id: 'optimal', name: 'Optimal', angle: 35 },
      { id: 'max', name: 'Max Tilt', angle: 90 },
    ],
  };

  const handleSetAngle = async (angle: number) => {
    setIsMoving(true);
    // Simulate API call
    setTimeout(() => {
      setIsMoving(false);
    }, 2000);
  };

  const handlePreset = (angle: number) => {
    setMotorAngle(angle);
    handleSetAngle(angle);
  };

  return (
    <div className="safe-container py-4 md:py-6 space-y-6 bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-text">
            {device.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Last seen: {formatRelativeTime(device.lastSeen)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              device.status === 'online'
                ? 'bg-success-light text-success-dark'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {device.status}
          </span>
        </div>
      </div>

      {/* Live Telemetry Card */}
      <div className="bg-white dark:bg-dark-surface rounded-lg p-4 md:p-6 border border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Live Telemetry
          </h2>
          <div className="flex items-center gap-3">
            <Toggle
              label="Auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <Button variant="ghost" size="sm">
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <KPIRow label="Panel Voltage" value={48.2} unit="V" status="online" />
          <KPIRow label="Panel Current" value={12.5} unit="A" status="online" />
          <KPIRow label="Power Output" value={602} unit="W" status="online" />
          <KPIRow label="Motor Angle" value={motorAngle} unit="°" />
          <KPIRow label="Temperature" value={34} unit="°C" />
        </div>

        {isMoving && (
          <div className="mt-4 flex items-center gap-2 text-sm text-warning">
            <RefreshCw size={16} className="animate-spin" />
            Motor moving to {motorAngle}°...
          </div>
        )}
      </div>

      {/* Motor Control */}
      {device.capabilities?.motorControl && (
        <div className="bg-white dark:bg-dark-surface rounded-lg p-4 md:p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
            Motor Control
          </h2>

          {/* Presets */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Presets
            </p>
            <div className="grid grid-cols-3 gap-2">
              {motorState.presets.map((preset) => (
                <Button
                  key={preset.id}
                  variant="ghost"
                  onClick={() => handlePreset(preset.angle)}
                  disabled={isMoving}
                >
                  {preset.name}
                  <span className="ml-1 text-xs text-gray-500">({preset.angle}°)</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Angle Slider */}
          <Slider
            label="Panel Angle"
            min={motorState.limits.min}
            max={motorState.limits.max}
            value={motorAngle}
            onChange={setMotorAngle}
            unit="°"
            disabled={isMoving}
          />

          <Button
            variant="primary"
            onClick={() => handleSetAngle(motorAngle)}
            isLoading={isMoving}
            className="mt-4 w-full md:w-auto"
          >
            Apply Angle
          </Button>
        </div>
      )}

      {/* Device Info */}
      <div className="bg-white dark:bg-dark-surface rounded-lg p-4 md:p-6 border border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
          Device Information
        </h2>
        <div className="space-y-1">
          <KPIRow label="Device ID" value={device.deviceId} />
          <KPIRow label="Type" value={device.type} />
          <KPIRow label="Firmware Version" value={device.firmwareVersion} />
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" size="sm">
            <Download size={16} className="mr-2" />
            Update Firmware
          </Button>
          <Button variant="ghost" size="sm">
            <Settings size={16} className="mr-2" />
            Advanced Settings
          </Button>
        </div>
      </div>

      {/* Diagnostics */}
      <div className="bg-white dark:bg-dark-surface rounded-lg p-4 md:p-6 border border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
          Diagnostics & Logs
        </h2>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
          <p className="text-gray-600 dark:text-gray-400">
            [2025-10-25 12:34:56] INFO: System startup complete
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            [2025-10-25 12:35:12] INFO: Motor initialized at 45°
          </p>
          <p className="text-warning">
            [2025-10-25 12:36:03] WARN: Temperature above 32°C
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            [2025-10-25 12:40:21] INFO: Cloud sync successful
          </p>
        </div>
      </div>
    </div>
  );
}
