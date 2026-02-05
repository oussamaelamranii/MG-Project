import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Crown, Users, Loader2 } from 'lucide-react';
import { challengesApi, leaderboardApi, ApiChallenge, ApiUser } from '../utils/api';

interface ArenaProps {
    userId: string;
    onBack: () => void;
}

interface DisplayLeaderboardEntry {
    id: string;
    name: string;
    points: number;
    tier: string;
    avatar: string;
}

interface DisplayChallenge {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    participants: number;
    reward: string;
    image: string;
}

const MOCK_LEADERBOARD: DisplayLeaderboardEntry[] = [
    { id: '1', name: 'Alex Titan', points: 12500, tier: 'Diamond', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { id: '2', name: 'Sarah Lift', points: 11200, tier: 'Platinum', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '3', name: 'Mike Power', points: 10800, tier: 'Gold', avatar: 'https://i.pravatar.cc/150?u=mike' },
    { id: '4', name: 'Jenny Fit', points: 9500, tier: 'Gold', avatar: 'https://i.pravatar.cc/150?u=jenny' },
    { id: '5', name: 'Chris Cross', points: 9100, tier: 'Silver', avatar: 'https://i.pravatar.cc/150?u=chris' },
];

const MOCK_CHALLENGES: DisplayChallenge[] = [
    { id: '1', title: '500 Pushup Week', description: 'Complete 500 pushups in 7 days.', difficulty: 'Medium', participants: 432, reward: '500 XP', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300' },
    { id: '2', title: 'Everest Run', description: 'Run a total elevation of 8,848m this month.', difficulty: 'Elite', participants: 120, reward: 'Legacy Badge', image: 'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&q=80&w=300' },
    { id: '3', title: 'Morning Glory', description: 'Check in before 7am, 5 days in a row.', difficulty: 'Easy', participants: 890, reward: 'Early Bird Title', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=300' },
];

const Arena: React.FC<ArenaProps> = ({ userId, onBack }) => {
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');
    const [leaderboard, setLeaderboard] = useState<DisplayLeaderboardEntry[]>([]);
    const [challenges, setChallenges] = useState<DisplayChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [joiningChallenge, setJoiningChallenge] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [apiLeaderboard, apiChallenges] = await Promise.all([
                leaderboardApi.get(10),
                challengesApi.getAll()
            ]);

            if (apiLeaderboard.length > 0) {
                setLeaderboard(apiLeaderboard.map(u => ({
                    id: u.id,
                    name: u.name,
                    points: u.points,
                    tier: u.tier,
                    avatar: u.avatarUrl || `https://i.pravatar.cc/150?u=${u.id}`,
                })));
            } else {
                setLeaderboard(MOCK_LEADERBOARD);
            }

            if (apiChallenges.length > 0) {
                setChallenges(apiChallenges.map(c => ({
                    id: c.id,
                    title: c.title,
                    description: c.description,
                    difficulty: c.difficulty,
                    participants: c.participantsCount || 0,
                    reward: c.reward,
                    image: c.imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
                })));
            } else {
                setChallenges(MOCK_CHALLENGES);
            }
        } catch (err) {
            console.warn('API unavailable, using mock data');
            setLeaderboard(MOCK_LEADERBOARD);
            setChallenges(MOCK_CHALLENGES);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinChallenge = async (challengeId: string) => {
        setJoiningChallenge(challengeId);
        try {
            await challengesApi.join(challengeId, userId);
            setChallenges(prev => prev.map(c =>
                c.id === challengeId
                    ? { ...c, participants: c.participants + 1 }
                    : c
            ));
            alert('Challenge accepted! Good luck!');
        } catch (err) {
            alert('You may have already joined this challenge.');
        } finally {
            setJoiningChallenge(null);
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Diamond': return 'text-cyan-400 border-cyan-400 bg-cyan-400/10';
            case 'Platinum': return 'text-violet-400 border-violet-400 bg-violet-400/10';
            case 'Gold': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
            case 'Silver': return 'text-gray-400 border-gray-400 bg-gray-400/10';
            case 'Elite': return 'text-purple-400 border-purple-400 bg-purple-400/10';
            default: return 'text-orange-400 border-orange-400 bg-orange-400/10';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header */}
            <header className="flex items-center gap-4 py-2">
                <button
                    onClick={onBack}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl active:scale-95 transition-transform backdrop-blur-md border border-white/10"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <div>
                    <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 animate-slideInRight tracking-tighter">
                        THE ARENA
                    </h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] animate-fadeIn" style={{ animationDelay: '200ms' }}>
                        Compete • Conquer • Ascend
                    </p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex bg-[#121212]/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 mx-1">
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'leaderboard' ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]' : 'text-gray-500 hover:text-white'
                        }`}
                >
                    Leaderboard
                </button>
                <button
                    onClick={() => setActiveTab('challenges')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'challenges' ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]' : 'text-gray-500 hover:text-white'
                        }`}
                >
                    Challenges
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-punchy-yellow" size={32} />
                </div>
            ) : (
                <div className="space-y-6 px-1">
                    {activeTab === 'leaderboard' ? (
                        <div className="space-y-8 animate-slideUp">
                            {/* Top 3 Podium */}
                            {leaderboard.length >= 3 && (
                                <div className="flex justify-center items-end gap-3 h-52 py-6">
                                    {/* 2nd Place */}
                                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{ animationDelay: '100ms' }}>
                                        <div className="relative">
                                            <img src={leaderboard[1].avatar} className="w-16 h-16 rounded-2xl border-2 border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.3)]" />
                                            <div className="absolute -bottom-3 translate-x-1/2 right-1/2 bg-slate-300 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg">2</div>
                                        </div>
                                        <div className="h-28 w-20 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-2xl border-t border-slate-500/30 flex items-end justify-center pb-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                            <span className="font-black text-2xl text-slate-300 italic">#2</span>
                                        </div>
                                    </div>

                                    {/* 1st Place */}
                                    <div className="flex flex-col items-center gap-3 z-10 animate-slideUp">
                                        <div className="relative group cursor-pointer">
                                            <Crown size={28} className="text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                            <img src={leaderboard[0].avatar} className="w-20 h-20 rounded-2xl border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-transform group-hover:scale-105" />
                                            <div className="absolute -bottom-3 translate-x-1/2 right-1/2 bg-yellow-400 text-black text-xs font-black px-3 py-0.5 rounded-full shadow-lg">1</div>
                                        </div>
                                        <div className="h-36 w-24 bg-gradient-to-t from-yellow-900/60 to-yellow-600/20 rounded-t-2xl border-t border-yellow-500/50 flex items-end justify-center pb-4 shadow-[0_4px_30px_rgba(250,204,21,0.1)] backdrop-blur-md">
                                            <span className="font-black text-4xl text-yellow-400 italic">#1</span>
                                        </div>
                                    </div>

                                    {/* 3rd Place */}
                                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{ animationDelay: '200ms' }}>
                                        <div className="relative">
                                            <img src={leaderboard[2].avatar} className="w-16 h-16 rounded-2xl border-2 border-orange-700 shadow-[0_0_20px_rgba(194,65,12,0.3)]" />
                                            <div className="absolute -bottom-3 translate-x-1/2 right-1/2 bg-orange-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg">3</div>
                                        </div>
                                        <div className="h-24 w-20 bg-gradient-to-t from-orange-950 to-orange-900/50 rounded-t-2xl border-t border-orange-700/30 flex items-end justify-center pb-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                            <span className="font-black text-2xl text-orange-700 italic">#3</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* List */}
                            <div className="space-y-3">
                                {leaderboard.slice(3).map((user, index) => (
                                    <div
                                        key={user.id}
                                        style={{ animationDelay: `${index * 50 + 300}ms` }}
                                        className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex items-center justify-between animate-slideUp hover:border-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-600 font-bold w-6 text-sm">#{index + 4}</span>
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl" />
                                            <div>
                                                <h3 className="font-bold text-sm text-white">{user.name}</h3>
                                                <p className={`text-[9px] font-black uppercase mt-1 px-2 py-0.5 rounded-md inline-block border ${getTierColor(user.tier)}`}>{user.tier}</p>
                                            </div>
                                        </div>
                                        <div className="font-black italic text-white/90 text-sm">{user.points.toLocaleString()} <span className="text-[10px] font-bold text-gray-500 not-italic">XP</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {challenges.map((challenge, index) => (
                                <div
                                    key={challenge.id}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group animate-slideUp hover:border-white/20 transition-all shadow-lg"
                                >
                                    <div className="h-40 relative overflow-hidden">
                                        <img src={challenge.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75 group-hover:brightness-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />

                                        <div className="absolute bottom-4 left-5">
                                            <h3 className="font-black text-2xl text-white italic tracking-tight">{challenge.title}</h3>
                                        </div>

                                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${challenge.difficulty === 'Elite' ? 'text-red-500' :
                                                challenge.difficulty === 'Medium' || challenge.difficulty === 'Hard' ? 'text-yellow-500' : 'text-green-500'
                                                }`}>{challenge.difficulty}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <p className="text-sm text-gray-300 leading-relaxed font-medium">{challenge.description}</p>

                                        <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-gray-500" />
                                                <span className="text-white">{challenge.participants}</span> Challengers
                                            </div>
                                            <div className="flex items-center gap-2 text-punchy-yellow">
                                                <Trophy size={16} />
                                                {challenge.reward}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleJoinChallenge(challenge.id)}
                                            disabled={joiningChallenge === challenge.id}
                                            className="w-full bg-white text-black font-black uppercase py-4 rounded-xl tracking-[0.2em] hover:bg-punchy-yellow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 text-xs shadow-lg"
                                        >
                                            {joiningChallenge === challenge.id ? (
                                                <Loader2 size={18} className="animate-spin mx-auto" />
                                            ) : (
                                                'Accept & Compete'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Arena;
