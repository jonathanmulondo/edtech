/**
 * Smart Automation & Scheduling Engine
 * Allows users to create time-based and condition-based automation rules
 */

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  type: 'time_based' | 'condition_based' | 'event_based';
  trigger: AutomationTrigger;
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  createdAt: string;
  lastExecuted?: string;
  executionCount: number;
}

export interface AutomationTrigger {
  type: 'time' | 'battery_level' | 'solar_production' | 'grid_price' | 'weather';
  value: any;
}

export interface AutomationCondition {
  parameter: 'battery_soc' | 'solar_w' | 'grid_price' | 'time_of_day';
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  value: number | [number, number];
}

export interface AutomationAction {
  type: 'force_charge' | 'force_discharge' | 'set_export_limit' | 'set_motor_angle' | 'send_notification';
  payload: Record<string, any>;
}

/**
 * Pre-built automation templates
 */
export const AUTOMATION_TEMPLATES: Omit<AutomationRule, 'id' | 'createdAt' | 'executionCount' | 'lastExecuted'>[] = [
  {
    name: 'Charge During Off-Peak Hours',
    enabled: true,
    type: 'time_based',
    trigger: {
      type: 'time',
      value: { hour: 2, minute: 0 }
    },
    conditions: [
      {
        parameter: 'battery_soc',
        operator: 'less_than',
        value: 80
      }
    ],
    actions: [
      {
        type: 'force_charge',
        payload: { targetSoC: 90, source: 'grid' }
      }
    ]
  },
  {
    name: 'Emergency Battery Preservation',
    enabled: true,
    type: 'condition_based',
    trigger: {
      type: 'battery_level',
      value: 20
    },
    actions: [
      {
        type: 'send_notification',
        payload: {
          title: 'Low Battery Alert',
          message: 'Battery at 20%. Consider reducing consumption or charging.'
        }
      }
    ]
  },
  {
    name: 'Maximize Solar Export',
    enabled: false,
    type: 'condition_based',
    trigger: {
      type: 'solar_production',
      value: 1500 // Watts
    },
    conditions: [
      {
        parameter: 'battery_soc',
        operator: 'greater_than',
        value: 80
      }
    ],
    actions: [
      {
        type: 'set_export_limit',
        payload: { limitW: 999999 } // No limit
      }
    ]
  },
  {
    name: 'Storm Protection',
    enabled: true,
    type: 'event_based',
    trigger: {
      type: 'weather',
      value: 'high_wind'
    },
    actions: [
      {
        type: 'set_motor_angle',
        payload: { angle: 0 } // Park panels
      },
      {
        type: 'send_notification',
        payload: {
          title: 'Weather Alert',
          message: 'High winds detected. Panels automatically parked for safety.'
        }
      }
    ]
  },
  {
    name: 'Smart Export Scheduling',
    enabled: false,
    type: 'time_based',
    trigger: {
      type: 'time',
      value: { hour: 11, minute: 0 } // Peak production hours
    },
    conditions: [
      {
        parameter: 'battery_soc',
        operator: 'greater_than',
        value: 70
      },
      {
        parameter: 'solar_w',
        operator: 'greater_than',
        value: 1000
      }
    ],
    actions: [
      {
        type: 'set_export_limit',
        payload: { limitW: 2000 }
      }
    ]
  }
];

/**
 * Evaluate if automation rule should execute
 */
export function shouldExecuteRule(
  rule: AutomationRule,
  currentState: {
    battery_soc: number;
    solar_w: number;
    grid_price?: number;
    weather?: string;
    time_of_day?: number;
  }
): boolean {
  if (!rule.enabled) return false;

  // Check conditions
  if (rule.conditions) {
    for (const condition of rule.conditions) {
      const value = currentState[condition.parameter];
      if (value === undefined) continue;

      switch (condition.operator) {
        case 'greater_than':
          if (!(value > (condition.value as number))) return false;
          break;
        case 'less_than':
          if (!(value < (condition.value as number))) return false;
          break;
        case 'equals':
          if (value !== condition.value) return false;
          break;
        case 'between':
          const [min, max] = condition.value as [number, number];
          if (!(value >= min && value <= max)) return false;
          break;
      }
    }
  }

  return true;
}

/**
 * Calculate potential savings from automation
 */
export function calculateAutomationSavings(rules: AutomationRule[]): number {
  // Simplified calculation - in production, use historical data
  let monthlySavings = 0;

  rules.forEach(rule => {
    if (!rule.enabled) return;

    if (rule.name.includes('Off-Peak')) {
      monthlySavings += 35; // $35/month from off-peak charging
    }
    if (rule.name.includes('Export')) {
      monthlySavings += 45; // $45/month from optimized export
    }
    if (rule.name.includes('Solar Export')) {
      monthlySavings += 60; // $60/month from maximizing export
    }
  });

  return monthlySavings;
}

/**
 * Execute automation action
 */
export async function executeAutomationAction(
  action: AutomationAction,
  siteId: string
): Promise<void> {
  console.log(`Executing automation action: ${action.type}`, action.payload);

  // In production, call actual API
  // await apiClient.performAction(siteId, { action: action.type, payload: action.payload });
}
