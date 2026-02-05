import React from 'react';
import { Trophy, Settings, Flame, Star, Target, ChevronRight, Share2, Crown, LogOut } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiUser } from '../utils/api';

const PROGRESS_DATA = [
  { month: 'Sep', value: 72 },
  { month: 'Oct', value: 75 },
  { month: 'Nov', value: 74 },
  { month: 'Dec', value: 78 },
  { month: 'Jan', value: 82 },
  { month: 'Feb', value: 85 },
];

interface ProfileProps {
  user: ApiUser;
  onLogout: () => void;
}

const getTierLabel = (tier: string): string => {
  const tierMap: Record<string, string> = {
    'Bronze': 'Bronze Member',
    'Silver': 'Silver Member',
    'Gold': 'Gold Member',
    'Elite': 'Elite Member',
  };
  return tierMap[tier] || 'Member';
};

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Header Profile Info */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-punchy-yellow/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-punchy-yellow to-orange-500 p-0.5 relative z-10 transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`}
                className="w-full h-full rounded-2xl object-cover border-2 border-black"
                alt={user.name}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-royal-blue text-white p-1.5 rounded-lg border-2 border-[#121212] flex items-center justify-center shadow-lg z-20">
              <Crown size={14} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase bg-white/10 border border-white/5 px-2.5 py-1 rounded-md text-gray-300 tracking-wider">
                {getTierLabel(user.tier)}
              </span>
              <span className="text-[10px] font-bold uppercase text-punchy-yellow flex items-center gap-1 bg-punchy-yellow/10 px-2.5 py-1 rounded-md border border-punchy-yellow/20 tracking-wider">
                <Star size={10} fill="currentColor" />
                {user.points.toLocaleString()} PTS
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => alert("Settings are under construction!")}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings size={22} />
        </button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-3 gap-3 animate-slideUp" style={{ animationDelay: '100ms' }}>
        {[
          { icon: Flame, label: 'Streak', value: user.streakDays.toString(), unit: 'Days', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
          { icon: Trophy, label: 'Workouts', value: '48', unit: 'Total', color: 'text-punchy-yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { icon: Target, label: 'Goal', value: '85', unit: '% Complete', color: 'text-royal-blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`bg-[#121212]/60 backdrop-blur-xl border ${stat.border} rounded-3xl p-4 flex flex-col items-center text-center relative overflow-hidden group hover:bg-white/5 transition-colors`}>
            <div className={`absolute inset-0 ${stat.bg} opacity-20 group-hover:opacity-30 transition-opacity`} />
            <stat.icon size={20} className={`${stat.color} mb-2 relative z-10`} />
            <span className="text-2xl font-black italic text-white relative z-10">{stat.value}</span>
            <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest relative z-10">{stat.unit}</span>
          </div>
        ))}
      </section>

      {/* Performance Analytics */}
      <section className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 animate-slideUp relative overflow-hidden" style={{ animationDelay: '200ms' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-royal-blue/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-sm font-black uppercase italic tracking-wider text-white">Strength Progress</h3>
          <button className="text-[10px] font-bold uppercase text-royal-blue flex items-center gap-1 hover:text-blue-400 transition-colors">
            Analyze Details <ChevronRight size={12} />
          </button>
        </div>
        <div className="h-48 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PROGRESS_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4169E1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4169E1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }}
              />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#000000CC', border: '1px solid #333', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#888', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
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
        <div className="mt-4 flex justify-center relative z-10">
          <span className="text-[10px] text-green-500 uppercase font-bold tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            +18% Gains since September
          </span>
        </div>
      </section>

      {/* Badges Gallery */}
      <section className="space-y-4 animate-slideUp" style={{ animationDelay: '300ms' }}>
        <h3 className="text-sm font-black uppercase italic tracking-wider flex justify-between px-2 text-white">
          Achievement Badges
          <span className="text-[10px] text-gray-500 font-bold uppercase">12 / 24</span>
        </h3>
        <div className="flex justify-between gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
          {[
            { id: 1, label: 'Morning Grind', icon: '☀️', color: 'text-amber-400' },
            { id: 2, label: 'Consistency King', icon: '👑', color: 'text-yellow-400' },
            { id: 3, label: 'Heavy Lifter', icon: '💪', color: 'text-red-400' },
            { id: 4, label: 'Community Hero', icon: '🤝', color: 'text-blue-400' },
          ].map((badge) => (
            <div key={badge.id} className="flex flex-col items-center min-w-[84px] group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-[#121212]/60 border border-white/10 flex items-center justify-center text-3xl mb-2 relative overflow-hidden transition-all group-hover:border-white/30 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <span className="relative z-10 group-hover:scale-110 transition-transform">{badge.icon}</span>
                <div className={`absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              <span className="text-[9px] font-bold text-gray-500 uppercase text-center leading-tight group-hover:text-white transition-colors">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary Actions */}
      <section className="space-y-3 animate-slideUp" style={{ animationDelay: '400ms' }}>
        <button
          onClick={() => alert("Invite link copied to clipboard!")}
          className="w-full bg-[#121212]/60 hover:bg-[#121212] backdrop-blur-xl border border-white/5 hover:border-white/10 p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-royal-blue/10 text-royal-blue rounded-xl border border-royal-blue/20">
              <Share2 size={20} />
            </div>
            <span className="text-sm font-black uppercase tracking-wider text-white">Refer a Friend</span>
          </div>
          <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
        </button>
        <button
          onClick={() => alert("Rewards Store coming soon!")}
          className="w-full bg-[#121212]/60 hover:bg-[#121212] backdrop-blur-xl border border-white/5 hover:border-white/10 p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20">
              <Flame size={20} />
            </div>
            <span className="text-sm font-black uppercase tracking-wider text-white">Points Marketplace</span>
          </div>
          <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={onLogout}
          className="w-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center justify-center gap-3 group active:scale-[0.98] transition-all mt-6 cursor-pointer"
        >
          <LogOut size={20} className="text-red-500 group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-black uppercase tracking-wider text-red-500 group-hover:text-red-400 transition-colors">Sign Out</span>
        </button>
      </section>
    </div>
  );
};

export default Profile;
