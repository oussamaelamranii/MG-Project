import React, { useState } from 'react';
import { X, Activity, Calculator, Flame, TrendingDown, TrendingUp, Scan, Camera } from 'lucide-react';
import FuelGauge from './FuelGauge';
import NutritionVision from './NutritionVision';

interface CalorieCalculatorProps {
    onClose: () => void;
}

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({ onClose }) => {
    const [gender, setGender] = useState<Gender>('male');
    const [age, setAge] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [activity, setActivity] = useState<ActivityLevel>('moderate');

    const [result, setResult] = useState<number | null>(null);
    const [showVision, setShowVision] = useState(false);
    const [currentCalories, setCurrentCalories] = useState(0); // Mock current daily intak

    // Mock handler for logging from Vision
    const handleLogFood = (food: any) => {
        setCurrentCalories(prev => prev + food.calories);
        setShowVision(false);
        // In real app, would call backend API here
    };

    const calculateCalories = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseFloat(age);

        if (!w || !h || !a) return;

        // Mifflin-St Jeor Equation
        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
        setResult(Math.round(tdee));
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn">
            <div className="bg-[#121212] w-full max-w-md rounded-t-3xl md:rounded-3xl border-t md:border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-royal-blue/20 to-transparent flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-royal-blue p-2 rounded-xl text-white">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic text-white leading-none">CALORIE</h2>
                            <p className="text-xs font-bold text-royal-blue uppercase tracking-widest">Estimator</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowVision(true)}
                            className="bg-punchy-yellow text-black px-3 py-2 rounded-xl font-bold uppercase text-xs flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                        >
                            <Camera size={16} />
                            Scan Meal
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white p-2 rounded-full active:bg-white/10 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Fuel Gauge (Only shows if there is a target) */}
                    {result && (
                        <div className="animate-slideDown">
                            <FuelGauge current={currentCalories} target={result} />
                        </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-4">
                        {/* Gender Switch */}
                        <div className="bg-white/5 p-1 rounded-xl flex">
                            {(['male', 'female'] as Gender[]).map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${gender === g ? 'bg-royal-blue text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-royal-blue transition-colors appearance-none"
                                    placeholder="25"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-royal-blue transition-colors appearance-none"
                                    placeholder="75"
                                />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Height (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-royal-blue transition-colors appearance-none"
                                    placeholder="180"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Activity Level</label>
                            <div className="relative">
                                <select
                                    value={activity}
                                    onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-royal-blue transition-colors appearance-none"
                                >
                                    <option value="sedentary">Sedentary (Office job)</option>
                                    <option value="light">Light Exercise (1-2 days/week)</option>
                                    <option value="moderate">Moderate Exercise (3-5 days/week)</option>
                                    <option value="active">Heavy Exercise (6-7 days/week)</option>
                                    <option value="very_active">Athlete (2x per day)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <Activity size={16} />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={calculateCalories}
                            className="w-full bg-gradient-to-r from-royal-blue to-blue-600 p-4 rounded-xl text-white font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 mt-2"
                        >
                            <Activity size={20} />
                            Calculate
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="animate-fadeIn space-y-4 pt-4 border-t border-white/10 pb-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Flame size={100} />
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 relative z-10">Maintenance Calories</p>
                                <div className="text-5xl font-black italic text-white flex items-center justify-center gap-2 relative z-10">
                                    {result}
                                    <span className="text-base not-italic text-gray-500 font-bold">kcal</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col items-center gap-2 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                                    <div className="bg-green-500/10 p-2 rounded-full text-green-500 mb-1">
                                        <TrendingDown size={20} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Cut</p>
                                        <p className="text-xl font-bold text-white">{result - 500}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col items-center gap-2 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                                    <div className="bg-red-500/10 p-2 rounded-full text-red-500 mb-1">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Bulk</p>
                                        <p className="text-xl font-bold text-white">{result + 500}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {
                showVision && (
                    <NutritionVision
                        onClose={() => setShowVision(false)}
                        onLog={handleLogFood}
                    />
                )
            }
        </div >
    );
};

export default CalorieCalculator;
