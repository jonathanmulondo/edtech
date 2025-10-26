/**
 * AI/ML Prediction Engine for Senergy
 * Provides intelligent forecasting and recommendations
 */

import type { TimeSeriesDataPoint, Site } from '@types';

export interface EnergyPrediction {
  timestamp: string;
  predictedProductionW: number;
  predictedConsumptionW: number;
  confidence: number; // 0-1
  weatherFactor: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy';
}

export interface AISuggestion {
  id: string;
  type: 'optimization' | 'warning' | 'tip' | 'action';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  potentialSavings?: number; // In currency
  estimatedImpact?: string;
  actionable: boolean;
  action?: {
    type: string;
    payload: Record<string, unknown>;
  };
  reasoning: string;
  timestamp: string;
}

export interface AnomalyDetection {
  detected: boolean;
  type?: 'production_drop' | 'consumption_spike' | 'battery_drain' | 'system_fault';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  expectedValue: number;
  actualValue: number;
  deviation: number; // Percentage
  possibleCauses: string[];
}

/**
 * Predict solar production for next 24 hours
 * Uses historical patterns + weather data
 */
export function predictSolarProduction(
  historicalData: TimeSeriesDataPoint[],
  weatherForecast?: any
): EnergyPrediction[] {
  // Simple ML model using moving average + seasonal patterns
  // In production, this would call a real ML service

  const predictions: EnergyPrediction[] = [];
  const now = new Date();

  // Calculate average production for each hour
  const hourlyAverages = calculateHourlyAverages(historicalData);

  for (let i = 0; i < 24; i++) {
    const forecastTime = new Date(now.getTime() + i * 3600000);
    const hour = forecastTime.getHours();

    // Base prediction on historical average
    let predictedW = hourlyAverages[hour] || 0;

    // Apply weather adjustments (if available)
    const weatherFactor = getWeatherFactor(forecastTime, weatherForecast);
    predictedW *= getWeatherMultiplier(weatherFactor);

    // Calculate confidence based on historical variance
    const confidence = calculateConfidence(hour, historicalData);

    predictions.push({
      timestamp: forecastTime.toISOString(),
      predictedProductionW: Math.round(predictedW),
      predictedConsumptionW: predictConsumption(hour, historicalData),
      confidence,
      weatherFactor,
    });
  }

  return predictions;
}

/**
 * Generate AI-powered suggestions for energy optimization
 */
export function generateAISuggestions(
  site: Site,
  historicalData: TimeSeriesDataPoint[],
  predictions: EnergyPrediction[]
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const now = new Date();

  // 1. Optimal charging time suggestion
  const cheapGridHours = identifyLowTariffHours();
  const currentSoC = site.current.battery.soc;

  if (currentSoC < 50 && cheapGridHours.length > 0) {
    suggestions.push({
      id: 'charge_during_offpeak',
      type: 'optimization',
      priority: 'medium',
      title: 'Charge Battery During Off-Peak Hours',
      description: `Electricity rates are lowest between ${cheapGridHours[0]}:00-${cheapGridHours[1]}:00. Charging now could save you money.`,
      potentialSavings: 45,
      estimatedImpact: 'Save ~$1.50 per charge cycle',
      actionable: true,
      action: {
        type: 'schedule_charge',
        payload: { startHour: cheapGridHours[0], targetSoC: 90 }
      },
      reasoning: 'Based on your utility tariff schedule and current battery level',
      timestamp: now.toISOString(),
    });
  }

  // 2. High production period - run heavy appliances
  const peakSolarHour = findPeakSolarHour(predictions);
  if (peakSolarHour && peakSolarHour.predictedProductionW > 1500) {
    suggestions.push({
      id: 'run_appliances_peak',
      type: 'tip',
      priority: 'low',
      title: 'Perfect Time for Energy-Intensive Tasks',
      description: `Peak solar production expected at ${new Date(peakSolarHour.timestamp).getHours()}:00. Great time to run washing machine, dishwasher, or water heater.`,
      potentialSavings: 25,
      estimatedImpact: 'Use free solar energy instead of grid/battery',
      actionable: false,
      reasoning: 'Predicted solar production of ${peakSolarHour.predictedProductionW}W exceeds typical consumption',
      timestamp: now.toISOString(),
    });
  }

  // 3. Upcoming cloudy period - prepare battery
  const cloudyPeriod = findCloudyPeriod(predictions);
  if (cloudyPeriod && currentSoC < 70) {
    suggestions.push({
      id: 'prep_for_clouds',
      type: 'warning',
      priority: 'medium',
      title: 'Cloudy Weather Ahead',
      description: 'Weather forecast shows reduced sunlight for the next 6 hours. Consider charging battery to 80% now.',
      actionable: true,
      action: {
        type: 'force_charge',
        payload: { targetSoC: 80, source: 'grid' }
      },
      reasoning: 'Weather API indicates cloud cover > 70% for next 6 hours',
      timestamp: now.toISOString(),
    });
  }

  // 4. Export optimization
  const surplusEnergy = calculateSurplus(site, predictions);
  if (surplusEnergy > 500 && site.current.battery.soc > 80) {
    suggestions.push({
      id: 'optimize_export',
      type: 'optimization',
      priority: 'medium',
      title: 'Maximize Grid Export Revenue',
      description: `You have ${Math.round(surplusEnergy)}W of excess solar. Battery is full. Consider increasing grid export limit to earn more.`,
      potentialSavings: 80,
      estimatedImpact: 'Earn ~$2.50 per day from excess energy',
      actionable: true,
      action: {
        type: 'set_export_limit',
        payload: { limitW: surplusEnergy }
      },
      reasoning: 'Battery at ${site.current.battery.soc}%, surplus production available',
      timestamp: now.toISOString(),
    });
  }

  // 5. Consumption pattern insight
  const consumptionPattern = analyzeConsumptionPattern(historicalData);
  if (consumptionPattern.peakHour && consumptionPattern.shiftPotential > 0) {
    suggestions.push({
      id: 'shift_consumption',
      type: 'tip',
      priority: 'low',
      title: 'Shift Peak Usage to Solar Hours',
      description: `You typically use most energy at ${consumptionPattern.peakHour}:00. Shifting some usage to 11:00-14:00 could reduce grid dependence by 30%.`,
      potentialSavings: 120,
      estimatedImpact: 'Save ~$4/day by better aligning usage with solar production',
      actionable: false,
      reasoning: 'ML analysis of 30-day consumption patterns',
      timestamp: now.toISOString(),
    });
  }

  return suggestions;
}

