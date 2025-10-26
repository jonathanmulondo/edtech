# Low-Bandwidth Optimization Checklist

**Target:** < 1.5s initial load on 3G-like conditions (500 kbps)
**Context:** East Africa deployment with intermittent connectivity
**Last Updated:** October 2025

---

## 🎯 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint (FCP)** | < 1.2s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3.5s | Lighthouse |
| **Total Blocking Time (TBT)** | < 300ms | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **Bundle Size (gzipped)** | < 200KB | webpack-bundle-analyzer |
| **API Response Time** | < 500ms | Server logs |

**Test Conditions:**
- Network: Fast 3G (400-500 kbps)
- Device: Mid-range Android (Moto G4)
- CPU: 4x slowdown

---

## ✅ Asset Optimization

### JavaScript
- [ ] Code splitting by route
- [ ] Lazy load non-critical components
- [ ] Tree shaking enabled
- [ ] Minification enabled
- [ ] Source maps only in development
- [ ] Dead code eliminated
- [ ] Polyfills conditionally loaded

**Bundle Analysis:**
```bash
npm run build
npx webpack-bundle-analyzer dist/stats.json
```

**Target Breakdown:**
- Main bundle: < 80KB gzipped
- Vendor (React, etc.): < 50KB gzipped
- Route chunks: < 30KB each gzipped

### CSS
- [ ] Tailwind CSS purged
- [ ] Critical CSS inlined
- [ ] Non-critical CSS deferred
- [ ] CSS minified
- [ ] Unused styles removed

### Images
- [ ] Images compressed (TinyPNG, ImageOptim)
- [ ] Responsive images with srcset
- [ ] Modern formats (WebP with fallback)
- [ ] Lazy loading below the fold
- [ ] Proper sizing (no oversized images)
- [ ] Icons as SVG or icon font
- [ ] Placeholder images for lazy load

**Image Sizes:**
- Thumbnails: < 10KB
- Hero images: < 100KB
- Icons: < 5KB (use SVG)

### Fonts
- [ ] System fonts used (no web fonts)
- [ ] Font subsetting if custom fonts required
- [ ] Font-display: swap

---

## ✅ Network Optimization

### Compression
- [ ] Gzip enabled on server
- [ ] Brotli compression for modern browsers
- [ ] Text assets compressed (HTML, CSS, JS, JSON)

### Caching
- [ ] Static assets cached (1 year)
- [ ] HTML with cache validation
- [ ] Service worker for offline caching
- [ ] IndexedDB for data caching
- [ ] Cache-Control headers set correctly

**Cache Strategy:**
- Static assets: `Cache-Control: public, max-age=31536000, immutable`
- HTML: `Cache-Control: no-cache`
- API: `Cache-Control: private, max-age=300` (5 min)

### API Optimization
- [ ] GraphQL or field selection to reduce payload
- [ ] Pagination for lists
- [ ] Data compression (gzip)
- [ ] Response caching
- [ ] Request debouncing
- [ ] Batch requests where possible

**API Payload Limits:**
- Dashboard summary: < 20KB
- Time series (day): < 30KB
- Time series (week): < 50KB
- Time series (month): < 100KB

### HTTP/2
- [ ] HTTP/2 enabled on server
- [ ] Multiplexing utilized
- [ ] Server push for critical resources

---

## ✅ Loading Strategy

### Critical Path
- [ ] Inline critical CSS
- [ ] Preload critical fonts
- [ ] Defer non-critical JavaScript
- [ ] Eliminate render-blocking resources

### Code Splitting
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('@pages/Dashboard'));
const DevicePage = lazy(() => import('@pages/DevicePage'));
const EnergyInsights = lazy(() => import('@pages/EnergyInsights'));

// Lazy load heavy components
const TimeSeriesChart = lazy(() => import('@components/data/TimeSeriesChart'));
```

### Progressive Enhancement
- [ ] Basic content loads first
- [ ] Enhanced features load progressively
- [ ] Graceful degradation for old browsers
- [ ] Core functionality works without JS (where possible)

---

## ✅ Offline Support

### Service Worker
- [ ] Service worker registered
- [ ] Offline page available
- [ ] Critical pages cached
- [ ] API responses cached
- [ ] Background sync for actions

### IndexedDB
- [ ] Site data cached locally
- [ ] Time series data cached
- [ ] Action queue for offline actions
- [ ] Cache invalidation strategy

### Offline UX
- [ ] Clear offline indicator
- [ ] Cached data timestamp shown
- [ ] Queued actions visible
- [ ] Sync status displayed
- [ ] Optimistic UI updates

**Offline Capability:**
- ✅ Read: All pages viewable with cached data
- ✅ Write: Actions queued for sync
- ✅ Sync: Automatic when online

---

## ✅ Runtime Performance

### React Optimization
- [ ] Memoization for expensive calculations
- [ ] useMemo for derived data
- [ ] useCallback for callbacks
- [ ] React.memo for pure components
- [ ] Virtual scrolling for long lists
- [ ] Debouncing for search/filters

### Chart Optimization
```typescript
// Reduce data points for mobile
const optimizedData = useMemo(() => {
  if (isMobile && data.length > 50) {
    return downsample(data, 50);
  }
  return data;
}, [data, isMobile]);

