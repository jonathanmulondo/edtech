import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Settings,
  Activity
} from 'lucide-react';
import { cn } from '@lib/utils/cn';

/**
 * Compact Sidebar Navigation - Always Visible
 * iOS-style navigation bar
 */
export function Navigation() {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI', href: '/ai-insights', icon: Sparkles },
    { name: 'System', href: '/automation', icon: Activity },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-xl px-4 py-3 border border-gray-800">
        <nav className="flex items-center justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 transition-colors',
                  active
                    ? 'text-lime-400'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                <Icon size={20} />
                <span className={cn(
                  'text-[10px]',
                  active ? 'font-semibold' : 'font-medium'
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
