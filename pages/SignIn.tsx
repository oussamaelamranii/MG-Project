
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, User, Loader2 } from 'lucide-react';

interface SignInProps {
    onLogin: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onLogin }) => {
    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulated API Call
        setTimeout(() => {
            if (memberId.length > 3 && password.length > 3) {
                onLogin();
            } else {
                setError('Invalid Member ID or Password');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-[100dvh] bg-black flex flex-col p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[40%] bg-punchy-yellow/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] left-[-20%] w-[80%] h-[40%] bg-royal-blue/10 blur-[80px] rounded-full pointer-events-none" />

            {/* spacer to push content down (Mobile Friendly) */}
            <div className="flex-1 flex flex-col justify-center items-center pb-10">
                <div className="text-center animate-fadeIn">
                    <div className="inline-block p-5 bg-white/5 rounded-full mb-6 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                        <h1 className="text-5xl font-black italic text-punchy-yellow tracking-tighter">MG</h1>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-wide uppercase leading-none">Member<br /> Access</h2>
                </div>
            </div>

            <div className="w-full max-w-sm mx-auto z-10 pb-8 safe-area-bottom">
                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4 animate-slideUp">
                    {/* Member ID Input */}
                    <div className="group space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Member ID</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-punchy-yellow transition-colors">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                inputMode="text"
                                autoComplete="username"
                                enterKeyHint="next"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder="MG-0000"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-punchy-yellow/50 focus:bg-white/10 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="group space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-punchy-yellow transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                inputMode="text"
                                autoComplete="current-password"
                                enterKeyHint="go"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-punchy-yellow/50 focus:bg-white/10 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold">
                            {error}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-punchy-yellow text-black font-black uppercase tracking-wider py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_4px_30px_rgba(255,215,0,0.25)] disabled:opacity-50 disabled:pointer-events-none text-base mt-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Enter Club
                                <ArrowRight size={24} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pb-2">
                    <div className="flex items-center justify-center gap-2 text-gray-600 text-[10px] uppercase tracking-wider mb-2">
                        <ShieldCheck size={12} />
                        Secure Connection • MGCLUB-NET
                    </div>
                    <button type="button" className="text-gray-500 text-[11px] font-medium py-2 px-4 active:text-white transition-colors">
                        Forgot credentials?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