// Disable animations on slow devices
<AreaChart isAnimationActive={!isSlowDevice} />
```

### Image Optimization
```typescript
// Responsive images
<img
  src="/image-800.webp"
  srcSet="/image-400.webp 400w, /image-800.webp 800w, /image-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  alt="Solar panel"
/>
```

---

## ✅ Low-Bandwidth Mode

### Simplified UI
- [ ] Option to enable "Lite mode"
- [ ] Reduce chart data points
- [ ] Disable animations
- [ ] Use sparklines instead of full charts
- [ ] Text-only mode available

### Adaptive Loading
```typescript
// Detect connection speed
const { effectiveType } = navigator.connection || {};
const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g';

if (isSlowConnection) {
  // Load simplified components
  return <SparklineChart data={data} />;
}
return <TimeSeriesChart data={data} />;
```

### Bandwidth Indicators
- [ ] Show connection speed
- [ ] Warn when loading large data
- [ ] Estimate data usage
- [ ] Allow user to control quality

---

## ✅ Testing

### Lighthouse (Chrome DevTools)
```bash
# Run Lighthouse in CI
npm install -g @lhci/cli
lhci autorun
```

**Targets:**
- Performance: > 90
- Best Practices: > 95
- SEO: > 90

### Network Throttling
**Chrome DevTools:**
1. Open DevTools → Network tab
2. Throttling: Fast 3G
3. Test all critical flows

**Profiles:**
- **Slow 3G:** 400 Kbps, 400ms RTT
- **Fast 3G:** 1.6 Mbps, 150ms RTT
- **Offline:** Test offline mode

### Bundle Size Monitoring
```bash
# Check bundle sizes
npm run build
ls -lh dist/assets/*.js

# Set budget in vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
      }
    }
  }
}
```

### Real User Monitoring (RUM)
- [ ] Add performance monitoring (e.g., Sentry, LogRocket)
- [ ] Track Core Web Vitals
- [ ] Monitor bundle sizes over time
- [ ] Alert on regressions

---

## ✅ Progressive Web App (PWA)

### Service Worker
- [ ] Precache app shell
- [ ] Runtime caching for API
- [ ] Background sync
- [ ] Push notifications (future)

### Manifest
- [ ] Web app manifest configured
- [ ] Icons for all sizes
- [ ] Theme color set
- [ ] Display mode: standalone
- [ ] Install prompt available

### Offline Page
- [ ] Custom offline page
- [ ] Cached for offline use
- [ ] Shows queued actions
- [ ] Retry button available

---

## ✅ Mobile-Specific Optimizations

### Touch Optimization
- [ ] 44×44px minimum touch targets
- [ ] No hover-dependent interactions
- [ ] Touch gestures debounced
- [ ] Prevent double-tap zoom where appropriate

### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
```

### Safe Area Insets
```css
.safe-container {
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
}
```

---

## ✅ Monitoring & Alerts

### Performance Budget
Set budgets in `lighthouserc.js`:
```javascript
module.exports = {
  ci: {
    assert: {
      assertions: {
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      }
    }
  }
};
```

### CI/CD Checks
- [ ] Lighthouse CI in pipeline
- [ ] Bundle size check on PR
- [ ] Performance regression alerts
- [ ] Fail build if budgets exceeded

---

## 🎯 Optimization Checklist Summary

**Critical (P0):**
- [x] Code splitting by route
- [x] Lazy load heavy components
- [x] Compress assets (gzip/brotli)
- [x] Cache static assets
- [x] Minify JS/CSS
- [x] Optimize images

**Important (P1):**
- [ ] Service worker + offline support
- [ ] IndexedDB caching
- [ ] Progressive loading
- [ ] Reduced motion support
- [ ] Lighthouse score > 90

**Nice to Have (P2):**
- [ ] WebP images with fallback
- [ ] Adaptive loading based on connection
- [ ] Lite mode toggle
- [ ] Push notifications

---

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Maintained by:** Frontend Team
**Review Frequency:** Every sprint
**Last Audit:** Sprint 4, Week 2
