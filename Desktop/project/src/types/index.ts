// Core data types for Senergy platform

export interface Site {
  siteId: string;
  name: string;
  timezone: string;
  location?: {
    lat: number;
    lon: number;
    address: string;
  };
  lastSync: string; // ISO timestamp
  current: SiteCurrentState;
  alarms: Alarm[];
  devices: Device[];
}

export interface SiteCurrentState {
  solarW: number;
  homeW: number;
  battery: BatteryState;
  gridW: number; // Negative = export, positive = import
}

export interface BatteryState {
  soc: number; // State of charge (0-100%)
  powerW: number; // Negative = charging, positive = discharging
  voltage: number;
  current?: number;
  temperature?: number;
  timeToEmpty?: number; // Minutes
  timeToFull?: number; // Minutes
}

export interface Alarm {
  id: string;
  level: 'info' | 'warn' | 'error' | 'critical';
  text: string;
  timestamp: string;
  acknowledged?: boolean;
}

export interface Device {
  deviceId: string;
  type: 'inverter' | 'battery' | 'solar-tracker' | 'gateway';
  name: string;
  status: 'online' | 'offline' | 'error' | 'updating';
  firmwareVersion: string;
  lastSeen: string;
  capabilities?: DeviceCapabilities;
}

export interface DeviceCapabilities {
  motorControl?: boolean;
  remoteControl?: boolean;
  dataLogging?: boolean;
}

export interface TimeSeriesDataPoint {
  ts: number; // Unix timestamp (ms)
  productionW: number;
  consumptionW: number;
  batteryW: number;
  gridW: number;
  soc?: number;
}

export interface EnergyInsights {
  period: 'day' | 'week' | 'month' | 'year';
  totalProduction: number; // kWh
  totalConsumption: number; // kWh
  totalExport: number; // kWh
  totalImport: number; // kWh
  selfConsumption: number; // Percentage
  co2Saved: number; // kg
  cost: {
    saved: number;
    earned: number;
    currency: string;
  };
}

export interface MotorControlState {
  currentAngle: number;
  targetAngle: number;
  isMoving: boolean;
  limits: {
    min: number;
    max: number;
  };
  presets: MotorPreset[];
}

export interface MotorPreset {
  id: string;
  name: string;
  angle: number;
}

export interface ControlAction {
  action: 'set_motor_angle' | 'force_charge' | 'force_discharge' | 'set_export_limit';
  payload: Record<string, unknown>;
  timestamp?: string;
  queuedOffline?: boolean;
}

export interface User {
  userId: string;
  email: string;
  name: string;
  role: 'homeowner' | 'technician' | 'admin';
  sites: string[]; // Site IDs user has access to
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'sw';
  theme: 'light' | 'dark' | 'auto';
  units: 'metric' | 'imperial';
  notifications: {
    email: boolean;
    push: boolean;
    lowBattery: boolean;
    systemAlerts: boolean;
  };
}

export interface SyncStatus {
  status: 'synced' | 'syncing' | 'offline' | 'stale';
  lastSyncTime?: string;
  pendingActions?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
  };
}
