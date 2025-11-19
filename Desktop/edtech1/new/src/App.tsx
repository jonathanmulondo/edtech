import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseLibrary } from './components/CourseLibrary';
import { LessonView } from './components/LessonView';
import { Profile } from './components/Profile';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'courses' | 'lesson' | 'profile'>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white flex overflow-hidden">
      {/* Animated circuit pattern background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(0deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating gradient orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-auto relative">
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'courses' && <CourseLibrary onNavigate={setCurrentView} />}
        {currentView === 'lesson' && <LessonView onNavigate={setCurrentView} />}
        {currentView === 'profile' && <Profile />}
      </main>
    </div>
  );
}