/**
 * Detect anomalies in system performance
 */
export function detectAnomalies(
  site: Site,
  historicalData: TimeSeriesDataPoint[]
): AnomalyDetection {
  const currentProduction = site.current.solarW;
  const hour = new Date().getHours();

  // Calculate expected production for this hour
  const expectedProduction = calculateExpectedProduction(hour, historicalData);
  const deviation = ((currentProduction - expectedProduction) / expectedProduction) * 100;

  // Significant underperformance detected
  if (deviation < -30 && hour >= 9 && hour <= 16) {
    return {
      detected: true,
      type: 'production_drop',
      severity: 'warning',
      message: `Solar production is ${Math.abs(deviation).toFixed(0)}% below expected for this time of day`,
      expectedValue: expectedProduction,
      actualValue: currentProduction,
      deviation: Math.abs(deviation),
      possibleCauses: [
        'Panels may need cleaning (dust/dirt accumulation)',
        'Shading from nearby objects',
        'Cloudy weather (check forecast)',
        'Panel or inverter malfunction',
        'Unusual weather patterns'
      ]
    };
  }

  // Battery draining too fast
  const batteryDrainRate = calculateBatteryDrainRate(historicalData);
  if (batteryDrainRate > 15 && site.current.battery.soc < 30) {
    return {
      detected: true,
      type: 'battery_drain',
      severity: 'critical',
      message: `Battery draining ${batteryDrainRate.toFixed(1)}% per hour - faster than normal`,
      expectedValue: 8,
      actualValue: batteryDrainRate,
      deviation: ((batteryDrainRate - 8) / 8) * 100,
      possibleCauses: [
        'Unusually high consumption',
        'Battery degradation (reduced capacity)',
        'Large appliances running',
        'Power leak or fault',
        'Inverter inefficiency'
      ]
    };
  }

  // Consumption spike
  const avgConsumption = calculateAverageConsumption(historicalData, hour);
  const consumptionDeviation = ((site.current.homeW - avgConsumption) / avgConsumption) * 100;

  if (consumptionDeviation > 50) {
    return {
      detected: true,
      type: 'consumption_spike',
      severity: 'warning',
      message: `Home consumption is ${consumptionDeviation.toFixed(0)}% higher than usual for this time`,
      expectedValue: avgConsumption,
      actualValue: site.current.homeW,
      deviation: consumptionDeviation,
      possibleCauses: [
        'Large appliance running (water heater, AC, etc.)',
        'Appliance left on unintentionally',
        'New device added to system',
        'Seasonal variation (heating/cooling)',
        'Possible electrical fault'
      ]
    };
  }

  return {
    detected: false,
    severity: 'info',
    message: 'System operating normally',
    expectedValue: 0,
    actualValue: 0,
    deviation: 0,
    possibleCauses: []
  };
}

/**
 * Machine learning model to predict battery state of charge
 */
export function predictBatteryRuntime(
  currentSoC: number,
  currentConsumptionW: number,
  batteryCapacityWh: number = 10000
): {
  hoursRemaining: number;
  estimatedDepletionTime: string;
  confidence: number;
} {
  // Account for battery efficiency and inverter losses
  const efficiency = 0.9;
  const usableCapacity = batteryCapacityWh * efficiency;
  const currentCapacityWh = (currentSoC / 100) * usableCapacity;

  // Predict consumption trend (may increase/decrease)
  const consumptionTrend = predictConsumptionTrend();
  const avgConsumption = currentConsumptionW * consumptionTrend;

  // Calculate runtime
  const hoursRemaining = avgConsumption > 0 ? currentCapacityWh / avgConsumption : 999;

  const depletionTime = new Date();
  depletionTime.setHours(depletionTime.getHours() + hoursRemaining);

  return {
    hoursRemaining: Math.min(hoursRemaining, 999),
    estimatedDepletionTime: hoursRemaining < 999 ? depletionTime.toISOString() : 'N/A',
    confidence: 0.85
  };
}

