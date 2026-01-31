import React, { useState } from 'react';
import { ArrowLeft, Trophy, Crown, Target, Users, Flame } from 'lucide-react';
import { LeaderboardEntry, Challenge } from '../types';

interface ArenaProps {
    onBack: () => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { id: '1', name: 'Alex Titan', points: 12500, tier: 'Diamond', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { id: '2', name: 'Sarah Lift', points: 11200, tier: 'Platinum', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '3', name: 'Mike Power', points: 10800, tier: 'Gold', avatar: 'https://i.pravatar.cc/150?u=mike' },
    { id: '4', name: 'Jenny Fit', points: 9500, tier: 'Gold', avatar: 'https://i.pravatar.cc/150?u=jenny' },
    { id: '5', name: 'Chris Cross', points: 9100, tier: 'Silver', avatar: 'https://i.pravatar.cc/150?u=chris' },
];

const MOCK_CHALLENGES: Challenge[] = [
    { id: '1', title: '500 Pushup Week', description: 'Complete 500 pushups in 7 days.', difficulty: 'Medium', participants: 432, reward: '500 XP', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300' },
    { id: '2', title: 'Everest Run', description: 'Run a total elevation of 8,848m this month.', difficulty: 'Elite', participants: 120, reward: 'Legacy Badge', image: 'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&q=80&w=300' },
    { id: '3', title: 'Morning Glory', description: 'Check in before 7am, 5 days in a row.', difficulty: 'Easy', participants: 890, reward: 'Early Bird Title', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=300' },
];

const Arena: React.FC<ArenaProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Diamond': return 'text-cyan-400 border-cyan-400';
            case 'Platinum': return 'text-violet-400 border-violet-400';
            case 'Gold': return 'text-yellow-400 border-yellow-400';
            case 'Silver': return 'text-gray-400 border-gray-400';
            default: return 'text-orange-400 border-orange-400';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* Header */}
            <header className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="bg-white/10 p-2 rounded-xl active:scale-95 transition-transform"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">THE ARENA</h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Compete • Conquer • Ascend</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'leaderboard' ? 'bg-[#1a1a1a] text-white shadow-lg border border-white/10' : 'text-gray-400'
                        }`}
                >
                    Leaderboard
                </button>
                <button
                    onClick={() => setActiveTab('challenges')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'challenges' ? 'bg-[#1a1a1a] text-white shadow-lg border border-white/10' : 'text-gray-400'
                        }`}
                >
                    Challenges
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'leaderboard' ? (
                    <div className="space-y-6">
                        {/* Top 3 Podium (Visual) */}
                        <div className="flex justify-center items-end gap-4 h-48 py-4">
                            {/* 2nd Place */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <img src={MOCK_LEADERBOARD[1].avatar} className="w-16 h-16 rounded-full border-2 border-slate-300" />
                                    <div className="absolute -bottom-2 translate-x-1/2 right-1/2 bg-slate-300 text-black text-[10px] font-bold px-2 rounded-full">2</div>
                                </div>
                                <div className="h-24 w-20 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-xl border-t border-slate-500/30 flex items-end justify-center pb-2">
                                    <span className="font-bold text-slate-300">#2</span>
                                </div>
                            </div>

                            {/* 1st Place */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <Crown size={24} className="text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce" />
                                    <img src={MOCK_LEADERBOARD[0].avatar} className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]" />
                                    <div className="absolute -bottom-3 translate-x-1/2 right-1/2 bg-yellow-400 text-black text-xs font-bold px-2.5 py-0.5 rounded-full">1</div>
                                </div>
                                <div className="h-32 w-24 bg-gradient-to-t from-yellow-900/40 to-yellow-800/20 rounded-t-xl border-t border-yellow-500/50 flex items-end justify-center pb-4">
                                    <span className="font-black text-xl text-yellow-400">#1</span>
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <img src={MOCK_LEADERBOARD[2].avatar} className="w-16 h-16 rounded-full border-2 border-orange-700" />
                                    <div className="absolute -bottom-2 translate-x-1/2 right-1/2 bg-orange-700 text-white text-[10px] font-bold px-2 rounded-full">3</div>
                                </div>
                                <div className="h-20 w-20 bg-gradient-to-t from-orange-950 to-orange-900/50 rounded-t-xl border-t border-orange-700/30 flex items-end justify-center pb-2">
                                    <span className="font-bold text-orange-700">#3</span>
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-3">
                            {MOCK_LEADERBOARD.slice(3).map((user, index) => (
                                <div key={user.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 font-bold w-6">{index + 4}</span>
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h3 className="font-bold text-sm text-white">{user.name}</h3>
                                            <p className={`text-[10px] font-bold uppercase ${getTierColor(user.tier).split(' ')[0]}`}>{user.tier}</p>
                                        </div>
                                    </div>
                                    <div className="font-black italic text-white/80">{user.points.toLocaleString()} <span className="text-xs font-normal text-gray-500">XP</span></div>
                                </div>
                            ))}

                            {/* Current User Rank (Sticky Mock) */}
                            <div className="fixed bottom-24 left-4 right-4 bg-[#1a1a1a] border border-royal-blue/50 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_30px_rgba(65,105,225,0.2)]">
                                <div className="flex items-center gap-4">
                                    <span className="text-white font-black w-6">12</span>
                                    <div className="w-10 h-10 rounded-full bg-royal-blue flex items-center justify-center text-white font-bold">ME</div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white">You</h3>
                                        <p className="text-[10px] font-bold uppercase text-royal-blue">Silver</p>
                                    </div>
                                </div>
                                <div className="font-black italic text-white">4,250 <span className="text-xs font-normal text-gray-500">XP</span></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {MOCK_CHALLENGES.map(challenge => (
                            <div key={challenge.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
                                <div className="h-32 relative overflow-hidden">
                                    <img src={challenge.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="font-black text-lg text-white italic">{challenge.title}</h3>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <span className={`text-[10px] font-bold uppercase ${challenge.difficulty === 'Elite' ? 'text-red-500' :
                                                challenge.difficulty === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                                            }`}>{challenge.difficulty}</span>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <p className="text-sm text-gray-400 leading-relaxed">{challenge.description}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} />
                                            {challenge.participants} Joined
                                        </div>
                                        <div className="flex items-center gap-2 text-punchy-yellow">
                                            <Trophy size={14} />
                                            {challenge.reward}
                                        </div>
                                    </div>

                                    <button className="w-full bg-white text-black font-black uppercase py-3 rounded-xl tracking-widest hover:bg-gray-200 active:scale-95 transition-all">
                                        Accept Challenge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Arena;
