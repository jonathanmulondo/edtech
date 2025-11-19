import { Award, TrendingUp, Calendar, Target, Star, Zap, Cpu, CircuitBoard, BookOpen, Trophy, Flame } from 'lucide-react';

export function Profile() {
  const achievements = [
    { icon: Zap, title: 'First Steps', description: 'Completed your first lesson', color: 'from-cyan-500 to-blue-600', earned: true, emoji: '🚀' },
    { icon: Cpu, title: 'Arduino Master', description: 'Finished Arduino Foundations course', color: 'from-blue-500 to-indigo-600', earned: true, emoji: '🔧' },
    { icon: CircuitBoard, title: 'Circuit Builder', description: 'Built 10 circuit projects', color: 'from-indigo-500 to-purple-600', earned: true, emoji: '⚙️' },
    { icon: Star, title: 'Perfect Score', description: 'Got 100% on 5 quizzes', color: 'from-purple-500 to-pink-600', earned: false, emoji: '⭐' },
    { icon: Target, title: 'Streak Master', description: '30-day learning streak', color: 'from-teal-500 to-cyan-600', earned: false, emoji: '🔥' },
    { icon: BookOpen, title: 'Bookworm', description: 'Completed 50 lessons', color: 'from-cyan-400 to-teal-500', earned: false, emoji: '📚' },
  ];

  const skillTree = [
    { name: 'Basics', level: 5, maxLevel: 5, color: 'cyan', unlocked: true, emoji: '📖' },
    { name: 'Microcontrollers', level: 4, maxLevel: 5, color: 'blue', unlocked: true, emoji: '🔧' },
    { name: 'Sensors', level: 3, maxLevel: 5, color: 'indigo', unlocked: true, emoji: '📡' },
    { name: 'PCB Design', level: 2, maxLevel: 5, color: 'purple', unlocked: true, emoji: '⚙️' },
    { name: 'Embedded Systems', level: 1, maxLevel: 5, color: 'teal', unlocked: true, emoji: '💻' },
    { name: 'Power Electronics', level: 0, maxLevel: 5, color: 'slate', unlocked: false, emoji: '⚡' },
  ];

  const recentActivity = [
    { action: 'Completed lesson', title: 'PWM Control Basics', time: '2 hours ago', emoji: '✅' },
    { action: 'Earned badge', title: 'Circuit Builder', time: '1 day ago', emoji: '🏆' },
    { action: 'Started course', title: 'Advanced PCB Design', time: '2 days ago', emoji: '🚀' },
    { action: 'Quiz completed', title: 'Arduino Fundamentals Quiz', time: '3 days ago', emoji: '📝' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex items-start gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl flex items-center justify-center text-4xl flex-shrink-0 border-4 border-white/30">
            👨‍💻
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl mb-2 flex items-center gap-3">
              Alex Engineer
              <span className="text-2xl">✨</span>
            </h1>
            <p className="text-blue-100 text-lg mb-4">Engineering Student • Arduino Enthusiast</p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl">
                <TrendingUp className="w-5 h-5" />
                <span>Level 12</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span>8 Badges</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl">
                <Flame className="w-5 h-5 text-orange-300" />
                <span>7 day streak</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="text-right">
            <div className="text-3xl mb-1">2,847 XP</div>
            <div className="text-sm text-blue-100 mb-3">153 XP to Level 13</div>
            <div className="w-48 h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-xl">
              <div className="h-full w-4/5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Lessons Completed" value="42" color="from-cyan-500 to-blue-600" emoji="📚" />
        <StatCard icon={Target} label="Skills Mastered" value="12" color="from-blue-500 to-indigo-600" emoji="🎯" />
        <StatCard icon={Zap} label="Total XP Earned" value="2,847" color="from-indigo-500 to-purple-600" emoji="⚡" />
        <StatCard icon={Award} label="Badges Earned" value="8" color="from-purple-500 to-pink-600" emoji="🏆" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Tree */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="flex items-center gap-2">
            <span>Skill Tree</span>
            <span className="text-2xl">🌳</span>
          </h2>
          
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 space-y-5 shadow-xl">
            {skillTree.map((skill, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{skill.emoji}</span>
                    <span className={`${skill.unlocked ? 'text-slate-200' : 'text-slate-600'}`}>
                      {skill.name}
                    </span>
                  </div>
                  <span className={`text-sm ${skill.unlocked ? 'text-cyan-400' : 'text-slate-600'} flex items-center gap-1`}>
                    {skill.level === skill.maxLevel && skill.unlocked && <Star className="w-4 h-4 fill-cyan-400" />}
                    Level {skill.level}/{skill.maxLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        skill.unlocked 
                          ? skill.level === skill.maxLevel
                            ? 'from-cyan-500 to-blue-500'
                            : 'from-cyan-500/70 to-blue-500/70'
                          : 'from-slate-700 to-slate-600'
                      } rounded-full transition-all duration-1000`}
                      style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                    />
                  </div>
                  {!skill.unlocked && (
                    <span className="text-xl">🔒</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2">
            <span>Recent Activity</span>
            <span className="text-2xl">📊</span>
          </h2>
          
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 space-y-4 shadow-xl">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all">
                <div className="text-2xl flex-shrink-0">{activity.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-400">{activity.action}</div>
                  <div className="text-sm text-cyan-400 truncate">{activity.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <span>Achievements</span>
            <span className="text-2xl">🏅</span>
          </h2>
          <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 px-4 py-2 rounded-xl">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-400">8 of 24 earned</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, idx) => {
            const Icon = achievement.icon;
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br backdrop-blur-xl border rounded-2xl p-6 relative overflow-hidden group ${
                  achievement.earned
                    ? 'from-slate-900/80 to-slate-950/80 border-cyan-500/20 hover:border-cyan-500/40 hover:scale-105'
                    : 'from-slate-900/30 to-slate-950/30 border-slate-700/20 opacity-60'
                } transition-all shadow-lg`}
              >
                {achievement.earned && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />
                )}
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl">{achievement.emoji}</span>
                  </div>
                  <h3 className={`mb-2 ${achievement.earned ? 'text-white' : 'text-slate-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.earned ? 'text-slate-400' : 'text-slate-600'}`}>
                    {achievement.description}
                  </p>
                  {!achievement.earned && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                      <span>🔒</span>
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, emoji }: {
  icon: any;
  label: string;
  value: string;
  color: string;
  emoji: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform shadow-xl`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-6 h-6" />
          <span className="text-3xl">{emoji}</span>
        </div>
        <div className="text-3xl mb-1">{value}</div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
    </div>
  );
}