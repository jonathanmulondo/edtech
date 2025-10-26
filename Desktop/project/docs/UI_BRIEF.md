# Senergy Platform - Product UI Brief

**Version:** 1.0
**Date:** October 2025
**Target:** Stakeholders, Product Team, Engineering, Design

---

## Executive Summary

Senergy is an intelligent solar energy management platform designed for residential homeowners and small community operators in East Africa. The platform provides real-time monitoring, remote control, and energy insights for rooftop solar systems with battery storage.

**Core Value Proposition:**
- Maximize solar self-consumption through intelligent battery management
- Reduce electricity costs via optimized grid import/export
- Enable remote monitoring and control from anywhere
- Provide actionable energy insights and recommendations

---

## Target Users

### 1. Residential Homeowner
- **Technical Level:** Varied (must be simple and intuitive)
- **Primary Goals:**
  - Monitor system performance
  - Track energy savings
  - Receive alerts for issues
  - Basic control (charge/discharge)
- **Key Pain Points:**
  - Lack of visibility into solar production
  - Uncertainty about battery health
  - Grid export not optimized

### 2. Field Technician / Installer
- **Technical Level:** High
- **Primary Goals:**
  - Diagnose system issues remotely
  - Access detailed telemetry
  - Perform firmware updates
  - View system logs
- **Key Pain Points:**
  - Requires on-site visits for diagnostics
  - Limited visibility into device health
  - Firmware updates are manual

### 3. Pilot Manager / Energy Operator
- **Technical Level:** Medium-High
- **Primary Goals:**
  - Monitor multiple sites
  - Identify trends and issues
  - Generate reports
  - Bulk operations
- **Key Pain Points:**
  - No aggregated view of fleet
  - Manual data collection
  - Difficult to spot patterns

---

## Product Features

### Dashboard (Home)
**Purpose:** At-a-glance system overview

**Key Metrics:**
- Current solar production (W/kW)
- Home consumption (W/kW)
- Battery state of charge (%, time remaining)
- Grid import/export status (W/kW)

**Interactions:**
- Site selector dropdown
- 24-hour production vs consumption chart
- Quick action buttons (charge, discharge, park panels)
- System alert notifications

**Success Criteria:**
- User can assess system status in < 5 seconds
- Critical information above the fold on mobile
- Clear visual hierarchy

### Live Device View
**Purpose:** Real-time device monitoring and control

**Features:**
- Near-real-time telemetry (2-5s refresh)
- Motor angle control with presets
- Device status indicators
- Firmware version & update controls

**Interactions:**
- Angle slider with visual feedback
- Preset buttons (Park, Optimal, Max Tilt)
- Auto-refresh toggle
- Manual refresh button

**Success Criteria:**
- Motor control action completes in < 3s
- Telemetry update lag clearly indicated
- Prevent accidental actions with confirmations

### Energy Insights
**Purpose:** Historical analysis and trends

**Features:**
- Time-series charts (day/week/month/year)
- Total production vs consumption
- Grid export/import breakdown
- CO₂ savings calculator
- Cost savings estimates

**Interactions:**
- Time range selector
- Export to CSV
- Shareable permalink

**Success Criteria:**
- Charts load in < 2s on 3G
- Clear correlation between production and weather
- Actionable insights highlighted

### Settings
**Purpose:** User preferences and system configuration

**Features:**
- Language selection (English/Swahili)
- Theme (Light/Dark/Auto)
- Notification preferences
- Account management
- API token generation

---

## Design Principles

### 1. Mobile-First
- Optimized for smartphones (80% of users)
- Touch-friendly controls (44px minimum)
- Single-column layouts on mobile
- Progressive enhancement for desktop

### 2. Offline-Tolerant
- Show cached data when offline
- Queue actions for sync when reconnected
- Clear sync status indicators
- Optimistic UI for immediate feedback

### 3. Performance-Optimized
- Initial load < 1.5s on 3G
- Lazy load non-critical components
- Compressed assets
- Code splitting by route

### 4. Accessible
- WCAG AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support

### 5. Internationalized
- RTL support ready
- Cultural considerations (units, dates)
- Localized error messages
- Context-aware translations

---

## Visual Design

### Color Strategy
**Primary Palette (Solar/Energy):**
- Warm amber/orange (#f59e0b) - Solar, energy, warmth
- Deep teal (#14b8a6) - Technology, reliability, efficiency

**Semantic Colors:**
- Green - Success, production, export
- Red - Danger, critical alerts
- Amber - Warning, low battery
- Blue - Info, neutral states

### Typography
**Hierarchy:**
- H1 (28px): Page titles
- H2 (22px): Section headers
- Body (16px): Default text
- Small (14px): Secondary info

**Font:** System font stack for performance and native feel

### Spacing
**Scale:** 4px base unit
- Tight: 4-8px (within components)
- Normal: 12-16px (component margins)
- Loose: 24-48px (section spacing)

### Iconography
- Lucide icons (consistent, accessible)
- 20px default size
- Solar-specific: sun, battery, home, zap, panel

---

## User Flows

### 1. First-Time Onboarding
1. Scan device QR code or enter pairing code
2. Connect device to WiFi
3. Verify device handshake
4. Name your system
5. View welcome dashboard

**Duration:** < 3 minutes

### 2. Daily Check-In
1. Open app
2. View dashboard overview
3. Check battery status
4. Review 24h chart
5. (Optional) Adjust settings

**Duration:** < 30 seconds

### 3. Motor Adjustment
1. Navigate to Device page
2. View current angle
3. Select preset or custom angle
4. Confirm action
5. Monitor movement status

**Duration:** < 1 minute

---

## Technical Constraints

### Network
- Target: 3G speeds (500 kbps)
- Intermittent connectivity expected
- Offline-first architecture required

### Devices
- Primary: Android smartphones (mid-range)
- Secondary: iOS, tablets, desktop
- Screen sizes: 320px - 1920px

### Browser Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

---

## Success Metrics

### User Engagement
- Daily active users: > 60%
- Average session duration: 2-5 minutes
- Feature adoption: > 40% use motor control monthly

### Performance
- Page load time: < 1.5s (p75)
- Time to interactive: < 2.5s
- Lighthouse score: > 90

### Reliability
- API uptime: > 99.5%
- Error rate: < 1%
- Offline capability: 100% read, 90% write

### Satisfaction
- User satisfaction: > 4.2/5
- Net Promoter Score: > 40
- Support tickets: < 5% of users

---

## Open Questions / Assumptions

1. **Data refresh rate:** Assuming 2-5s is acceptable for "real-time"?
2. **Offline duration:** How long should cached data remain valid?
3. **Battery presets:** What are optimal charge/discharge thresholds?
4. **Alerts:** Push notifications via SMS, email, or in-app only?
5. **Multi-site:** Should users be able to manage multiple installations?
6. **Billing integration:** Is cost tracking estimate-only or tied to utility bills?
7. **Weather integration:** Include weather forecasts for production prediction?

---

**Document Owner:** Product Team
**Last Updated:** October 2025
**Next Review:** Sprint 2 Retrospective
