import React from 'react';

interface FuelGaugeProps {
    current: number;
    target: number;
}

const FuelGauge: React.FC<FuelGaugeProps> = ({ current, target }) => {
    // Calculate percentage, capped at 100 for the bar, but logic allows overfill
    const percentage = Math.min((current / target) * 100, 100);
    const isSurplus = current > target;

    // Color logic: Green (Deficit/On Track) -> Yellow (Close) -> Red (Surplus)
    const getColor = () => {
        if (isSurplus) return 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
        if (percentage > 90) return 'text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]';
        return 'text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]';
    };

    const getBarColor = () => {
        if (isSurplus) return 'bg-red-500';
        if (percentage > 90) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 relative overflow-hidden group">
            <div className="flex justify-between items-end mb-2 relative z-10">
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Daily Fuel</h3>
                    <div className={`text-2xl font-black italic transition-all duration-500 ${getColor()}`}>
                        {current} <span className="text-xs text-white/50 font-bold not-italic">/ {target} kcal</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${isSurplus ? 'border-red-500/30 bg-red-500/10 text-red-500' : 'border-green-500/30 bg-green-500/10 text-green-500'}`}>
                        {Math.round((current / target) * 100)}%
                    </span>
                </div>
            </div>

            {/* Bar Container */}
            <div className="h-4 bg-white/5 rounded-full overflow-hidden relative z-10 p-1">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
                    style={{ width: `${percentage}%` }}
                >
                    <div className="w-full h-full bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
                </div>
            </div>

            {/* Background Visuals */}
            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl italic pointer-events-none select-none">
                %
            </div>
        </div>
    );
};

export default FuelGauge;
