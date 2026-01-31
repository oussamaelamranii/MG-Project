
import React from 'react';
import { Trophy, Settings, Flame, Star, Target, ChevronRight, Share2, Crown, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PROGRESS_DATA = [
  { month: 'Sep', value: 72 },
  { month: 'Oct', value: 75 },
  { month: 'Nov', value: 74 },
  { month: 'Dec', value: 78 },
  { month: 'Jan', value: 82 },
  { month: 'Feb', value: 85 },
];

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Profile Info */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-punchy-yellow p-1">
              <img src="https://i.pravatar.cc/150?u=user123" className="w-full h-full rounded-xl object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-royal-blue text-white p-1 rounded-lg border-2 border-carbon-black">
              <Crown size={12} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase">Alex Johnson</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase bg-white/10 px-2 py-0.5 rounded-full text-gray-400">Elite Member</span>
              <span className="text-[10px] font-bold uppercase text-punchy-yellow flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                4,250 PTS
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => alert("Settings are under construction!")}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame, label: 'Streak', value: '12', unit: 'Days', color: 'text-orange-500' },
          { icon: Trophy, label: 'Workouts', value: '48', unit: 'Total', color: 'text-punchy-yellow' },
          { icon: Target, label: 'Goal', value: '85', unit: '% Complete', color: 'text-royal-blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center">
            <stat.icon size={18} className={`${stat.color} mb-1`} />
            <span className="text-lg font-black">{stat.value}</span>
            <span className="text-[8px] font-bold uppercase text-gray-500 tracking-tighter">{stat.unit}</span>
          </div>
        ))}
      </section>

      {/* Performance Analytics */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black uppercase italic tracking-wider">Strength Progress</h3>
          <button className="text-[10px] font-bold uppercase text-royal-blue flex items-center gap-1">
            Analyze Details <ChevronRight size={12} />
          </button>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PROGRESS_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4169E1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4169E1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }}
              />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#FFD700' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4169E1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-[10px] text-center text-gray-500 uppercase font-bold tracking-widest">
          +18% Gains since September
        </p>
      </section>

      {/* Badges Gallery */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase italic tracking-wider flex justify-between">
          Achievement Badges
          <span className="text-[10px] text-gray-500 font-bold uppercase">12 / 24</span>
        </h3>
        <div className="flex justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 1, label: 'Morning Grind', icon: '☀️' },
            { id: 2, label: 'Consistency King', icon: '👑' },
            { id: 3, label: 'Heavy Lifter', icon: '💪' },
            { id: 4, label: 'Community Hero', icon: '🤝' },
          ].map((badge) => (
            <div key={badge.id} className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-2 relative group cursor-pointer">
                {badge.icon}
                <div className="absolute inset-0 bg-punchy-yellow/20 rounded-full scale-0 group-hover:scale-100 transition-transform" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase text-center leading-tight">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary Actions */}
      <section className="space-y-3">
        <button
          onClick={() => alert("Invite link copied to clipboard!")}
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group active:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-royal-blue/20 text-royal-blue rounded-lg">
              <Share2 size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Refer a Friend</span>
          </div>
          <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
        </button>
        <button
          onClick={() => alert("Rewards Store coming soon!")}
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group active:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
              <Flame size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Points Marketplace</span>
          </div>
          <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={onLogout}
          className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-center gap-2 group active:bg-red-500/20 transition-colors mt-6"
        >
          <LogOut size={18} className="text-red-500" />
          <span className="text-sm font-bold uppercase tracking-wider text-red-500">Sign Out</span>
        </button>
      </section>
    </div>
  );
};

export default Profile;
