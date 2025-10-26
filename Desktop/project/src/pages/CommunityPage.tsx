import { useState } from 'react';
import { Users, Trophy, TrendingUp, Award, MapPin, Leaf } from 'lucide-react';
import { MetricCard } from '@components/data/MetricCard';

interface CommunityMember {
  id: string;
  name: string;
  location: string;
  rank: number;
  monthlyProduction: number; // kWh
  co2Saved: number; // kg
  systemSize: number; // kW
  achievements: string[];
}

/**
 * Community Features & Leaderboards
 * Compare with neighbors, earn achievements, participate in challenges
 */
export function CommunityPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('month');

  // Mock community data
  const userStats = {
    rank: 12,
    totalMembers: 247,
    monthlyProduction: 385,
    percentile: 82,
    co2Saved: 289,
    achievements: ['First 100 kWh', 'Week Streak', 'Green Warrior']
  };

  const leaderboard: CommunityMember[] = [
    {
      id: '1',
      name: 'Sarah K.',
      location: 'Westlands, Nairobi',
      rank: 1,
      monthlyProduction: 542,
      co2Saved: 407,
      systemSize: 5.5,
      achievements: ['Top Producer', 'Eco Champion', 'Solar Pioneer']
    },
    {
      id: '2',
      name: 'James M.',
      location: 'Karen, Nairobi',
      rank: 2,
      monthlyProduction: 518,
      co2Saved: 389,
      systemSize: 5.2,
      achievements: ['Efficiency Master', 'Green Warrior']
    },
    {
      id: '3',
      name: 'Grace N.',
      location: 'Kilimani, Nairobi',
      rank: 3,
      monthlyProduction: 495,
      co2Saved: 371,
      systemSize: 5.0,
      achievements: ['Solar Expert', 'Community Leader']
    },
    // ... more members
  ];

  const challenges = [
    {
      id: '1',
      name: 'Green October Challenge',
      description: 'Reduce grid import by 20% this month',
      participants: 142,
      endsIn: '12 days',
      reward: '$50 credit',
      progress: 67
    },
    {
      id: '2',
      name: 'Weekend Warrior',
      description: 'Export 50kWh to grid this weekend',
      participants: 89,
      endsIn: '2 days',
      reward: 'Community Badge',
      progress: 34
    }
  ];

  return (
    <div className="safe-container py-4 md:py-6 space-y-6 bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-accent-100 dark:bg-accent-900/20 rounded-lg">
          <Users className="text-accent-600 dark:text-accent-400" size={28} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-text">
            Community
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect with {userStats.totalMembers} solar enthusiasts in your area
          </p>
        </div>
      </div>

      {/* Your Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Your Rank"
          value={`#${userStats.rank}`}
          subtitle={`Top ${userStats.percentile}%`}
          icon={Trophy}
          status="positive"
        />
        <MetricCard
          title="Monthly Production"
          value={userStats.monthlyProduction}
          unit="kWh"
          subtitle="This month"
          icon={TrendingUp}
          status="positive"
        />
        <MetricCard
          title="CO₂ Saved"
          value={userStats.co2Saved}
          unit="kg"
          subtitle="Community impact"
          icon={Leaf}
          status="positive"
        />
        <MetricCard
          title="Achievements"
          value={userStats.achievements.length}
          subtitle="Badges earned"
          icon={Award}
          status="neutral"
        />
      </div>

      {/* Active Challenges */}
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 border border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
          🎯 Active Challenges
        </h2>
        <div className="space-y-4">
          {challenges.map(challenge => (
            <div key={challenge.id} className="border border-gray-200 dark:border-dark-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                    {challenge.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {challenge.description}
                  </p>
                </div>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded">
                  {challenge.reward}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>{challenge.participants} participants</span>
                <span>Ends in {challenge.endsIn}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{challenge.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 border border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            🏆 Leaderboard
          </h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm rounded ${
                timeRange === 'week'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${
                timeRange === 'month'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboard.map((member, index) => (
            <div
              key={member.id}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                index < 3
                  ? 'bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-dark-surface font-bold">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${member.rank}`}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-dark-text">
                  {member.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={14} />
                  <span>{member.location}</span>
                  <span>•</span>
                  <span>{member.systemSize} kW system</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {member.monthlyProduction} kWh
                </div>
                <div className="text-xs text-gray-500">
                  {member.co2Saved} kg CO₂ saved
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            You're currently <strong>#{userStats.rank}</strong> out of {userStats.totalMembers} members!
            <br />
            {userStats.rank <= 10 ? (
              <span className="text-success font-medium">🎉 Excellent performance!</span>
            ) : (
              <span>Produce {((leaderboard[9]?.monthlyProduction || 400) - userStats.monthlyProduction).toFixed(0)} more kWh to reach top 10!</span>
            )}
          </p>
        </div>
      </div>

      {/* Community Impact */}
      <div className="bg-gradient-to-r from-success to-accent-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🌍 Collective Impact</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{(userStats.totalMembers * 385 / 1000).toFixed(1)}</div>
            <div className="text-sm text-white/80">MWh Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{(userStats.totalMembers * 289 / 1000).toFixed(1)}</div>
            <div className="text-sm text-white/80">Tonnes CO₂ Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{userStats.totalMembers * 12}</div>
            <div className="text-sm text-white/80">Trees Equivalent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
