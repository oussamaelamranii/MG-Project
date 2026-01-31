
import React from 'react';
import { Zap, Trophy, TrendingUp, ShoppingBag, QrCode, Calculator } from 'lucide-react';
import TrafficGauge from '../components/TrafficGauge';
import CalorieCalculator from '../components/CalorieCalculator';

import { Page } from '../types';

interface HomeProps {
  onOpenSmartPass: () => void;
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onOpenSmartPass, onNavigate }) => {
  const [showCalculator, setShowCalculator] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic text-punchy-yellow flex items-center gap-2">
            MGCLUB
          </h1>
          <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">Performance Partner</p>
        </div>
        <button
          onClick={onOpenSmartPass}
          className="bg-punchy-yellow text-black p-3 rounded-2xl shadow-[0_4px_20px_rgba(255,215,0,0.3)] active:scale-95 transition-transform"
        >
          <QrCode size={28} />
        </button>
      </header>

      {/* Hero Quick Action */}
      <section className="bg-royal-blue rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-[-20px] right-[-20px] bg-white/10 w-40 h-40 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black leading-tight">CONTINUE YOUR<br />PERFORMANCE.</h2>
          <p className="text-white/70 text-sm mt-2">Next up: Chest & Shoulders</p>
          <button
            onClick={() => alert("Workout started! Tracking module initiated.")}
            className="mt-6 bg-white text-royal-blue font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Zap size={18} fill="currentColor" />
            Start Workout
          </button>
        </div>
        <div className="absolute bottom-[-10px] right-[-10px] opacity-20 transform rotate-[-15deg] group-hover:scale-110 transition-transform">
          <TrendingUp size={120} />
        </div>
      </section>

      {/* Real-time Traffic */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Gym Traffic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrafficGauge percentage={32} />
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <h4 className="font-bold text-sm uppercase text-royal-blue">Peak Hour Forecast</h4>
            <div className="flex items-end justify-between gap-1 h-20 mt-4">
              {[20, 40, 60, 90, 80, 50, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-md transition-all duration-500 ${h > 70 ? 'bg-red-500/50' : 'bg-punchy-yellow/50'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-gray-500 mt-2 uppercase tracking-tighter">
              <span>6am</span>
              <span>12pm</span>
              <span>8pm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Community Feed */}
      <section className="space-y-4 pb-12">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex justify-between items-center">
          The MG Tribe
          <span className="text-royal-blue text-[10px] underline">View All</span>
        </h3>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <img
            src="https://picsum.photos/seed/mgclub/600/300"
            alt="Community event"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <img src="https://i.pravatar.cc/150?u=coach" className="w-8 h-8 rounded-full border border-punchy-yellow" />
              <div>
                <p className="text-xs font-bold">Coach Marco</p>
                <p className="text-[10px] text-gray-500 uppercase">Head Coach • 2h ago</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              New CrossTraining equipment arriving this Friday! Get ready for a high-intensity weekend. 🏋️‍♂️🔥
            </p>
          </div>
        </div>
      </section>

      {/* Arena Card */}
      <section className="relative overflow-hidden rounded-3xl h-48 group cursor-pointer" onClick={() => onNavigate(Page.ARENA)}>
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Arena Background" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent" />
        <div className="relative z-10 p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">Weekly Challenge</span>
          </div>
          <h3 className="text-2xl font-black italic text-white leading-none mb-4">ENTER THE<br />ARENA</h3>
          <button className="bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest self-start shadow-lg active:scale-95 transition-transform">
            View Leaderboard
          </button>
        </div>
      </section>

      {/* Tools Section */}
      <section className="pb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Performance Tools</h3>
        <button
          onClick={() => setShowCalculator(true)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between active:bg-white/10 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <Calculator size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-base text-white">Calorie Estimator</h4>
              <p className="text-xs text-gray-400">Calculate BMR & TDEE targets</p>
            </div>
          </div>
          <div className="bg-white/10 p-2 rounded-full">
            <TrendingUp size={16} />
          </div>
        </button>
      </section>

      {/* Click & Collect Teaser */}
      <section className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500 rounded-xl text-white">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Fuel Station</h4>
            <p className="text-[10px] text-gray-400">Order your post-workout shake now</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(Page.SHOP)}
          className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest active:bg-white/20"
        >
          Shop
        </button>
      </section>
      {showCalculator && <CalorieCalculator onClose={() => setShowCalculator(false)} />}
    </div >
  );
};

export default Home;
