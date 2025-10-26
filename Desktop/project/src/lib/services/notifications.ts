/**
 * Advanced Notifications & Alerts System
 * Supports push notifications, email, SMS, and WhatsApp
 */

export interface Notification {
  id: string;
  type: 'push' | 'email' | 'sms' | 'whatsapp';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  category: 'system' | 'battery' | 'production' | 'financial' | 'weather' | 'automation';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationPreferences {
  push: {
    enabled: boolean;
    lowBattery: boolean;
    systemAlerts: boolean;
    weatherWarnings: boolean;
    automationResults: boolean;
    dailySummary: boolean;
  };
  email: {
    enabled: boolean;
    weeklyReport: boolean;
    monthlyBilling: boolean;
    criticalAlertsOnly: boolean;
  };
  sms: {
    enabled: boolean;
    criticalOnly: boolean;
  };
  whatsapp: {
    enabled: boolean;
    dailyUpdates: boolean;
  };
}

/**
 * Send notification
 */
export async function sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
  console.log('Sending notification:', notification);

  // In production, integrate with:
  // - Web Push API for browser notifications
  // - Firebase Cloud Messaging
  // - Twilio for SMS
  // - WhatsApp Business API
  // - SendGrid/Mailgun for email

  // Show browser notification if supported
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/icon-192.png',
      badge: '/icon-badge.png',
      tag: notification.category,
    });
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Generate smart notification based on system state
 */
export function generateSmartAlert(
  type: 'low_battery' | 'high_production' | 'system_fault' | 'cost_savings',
  context: any
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  const templates = {
    low_battery: {
      type: 'push' as const,
      priority: 'high' as const,
      title: '🔋 Low Battery Alert',
      message: `Battery at ${context.soc}%. ${context.timeRemaining < 2 ? 'Charging recommended.' : `Approximately ${context.timeRemaining.toFixed(1)} hours remaining.`}`,
      category: 'battery' as const,
      actionUrl: '/dashboard',
      actionLabel: 'View Dashboard'
    },
    high_production: {
      type: 'push' as const,
      priority: 'low' as const,
      title: '☀️ Peak Solar Production',
      message: `Generating ${context.productionW}W! Great time to run energy-intensive appliances.`,
      category: 'production' as const,
    },
    system_fault: {
      type: 'push' as const,
      priority: 'critical' as const,
      title: '⚠️ System Alert',
      message: `${context.faultType}: ${context.description}. Immediate attention required.`,
      category: 'system' as const,
      actionUrl: '/device',
      actionLabel: 'View Diagnostics'
    },
    cost_savings: {
      type: 'email' as const,
      priority: 'low' as const,
      title: '💰 Monthly Savings Report',
      message: `You saved $${context.savings} this month! View full report for details.`,
      category: 'financial' as const,
      actionUrl: '/financial',
      actionLabel: 'View Report'
    }
  };

  return templates[type];
}
