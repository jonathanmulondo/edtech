/**
 * Weather Integration Service
 * Provides weather data for solar predictions and automation
 */

export interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'stormy';
    cloudCover: number; // 0-100%
    windSpeed: number; // km/h
    humidity: number; // 0-100%
    uvIndex: number;
  };
  forecast: WeatherForecast[];
  sunrise: string;
  sunset: string;
  solarIrradiance: number; // W/m²
}

export interface WeatherForecast {
  timestamp: string;
  temp: number;
  condition: string;
  cloudCover: number;
  precipitation: number; // mm
  windSpeed: number;
  solarPotential: number; // 0-100% of max capacity
}

/**
 * Fetch weather data (mock implementation)
 * In production, integrate with OpenWeatherMap, WeatherAPI, or similar
 */
export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  // Mock data - replace with actual API call
  return {
    location: 'Nairobi, Kenya',
    current: {
      temp: 24,
      condition: 'partly_cloudy',
      cloudCover: 35,
      windSpeed: 12,
      humidity: 65,
      uvIndex: 7
    },
    forecast: generateMockForecast(),
    sunrise: '06:30',
    sunset: '18:45',
    solarIrradiance: 850
  };
}

function generateMockForecast(): WeatherForecast[] {
  const forecast: WeatherForecast[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 3600000);
    const hour = time.getHours();
    const isDaytime = hour >= 6 && hour <= 18;

    forecast.push({
      timestamp: time.toISOString(),
      temp: 20 + Math.random() * 8,
      condition: isDaytime ? (Math.random() > 0.7 ? 'cloudy' : 'sunny') : 'clear',
      cloudCover: Math.random() * 60,
      precipitation: Math.random() < 0.2 ? Math.random() * 5 : 0,
      windSpeed: 10 + Math.random() * 15,
      solarPotential: isDaytime ? 60 + Math.random() * 40 : 0
    });
  }

  return forecast;
}

/**
 * Calculate solar production impact from weather
 */
export function calculateWeatherImpact(cloudCover: number, precipitation: number): number {
  let multiplier = 1.0;

  // Cloud cover impact
  if (cloudCover > 80) multiplier *= 0.2; // Heavy clouds
  else if (cloudCover > 60) multiplier *= 0.4;
  else if (cloudCover > 40) multiplier *= 0.7;
  else if (cloudCover > 20) multiplier *= 0.9;

  // Rain impact
  if (precipitation > 5) multiplier *= 0.3;
  else if (precipitation > 2) multiplier *= 0.5;

  return multiplier;
}

/**
 * Check if weather conditions warrant alerts
 */
export function checkWeatherAlerts(weather: WeatherData): string[] {
  const alerts: string[] = [];

  if (weather.current.windSpeed > 50) {
    alerts.push('⚠️ High wind warning - Consider parking solar panels');
  }

  if (weather.current.condition === 'stormy') {
    alerts.push('🌩️ Storm detected - Automatic panel protection activated');
  }

  const upcomingRain = weather.forecast.slice(0, 6).some(f => f.precipitation > 2);
  if (upcomingRain && weather.current.cloudCover > 60) {
    alerts.push('🌧️ Heavy rain expected - Reduced solar production likely');
  }

  return alerts;
}
