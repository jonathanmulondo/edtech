import { Search, Filter, Clock, Award, ChevronRight, Cpu, CircuitBoard, Wifi, Zap, Binary, Gauge, Star, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CourseLibraryProps {
  onNavigate: (view: 'lesson') => void;
}

export function CourseLibrary({ onNavigate }: CourseLibraryProps) {
  const categories = [
    { id: 'all', label: 'All Courses', emoji: '📚' },
    { id: 'arduino', label: 'Arduino', emoji: '🔧' },
    { id: 'raspberry', label: 'Raspberry Pi', emoji: '🥧' },
    { id: 'pcb', label: 'PCB Design', emoji: '⚙️' },
    { id: 'embedded', label: 'Embedded Systems', emoji: '💻' },
    { id: 'power', label: 'Power Electronics', emoji: '⚡' },
  ];

  const courses = [
    {
      title: 'Arduino Foundations',
      icon: Cpu,
      description: 'Master the fundamentals of Arduino programming and circuit design',
      modules: 12,
      duration: '8 hours',
      difficulty: 'Beginner',
      xp: 600,
      color: 'from-cyan-500 to-blue-600',
      enrolled: true,
      progress: 45,
      image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0fGVufDF8fHx8MTc2MzQ0MTIyNHww&ixlib=rb-4.1.0&q=80&w=1080',
      students: 2847,
      rating: 4.8,
      emoji: '🔧'
    },
    {
      title: 'Advanced PCB Design',
      icon: CircuitBoard,
      description: 'Professional PCB layout, routing, and manufacturing techniques',
      modules: 16,
      duration: '12 hours',
      difficulty: 'Advanced',
      xp: 1200,
      color: 'from-blue-500 to-indigo-600',
      enrolled: true,
      progress: 20,
      image: 'https://images.unsplash.com/photo-1640552421163-5a8e34827550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXJjdWl0JTIwYm9hcmQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MzQzMTMzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      students: 1523,
      rating: 4.9,
      emoji: '⚙️'
    },
    {
      title: 'Raspberry Pi Projects',
      icon: Wifi,
      description: 'Build real-world IoT and automation projects with Raspberry Pi',
      modules: 14,
      duration: '10 hours',
      difficulty: 'Intermediate',
      xp: 850,
      color: 'from-teal-500 to-cyan-600',
      enrolled: false,
      image: 'https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNwYmVycnklMjBwaSUyMGNvbXB1dGVyfGVufDF8fHx8MTc2MzQ0MTIyNHww&ixlib=rb-4.1.0&q=80&w=1080',
      students: 3201,
      rating: 4.7,
      emoji: '🥧'
    },
    {
      title: 'Power Electronics Basics',
      icon: Zap,
      description: 'Understanding voltage regulation, converters, and power management',
      modules: 10,
      duration: '6 hours',
      difficulty: 'Intermediate',
      xp: 700,
      color: 'from-purple-500 to-pink-600',
      enrolled: false,
      image: 'https://images.unsplash.com/photo-1711610378090-779a7881a789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGNvbXBvbmVudHMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjM0NDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      students: 1876,
      rating: 4.6,
      emoji: '⚡'
    },
    {
      title: 'Embedded Systems Design',
      icon: Binary,
      description: 'Deep dive into microcontroller architecture and embedded C programming',
      modules: 18,
      duration: '15 hours',
      difficulty: 'Advanced',
      xp: 1500,
      color: 'from-indigo-500 to-purple-600',
      enrolled: false,
      image: 'https://images.unsplash.com/photo-1659070953831-dd4fa16222fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGVkdWNhdGlvbiUyMGxlYXJuaW5nfGVufDF8fHx8MTc2MzQ0MTIyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      students: 1245,
      rating: 4.9,
      emoji: '💻'
    },
    {
      title: 'Sensor Integration',
      icon: Gauge,
      description: 'Work with temperature, pressure, motion, and environmental sensors',
      modules: 8,
      duration: '5 hours',
      difficulty: 'Beginner',
      xp: 450,
      color: 'from-cyan-400 to-teal-500',
      enrolled: false,
      image: 'https://images.unsplash.com/photo-1762690717744-5fcbd4afc95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZnV0dXJpc3RpYyUyMGJsdWV8ZW58MXx8fHwxNzYzNDQxMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      students: 4123,
      rating: 4.8,
      emoji: '🌡️'
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl mb-2 flex items-center gap-3">
            Course Library
            <span className="text-4xl">📚</span>
          </h1>
          <p className="text-slate-400 text-lg">Explore practical engineering courses and learning paths</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl px-6 py-4 text-center">
          <div className="text-2xl mb-1">{courses.length}</div>
          <div className="text-sm opacity-90">Total Courses</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search courses, skills, topics..."
            className="w-full bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900/70 transition-all"
          />
        </div>
        <button className="px-6 py-4 bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              cat.id === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/30 border border-slate-700/30 text-slate-400 hover:border-cyan-500/20 hover:text-slate-300'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <CourseCard key={idx} course={course} onSelect={() => onNavigate('lesson')} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course, onSelect }: { course: any; onSelect: () => void }) {
  const DifficultyBadge = ({ level }: { level: string }) => {
    const colors = {
      Beginner: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      Intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      Advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs border backdrop-blur-xl ${colors[level as keyof typeof colors]}`}>
        {level}
      </span>
    );
  };

  const Icon = course.icon;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:scale-105 transition-all group">
      {/* Image Header with gradient overlay */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-60`} />
        
        {/* Emoji overlay */}
        <div className="absolute top-4 right-4 text-5xl drop-shadow-lg">
          {course.emoji}
        </div>
        
        {/* Rating badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur-xl px-3 py-2 rounded-lg">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm">{course.rating}</span>
          <span className="text-xs text-slate-300">({course.students})</span>
        </div>
        
        <DifficultyBadge level={course.difficulty} />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl mb-2 group-hover:text-cyan-400 transition-colors">{course.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{course.modules} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">{course.students.toLocaleString()} students</span>
        </div>

        {course.enrolled && course.progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Your progress</span>
              <span className="text-cyan-400">{course.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onSelect}
          className={`w-full py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            course.enrolled
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 hover:bg-slate-800/70 text-slate-300'
          }`}
        >
          {course.enrolled ? 'Continue Learning' : 'Start Course'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}