import { ChevronLeft, Play, Code, Lightbulb, CheckCircle2, Circle, FileText, Beaker, Zap, Sparkles, BookOpen, Trophy } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LessonViewProps {
  onNavigate: (view: 'courses' | 'dashboard') => void;
}

export function LessonView({ onNavigate }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'simulator' | 'notes'>('content');

  const lessonSteps = [
    { title: 'Introduction to PWM', completed: true, emoji: '📖' },
    { title: 'PWM Frequency & Duty Cycle', completed: true, emoji: '📊' },
    { title: 'Arduino PWM Pins', completed: true, emoji: '🔌' },
    { title: 'Code Implementation', completed: false, current: true, emoji: '💻' },
    { title: 'Practical Applications', completed: false, emoji: '⚙️' },
    { title: 'Quiz & Practice', completed: false, emoji: '✅' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col">
        {/* Back button */}
        <div className="p-4 border-b border-cyan-500/20">
          <button
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Courses
          </button>
        </div>

        {/* Course Info */}
        <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
          <div className="text-sm text-cyan-400 mb-1 flex items-center gap-2">
            <span>🔧</span>
            Arduino Foundations
          </div>
          <h3 className="mb-3">PWM Control Basics</h3>
          
          {/* Animated Progress */}
          <div className="relative">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-slate-400">60% Complete</div>
              <div className="text-xs text-cyan-400">+50 XP earned</div>
            </div>
          </div>
        </div>

        {/* Lesson Steps */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {lessonSteps.map((step, idx) => (
            <button
              key={idx}
              className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left ${
                step.current
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : step.completed
                  ? 'hover:bg-slate-800/30 border border-transparent'
                  : 'hover:bg-slate-800/30 opacity-60 border border-transparent'
              }`}
            >
              <div className="text-2xl flex-shrink-0">{step.emoji}</div>
              <div className="flex-1">
                <div className={`text-sm ${step.current ? 'text-cyan-100' : step.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step.title}
                </div>
                {step.current && (
                  <div className="flex items-center gap-1 text-xs text-cyan-400 mt-1">
                    <Sparkles className="w-3 h-3" />
                    In Progress
                  </div>
                )}
              </div>
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${step.current ? 'text-cyan-400' : 'text-slate-600'}`} />
              )}
            </button>
          ))}
        </div>

        {/* Action button */}
        <div className="p-4 border-t border-cyan-500/20">
          <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
            <Trophy className="w-5 h-5" />
            Mark Complete & Continue
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-cyan-500/20 bg-slate-900/30 backdrop-blur-xl">
          <div className="flex gap-2 p-3">
            {[
              { id: 'content' as const, label: 'Content', icon: FileText, emoji: '📚' },
              { id: 'simulator' as const, label: 'Simulator', icon: Beaker, emoji: '🔬' },
              { id: 'notes' as const, label: 'Notes', icon: Lightbulb, emoji: '📝' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-100 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                  }`}
                >
                  <span className="text-lg">{tab.emoji}</span>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-slate-950 to-blue-950/10">
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'simulator' && <SimulatorTab />}
          {activeTab === 'notes' && <NotesTab />}
        </div>
      </div>
    </div>
  );
}

function ContentTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl mb-4 flex items-center gap-3">
          Code Implementation
          <span className="text-3xl">💻</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Learn how to implement PWM control in Arduino using the analogWrite() function. 
          This allows you to control LED brightness, motor speed, and other analog-like outputs.
        </p>
      </div>

      {/* Key Concepts */}
      <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-xl">Key Concepts</h3>
        </div>
        <ul className="space-y-4 text-slate-300">
          <li className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-xl">
            <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <span>PWM uses digital pins to simulate analog output by rapidly switching between HIGH and LOW</span>
          </li>
          <li className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-xl">
            <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <span>Duty cycle ranges from 0 (always off) to 255 (always on) in Arduino</span>
          </li>
          <li className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-xl">
            <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <span>Only specific pins support PWM (marked with ~ on Arduino boards)</span>
          </li>
        </ul>
      </div>

      {/* Code Block */}
      <div className="bg-slate-950 border-2 border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900/80 to-slate-900/50 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-300">Arduino Code</span>
          </div>
          <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-xs text-cyan-400 transition-all">
            Copy Code
          </button>
        </div>
        <pre className="p-8 overflow-x-auto text-sm">
          <code className="text-slate-300">
{`// Define LED pin (must be PWM-capable)
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Fade in
  for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(ledPin, brightness);
    delay(5);
  }
  
  // Fade out
  for (int brightness = 255; brightness >= 0; brightness--) {
    analogWrite(ledPin, brightness);
    delay(5);
  }
}`}
          </code>
        </pre>
      </div>

      {/* Video Placeholder */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="aspect-video bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-950 flex items-center justify-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(0deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }} />
          
          {/* Circuit board image */}
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0fGVufDF8fHx8MTc2MzQ0MTIyNHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Arduino PWM Demo"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
          
          <button className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-cyan-400/30 flex items-center justify-center hover:scale-110 transition-all group shadow-2xl shadow-cyan-500/30">
            <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-950/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-300 mb-1">PWM Demonstration Video</div>
              <div className="text-xs text-slate-500">Watch how PWM controls LED brightness • 5:24</div>
            </div>
            <div className="text-2xl">🎥</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulatorTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          Interactive Arduino Simulator
          <span className="text-3xl">🔬</span>
        </h2>
        <p className="text-slate-400 text-lg">Test your code in a virtual environment before uploading to hardware</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Virtual Board */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-cyan-400 flex items-center gap-2">
              <span>🎛️</span>
              Virtual Arduino Board
            </h3>
            <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
              ● Connected
            </span>
          </div>
          <div className="aspect-square bg-gradient-to-br from-slate-950 to-blue-950/20 rounded-xl flex items-center justify-center relative overflow-hidden border border-cyan-500/10">
            {/* Background image */}
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0fGVufDF8fHx8MTc2MzQ0MTIyNHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Arduino Board"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
            
            <div className="relative text-center z-10">
              <div className="w-40 h-40 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-500/50 flex items-center justify-center backdrop-blur-xl animate-pulse">
                <Zap className="w-20 h-20 text-cyan-400" />
              </div>
              <p className="text-slate-400">Arduino UNO R3</p>
              <p className="text-xs text-slate-600 mt-2">Pin 9: PWM Active</p>
            </div>
          </div>
        </div>

        {/* Serial Monitor */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
          <h3 className="mb-4 text-sm text-cyan-400 flex items-center gap-2">
            <span>📡</span>
            Serial Monitor
          </h3>
          <div className="bg-slate-950 rounded-xl p-5 h-80 overflow-auto border border-cyan-500/10 shadow-inner">
            <div className="text-sm text-cyan-400 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Simulation started...
            </div>
            <div className="text-sm text-slate-400 space-y-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">[00:01]</span>
                <span>PWM Output: 0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">[00:02]</span>
                <span>PWM Output: 25</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">[00:03]</span>
                <span>PWM Output: 50</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">[00:04]</span>
                <span>PWM Output: 75</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">[00:05]</span>
                <span className="text-cyan-400">PWM Output: 100</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
              <Play className="w-4 h-4" />
              Run Simulation
            </button>
            <button className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/30 transition-all">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          Your Notes
          <span className="text-3xl">📝</span>
        </h2>
        <p className="text-slate-400 text-lg">Keep track of important concepts and ideas</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 space-y-4 shadow-xl">
        <textarea
          placeholder="Start taking notes... ✍️"
          className="w-full min-h-96 bg-transparent text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none text-lg"
        />
        <div className="flex items-center justify-between pt-4 border-t border-cyan-500/10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Auto-saved 2 minutes ago
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}