
import React from 'react';

interface TrafficGaugeProps {
  percentage: number; // 0 to 100
}

const TrafficGauge: React.FC<TrafficGaugeProps> = ({ percentage }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let status = "Low Traffic";
  let colorClass = "text-green-400";
  let strokeColor = "#4ade80";

  if (percentage > 75) {
    status = "Very Busy";
    colorClass = "text-red-500";
    strokeColor = "#ef4444";
  } else if (percentage > 40) {
    status = "Moderate";
    colorClass = "text-punchy-yellow";
    strokeColor = "#FFD700";
  }

  return (
    <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-90">
          <span className="text-2xl font-black text-white">{percentage}%</span>
        </div>
      </div>
      <div className={`mt-4 text-sm font-bold uppercase tracking-widest ${colorClass}`}>
        {status}
      </div>
      <div className="mt-1 text-[10px] text-gray-400">Calculated via Smart Pass</div>
    </div>
  );
};

export default TrafficGauge;
