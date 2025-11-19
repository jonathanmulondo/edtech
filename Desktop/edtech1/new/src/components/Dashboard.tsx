import { TrendingUp, Award, Target, Clock, ChevronRight, Cpu, CircuitBoard, Zap, Flame, Trophy, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  onNavigate: (view: 'courses' | 'lesson') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const skills = [
    { name: 'Arduino', progress: 75, color: 'from-cyan-500 to-blue-500' },
    { name: 'PCB Design', progress: 45, color: 'from-blue-500 to-indigo-500' },
    { name: 'Raspberry Pi', progress: 60, color: 'from-cyan-400 to-teal-500' },
    { name: 'Embedded Systems', progress: 30, color: 'from-indigo-500 to-purple-500' },
  ];

  const recentLessons = [
    { 
      title: 'PWM Control Basics', 
      module: 'Arduino Foundations', 
      progress: 80, 
      time: '12 min left',
      image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0fGVufDF8fHx8MTc2MzQ0MTIyNHww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-cyan-500/20 via-blue-500/10 to-transparent'
    },
    { 
      title: 'Circuit Design Principles', 
      module: 'PCB Design', 
      progress: 45, 
      time: '25 min left',
      image: 'https://images.unsplash.com/photo-1640552421163-5a8e34827550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXJjdWl0JTIwYm9hcmQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MzQzMTMzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-purple-500/20 via-pink-500/10 to-transparent'
    },
    { 
      title: 'I2C Communication', 
      module: 'Embedded Systems', 
      progress: 65, 
      time: '18 min left',
      image: 'https://images.unsplash.com/photo-1711610378090-779a7881a789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGNvbXBvbmVudHMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjM0NDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-indigo-500/20 via-purple-500/10 to-transparent'
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-3xl p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-6 h-6 text-orange-300" />
              <span className="text-orange-100">7 Day Streak!</span>
            </div>
            <h1 className="text-4xl mb-2">Welcome back, Alex! 👋</h1>
            <p className="text-blue-100 text-lg">Ready to continue your engineering journey?</p>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-2">
                <Trophy className="w-10 h-10 text-yellow-300" />
              </div>
              <div className="text-2xl">Level 12</div>
              <div className="text-sm text-blue-100">Expert</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-2">
                <Star className="w-10 h-10 text-cyan-300" />
              </div>
              <div className="text-2xl">2,847</div>
              <div className="text-sm text-blue-100">Total XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value="+125 XP"
          trend="↑ 23% from last week"
          color="from-cyan-500 to-blue-600"
          emoji="📈"
        />
        <StatCard
          icon={Target}
          label="Skills Mastered"
          value="12/18"
          trend="3 in progress"
          color="from-blue-500 to-indigo-600"
          emoji="🎯"
        />
        <StatCard
          icon={Award}
          label="Badges Earned"
          value="8"
          trend="2 away from next"
          color="from-indigo-500 to-purple-600"
          emoji="🏆"
        />
        <StatCard
          icon={Clock}
          label="Learning Time"
          value="12.5h"
          trend="This week"
          color="from-purple-500 to-pink-600"
          emoji="⚡"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2">
              <span>Continue Learning</span>
              <span className="text-2xl">🚀</span>
            </h3>
            <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentLessons.map((lesson, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('lesson')}
                className="w-full bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                    <ImageWithFallback 
                      src={lesson.image}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${lesson.color}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-5 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white group-hover:text-cyan-400 transition-colors mb-1">{lesson.title}</h4>
                        <p className="text-sm text-slate-400">{lesson.module}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{lesson.progress}% complete</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.time}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skill Progress */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2">
            <span>Skill Progress</span>
            <span className="text-2xl">📊</span>
          </h3>
          
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 space-y-6">
            {/* Circular Progress */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="transform -rotate-90" width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-800"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(75 / 100) * 440} 440`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl">75%</div>
                <div className="text-xs text-slate-400">Overall</div>
              </div>
            </div>

            {/* Individual Skills */}
            {skills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{skill.name}</span>
                  <span className="text-sm text-cyan-400">{skill.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Paths */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2">
          <span>Recommended Learning Paths</span>
          <span className="text-2xl">✨</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PathCard
            icon={Cpu}
            title="Microcontroller Mastery"
            description="Master Arduino and ESP32 development"
            lessons={24}
            xp={1200}
            color="from-cyan-500 to-blue-600"
            image="https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0fGVufDF8fHx8MTc2MzQ0MTIyNHww&ixlib=rb-4.1.0&q=80&w=1080"
            emoji="🔧"
            onSelect={() => onNavigate('courses')}
          />
          <PathCard
            icon={CircuitBoard}
            title="PCB Design Pro"
            description="Learn professional PCB layout techniques"
            lessons={18}
            xp={950}
            color="from-blue-500 to-indigo-600"
            image="https://images.unsplash.com/photo-1640552421163-5a8e34827550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXJjdWl0JTIwYm9hcmQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MzQzMTMzMHww&ixlib=rb-4.1.0&q=80&w=1080"
            emoji="⚙️"
            onSelect={() => onNavigate('courses')}
          />
          <PathCard
            icon={Zap}
            title="Power Electronics"
            description="Understanding voltage regulation and power"
            lessons={15}
            xp={800}
            color="from-indigo-500 to-purple-600"
            image="https://images.unsplash.com/photo-1711610378090-779a7881a789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGNvbXBvbmVudHMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjM0NDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            emoji="⚡"
            onSelect={() => onNavigate('courses')}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color, emoji }: {
  icon: any;
  label: string;
  value: string;
  trend: string;
  color: string;
  emoji: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <Icon className="w-6 h-6" />
          <span className="text-3xl">{emoji}</span>
        </div>
        <div className="text-3xl mb-1">{value}</div>
        <div className="text-sm opacity-90 mb-1">{label}</div>
        <div className="text-xs opacity-70">{trend}</div>
      </div>
    </div>
  );
}

function PathCard({ icon: Icon, title, description, lessons, xp, color, image, emoji, onSelect }: {
  icon: any;
  title: string;
  description: string;
  lessons: number;
  xp: number;
  color: string;
  image: string;
  emoji: string;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:scale-105 transition-all group text-left"
    >
      {/* Image Header */}
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback 
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-80`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl drop-shadow-lg">{emoji}</div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h4 className="text-white group-hover:text-cyan-400 transition-colors mb-2 flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </h4>
        <p className="text-sm text-slate-400 mb-4">{description}</p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span>📚 {lessons} lessons</span>
            <span>•</span>
            <span>⭐ {xp} XP</span>
          </div>
        </div>
      </div>
    </button>
  );
}