// Helper functions

function calculateHourlyAverages(data: TimeSeriesDataPoint[]): number[] {
  const hourlyData: number[][] = Array.from({ length: 24 }, () => []);

  data.forEach(point => {
    const hour = new Date(point.ts).getHours();
    hourlyData[hour].push(point.productionW);
  });

  return hourlyData.map(hourData => {
    if (hourData.length === 0) return 0;
    return hourData.reduce((sum, val) => sum + val, 0) / hourData.length;
  });
}

function calculateExpectedProduction(hour: number, data: TimeSeriesDataPoint[]): number {
  const hourlyAverages = calculateHourlyAverages(data);
  return hourlyAverages[hour] || 0;
}

function calculateConfidence(hour: number, data: TimeSeriesDataPoint[]): number {
  // Higher confidence during mid-day, lower at dawn/dusk
  if (hour >= 10 && hour <= 14) return 0.9;
  if (hour >= 8 && hour <= 16) return 0.75;
  if (hour >= 6 && hour <= 18) return 0.6;
  return 0.3;
}

function getWeatherFactor(time: Date, forecast?: any): 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' {
  // In production, parse actual weather API data
  // For now, return sunny during day hours
  const hour = time.getHours();
  if (hour >= 6 && hour <= 18) return 'sunny';
  return 'cloudy';
}

function getWeatherMultiplier(factor: string): number {
  const multipliers = {
    sunny: 1.0,
    partly_cloudy: 0.7,
    cloudy: 0.4,
    rainy: 0.2
  };
  return multipliers[factor as keyof typeof multipliers] || 0.5;
}

function predictConsumption(hour: number, data: TimeSeriesDataPoint[]): number {
  // Similar to production, calculate average consumption per hour
  const hourlyData: number[] = [];

  data.forEach(point => {
    if (new Date(point.ts).getHours() === hour) {
      hourlyData.push(point.consumptionW);
    }
  });

  if (hourlyData.length === 0) return 500; // Default
  return Math.round(hourlyData.reduce((sum, val) => sum + val, 0) / hourlyData.length);
}

function identifyLowTariffHours(): number[] {
  // In production, fetch from user's tariff settings
  // Typical off-peak hours: 10 PM - 6 AM
  return [22, 6]; // Start and end hours
}

function findPeakSolarHour(predictions: EnergyPrediction[]): EnergyPrediction | null {
  if (predictions.length === 0) return null;
  return predictions.reduce((max, p) =>
    p.predictedProductionW > max.predictedProductionW ? p : max
  );
}

function findCloudyPeriod(predictions: EnergyPrediction[]): EnergyPrediction | null {
  return predictions.find(p => p.weatherFactor === 'cloudy' || p.weatherFactor === 'rainy') || null;
}

function calculateSurplus(site: Site, predictions: EnergyPrediction[]): number {
  const avgProduction = predictions.slice(0, 3).reduce((sum, p) => sum + p.predictedProductionW, 0) / 3;
  const avgConsumption = predictions.slice(0, 3).reduce((sum, p) => sum + p.predictedConsumptionW, 0) / 3;
  return Math.max(0, avgProduction - avgConsumption);
}

function analyzeConsumptionPattern(data: TimeSeriesDataPoint[]): {
  peakHour: number;
  shiftPotential: number;
} {
  const hourlyConsumption = Array.from({ length: 24 }, () => ({ total: 0, count: 0 }));

  data.forEach(point => {
    const hour = new Date(point.ts).getHours();
    hourlyConsumption[hour].total += point.consumptionW;
    hourlyConsumption[hour].count += 1;
  });

  const averages = hourlyConsumption.map(h => h.count > 0 ? h.total / h.count : 0);
  const peakHour = averages.indexOf(Math.max(...averages));

  // Calculate shift potential (simplified)
  const shiftPotential = peakHour < 9 || peakHour > 16 ? averages[peakHour] * 0.3 : 0;

  return { peakHour, shiftPotential };
}

function calculateBatteryDrainRate(data: TimeSeriesDataPoint[]): number {
  // Look at last hour of data
  const recentData = data.slice(-6); // Last 6 data points
  if (recentData.length < 2) return 0;

  const socChange = (recentData[0].soc || 100) - (recentData[recentData.length - 1].soc || 100);
  const hours = (recentData[recentData.length - 1].ts - recentData[0].ts) / 3600000;

  return hours > 0 ? socChange / hours : 0;
}

function calculateAverageConsumption(data: TimeSeriesDataPoint[], hour: number): number {
  const hourData = data.filter(p => new Date(p.ts).getHours() === hour);
  if (hourData.length === 0) return 500;

  return hourData.reduce((sum, p) => sum + p.consumptionW, 0) / hourData.length;
}

function predictConsumptionTrend(): number {
  // In production, use ML to predict if consumption is increasing/decreasing
  // For now, return neutral (1.0)
  return 1.0;
}
