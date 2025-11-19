import { Home, BookOpen, User, Cpu, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'courses' | 'lesson' | 'profile';
  onViewChange: (view: 'dashboard' | 'courses' | 'lesson' | 'profile') => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as const, icon: Home, label: 'Dashboard' },
    { id: 'courses' as const, icon: BookOpen, label: 'Courses' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col relative">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-transparent" />
      
      {/* Logo */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="tracking-tight">EngiLearn</h1>
            <p className="text-xs text-cyan-400/70">Practical Engineering</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className={isActive ? 'text-cyan-100' : 'text-slate-300'}>{item.label}</span>
              {isActive && <Zap className="w-4 h-4 text-cyan-400 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-cyan-500/20">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-all border border-transparent">
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300">Settings</span>
        </button>
      </div>
    </div>
  );
}
