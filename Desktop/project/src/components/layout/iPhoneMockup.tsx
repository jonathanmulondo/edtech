import { ReactNode } from 'react';

/**
 * iPhone Mockup Wrapper
 * Wraps the app in an iPhone frame for realistic mobile preview
 */
export interface IPhoneMockupProps {
  children: ReactNode;
}

export function IPhoneMockup({ children }: IPhoneMockupProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
      {/* iPhone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl" style={{ width: '390px', height: '844px' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50" />

        {/* Inner Bezel */}
        <div className="relative w-full h-full bg-white dark:bg-dark-bg rounded-[2.5rem] overflow-hidden">
          {/* iOS Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 bg-white dark:bg-dark-surface z-40 flex items-center justify-between px-6 pt-2">
            {/* Left side - Time */}
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>

            {/* Right side - Signal, WiFi, Battery */}
            <div className="flex items-center gap-1">
              {/* Signal bars */}
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" className="text-gray-900 dark:text-white">
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" />
                <rect x="10" y="2" width="3" height="10" rx="0.5" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" />
              </svg>

              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="text-gray-900 dark:text-white ml-1">
                <path d="M8 12C8.828 12 9.5 11.328 9.5 10.5C9.5 9.672 8.828 9 8 9C7.172 9 6.5 9.672 6.5 10.5C6.5 11.328 7.172 12 8 12ZM8 7C9.933 7 11.683 7.75 13 8.978L14.061 7.689C12.428 6.139 10.317 5.25 8 5.25C5.683 5.25 3.572 6.139 1.939 7.689L3 8.978C4.317 7.75 6.067 7 8 7ZM8 3C10.761 3 13.317 4.05 15.244 5.822L16.305 4.533C14.072 2.461 11.133 1.25 8 1.25C4.867 1.25 1.928 2.461 -0.305 4.533L0.756 5.822C2.683 4.05 5.239 3 8 3Z" />
              </svg>

              {/* Battery */}
              <div className="flex items-center ml-1">
                <div className="relative w-6 h-3 border-2 border-gray-900 dark:border-white rounded-sm">
                  <div className="absolute inset-0.5 bg-gray-900 dark:bg-white rounded-sm" style={{ width: '80%' }} />
                </div>
                <div className="w-0.5 h-1.5 bg-gray-900 dark:bg-white rounded-r-sm ml-0.5" />
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="w-full h-full overflow-y-auto" style={{ paddingTop: '0px' }}>
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 dark:bg-gray-300 rounded-full z-40" />
        </div>

        {/* Side Buttons (just visual) */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-800 rounded-l" />
        <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-800 rounded-l" />
        <div className="absolute -left-1 top-52 w-1 h-12 bg-gray-800 rounded-l" />
        <div className="absolute -right-1 top-36 w-1 h-16 bg-gray-800 rounded-r" />
      </div>

      {/* Device Info Label */}
      <div className="absolute bottom-4 text-center text-sm text-gray-500 dark:text-gray-400">
        iPhone 14 Pro (390 × 844)
      </div>
    </div>
  );
}
