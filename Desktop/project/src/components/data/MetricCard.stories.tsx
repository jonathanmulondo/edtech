import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';
import { Sun, Home, Battery, Zap } from 'lucide-react';

const meta = {
  title: 'Data/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SolarProduction: Story = {
  args: {
    title: 'Solar Production',
    value: '1.52',
    unit: 'kW',
    icon: Sun,
    status: 'positive',
    subtitle: 'Current output',
  },
};

export const HomeConsumption: Story = {
  args: {
    title: 'Home Consumption',
    value: '900',
    unit: 'W',
    icon: Home,
    status: 'neutral',
    subtitle: 'Real-time usage',
  },
};

export const BatteryStatus: Story = {
  args: {
    title: 'Battery',
    value: 68,
    unit: '%',
    icon: Battery,
    status: 'positive',
    subtitle: 'Charging',
  },
};

export const GridExport: Story = {
  args: {
    title: 'Grid Export',
    value: '420',
    unit: 'W',
    icon: Zap,
    trend: {
      value: 15,
      label: 'vs yesterday',
    },
    status: 'positive',
  },
};

export const GridImport: Story = {
  args: {
    title: 'Grid Import',
    value: '1.2',
    unit: 'kW',
    icon: Zap,
    trend: {
      value: -8,
      label: 'vs yesterday',
    },
    status: 'negative',
  },
};

export const Warning: Story = {
  args: {
    title: 'Temperature',
    value: 34,
    unit: '°C',
    status: 'negative',
    subtitle: 'Above normal',
  },
};

export const Clickable: Story = {
  args: {
    title: 'Solar Production',
    value: '1.52',
    unit: 'kW',
    icon: Sun,
    onClick: () => alert('Card clicked!'),
  },
};
