import React from 'react';
import { Zap, Trophy, TrendingUp, ShoppingBag, QrCode, Calculator, Activity } from 'lucide-react';
import TrafficGauge from '../components/TrafficGauge';
import CalorieCalculator from '../components/CalorieCalculator';
import { gymApi } from '../utils/api';
import { Page } from '../types';

interface HomeProps {
  onOpenSmartPass: () => void;
  onNavigate: (page: Page) => void;
  userId?: string;
}

const Home: React.FC<HomeProps> = ({ onOpenSmartPass, onNavigate, userId }) => {
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [traffic, setTraffic] = React.useState<number>(32);
  const [forecast, setForecast] = React.useState<{ occupancy: number }[]>([
    { occupancy: 20 }, { occupancy: 40 }, { occupancy: 60 }, { occupancy: 90 },
    { occupancy: 80 }, { occupancy: 50 }, { occupancy: 30 }
  ]);
  const [peakHour, setPeakHour] = React.useState('6pm');

  React.useEffect(() => {
    const loadGymData = async () => {
      try {
        const trafficData = await gymApi.getTraffic();
        setTraffic(trafficData.percentage);
        const forecastData = await gymApi.getForecast();
        const slots = forecastData.forecast.filter((_, i) => i % 2 === 0).slice(0, 7);
        setForecast(slots.map(s => ({ occupancy: s.occupancy })));
        setPeakHour(forecastData.peakHour);
      } catch (err) {
        console.warn('Gym API unavailable, using mock data');
      }
    };
    loadGymData();
    const interval = setInterval(loadGymData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 animate-slideInRight">
            MGCLUB
          </h1>
          <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] animate-fadeIn" style={{ animationDelay: '200ms' }}>
            Performance Partner
          </p>
        </div>
        <button
          onClick={onOpenSmartPass}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:scale-95 transition-all animate-scaleIn"
          style={{ animationDelay: '300ms' }}
        >
          <QrCode size={28} className="text-white" />
        </button>
      </header>

      {/* Hero Quick Action */}
      <section
        className="relative overflow-hidden rounded-[2rem] p-8 group cursor-pointer border border-white/5 animate-slideUp"
        style={{ animationDelay: '100ms' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90 transition-opacity group-hover:opacity-100" />
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-gradient-to-b from-white/10 to-transparent rotate-12 blur-2xl" />

        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 flex items-center gap-2">
              <Activity size={12} /> Next Workout
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-black italic text-white leading-none tracking-tight mb-1">CHEST &<br />SHOULDERS</h2>
            <p className="text-blue-200 text-xs font-medium">Protocol A • 45 mins</p>
          </div>
          <button
            onClick={() => alert("Workout started!")}
            className="bg-white text-blue-900 font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_30px_rgba(30,58,138,0.4)] active:scale-95 transition-all hover:bg-blue-50"
          >
            <Zap size={16} className="fill-blue-900" />
            Start Session
          </button>
        </div>
      </section>

      {/* Real-time Traffic */}
      <section className="animate-slideUp" style={{ animationDelay: '200ms' }}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
          Live Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrafficGauge percentage={traffic} />
          <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div>
              <h4 className="font-bold text-sm uppercase text-gray-200 tracking-wider">Forecast</h4>
              <p className="text-[10px] text-gray-500 uppercase mt-1">Peak: <span className="text-white font-bold">{peakHour}</span></p>
            </div>
            <div className="flex items-end justify-between gap-1 h-20 mt-4">
              {forecast.map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-sm transition-all duration-700 hover:opacity-80 ${h.occupancy > 70 ? 'bg-gradient-to-t from-red-600 to-red-400' : 'bg-gradient-to-t from-orange-500 to-yellow-400'}`}
                  style={{ height: `${h.occupancy}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-gray-600 mt-2 uppercase tracking-wider font-bold">
              <span>6am</span>
              <span>12pm</span>
              <span>8pm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Community Feed */}
      <section className="space-y-4 animate-slideUp" style={{ animationDelay: '300ms' }}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1 flex justify-between items-center">
          Community Highlight
          <span className="text-orange-500 text-[10px] cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate(Page.COMMUNITY)}>View Tribe</span>
        </h3>
        <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group cursor-pointer hover:border-orange-500/30 transition-all">
          <div className="relative h-48 overflow-hidden">
            <img
              src="https://picsum.photos/seed/mgclub/800/400"
              alt="Community event"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <div className="p-1 rounded-full border border-orange-500 bg-black/50 backdrop-blur-sm">
                <img src="https://i.pravatar.cc/150?u=coach" className="w-8 h-8 rounded-full" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Coach Marco</p>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider">Head Coach • 2h ago</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              New CrossTraining equipment arriving this Friday! Get ready for a high-intensity weekend. <span className="text-white">#BeUnstoppable</span>
            </p>
          </div>
        </div>
      </section>

      {/* Arena Card */}
      <section
        className="relative overflow-hidden rounded-[2.5rem] h-52 group cursor-pointer border border-white/5 animate-slideUp"
        style={{ animationDelay: '400ms' }}
        onClick={() => onNavigate(Page.ARENA)}
      >
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Arena Background" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/40 to-transparent" />
        <div className="relative z-10 p-8 flex flex-col justify-center h-full items-start">
          <div className="bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-yellow-400/30 mb-3 flex items-center gap-2">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Weekly Challenge</span>
          </div>
          <h3 className="text-3xl font-black italic text-white leading-none mb-1 tracking-tight">ENTER THE<br />ARENA</h3>
          <p className="text-gray-300 text-xs mb-6 font-medium">Compete • Earn • Dominate</p>
          <button className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all">
            View Leaderboard
          </button>
        </div>
      </section>

      {/* Tools Section (Compact Grid) */}
      <section className="grid grid-cols-2 gap-4 pb-12 animate-slideUp" style={{ animationDelay: '500ms' }}>
        <button
          onClick={() => setShowCalculator(true)}
          className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-3xl p-5 flex flex-col items-start gap-4 transition-all group"
        >
          <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform ring-1 ring-inset ring-purple-500/20">
            <Calculator size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Calorie<br />Estimator</h4>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Plan Macros</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate(Page.SHOP)}
          className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/40 rounded-3xl p-5 flex flex-col items-start gap-4 transition-all group relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/20 blur-2xl rounded-full" />
          <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform shadow-orange-500/20">
            <ShoppingBag size={24} />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-sm text-white">Refuel<br />Station</h4>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Supps & Gear</p>
          </div>
        </button>
      </section>

      {showCalculator && <CalorieCalculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
};

export default Home;
