import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader, ScanLine } from 'lucide-react';

interface AnalyzedFood {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    message?: string;
}

interface NutritionVisionProps {
    onClose: () => void;
    onLog: (food: AnalyzedFood) => void;
}

const NutritionVision: React.FC<NutritionVisionProps> = ({ onClose, onLog }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalyzedFood | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simulate Analysis
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                name: "Grilled Chicken Salad",
                calories: 420,
                protein: 35,
                carbs: 12,
                fats: 22,
                message: "Excellent source of lean protein!"
            });
        }, 2500);
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl">
                {/* Header */}
                <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <ScanLine className="text-punchy-yellow" size={20} />
                        <h3 className="font-black italic text-white uppercase">Nutrition Vision</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {analyzing ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 relative overflow-hidden rounded-2xl border border-punchy-yellow/30 bg-punchy-yellow/5">
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,#FACC15_50%,transparent_100%)] opacity-10 animate-scan" style={{ height: '200%', top: '-50%' }} />
                            <Loader className="text-punchy-yellow animate-spin" size={40} />
                            <p className="text-xs font-bold uppercase tracking-widest text-punchy-yellow animate-pulse">Analyzing Composition...</p>
                        </div>
                    ) : result ? (
                        <div className="space-y-6 animate-slideUp">
                            <div className="text-center space-y-2">
                                <div className="w-full h-32 bg-white/5 rounded-2xl mb-4 flex items-center justify-center border border-white/10">
                                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover rounded-2xl opacity-80" />
                                </div>
                                <h2 className="text-2xl font-black italic text-white uppercase">{result.name}</h2>
                                <p className="text-green-400 text-xs font-bold uppercase">{result.message}</p>
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-white/5 p-2 rounded-xl">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Cal</div>
                                    <div className="text-lg font-black text-white">{result.calories}</div>
                                </div>
                                <div className="bg-white/5 p-2 rounded-xl">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Pro</div>
                                    <div className="text-lg font-black text-blue-400">{result.protein}g</div>
                                </div>
                                <div className="bg-white/5 p-2 rounded-xl">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Carb</div>
                                    <div className="text-lg font-black text-yellow-400">{result.carbs}g</div>
                                </div>
                                <div className="bg-white/5 p-2 rounded-xl">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Fat</div>
                                    <div className="text-lg font-black text-red-400">{result.fats}g</div>
                                </div>
                            </div>

                            <button
                                onClick={() => onLog(result)}
                                className="w-full bg-punchy-yellow text-black font-black uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors"
                            >
                                <Check size={20} />
                                Log Meal
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-64 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-punchy-yellow/50 hover:bg-white/5 transition-all group"
                            >
                                <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                                    <Camera size={32} className="text-gray-400 group-hover:text-punchy-yellow" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-white uppercase">Tap to Capture</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">or upload from gallery</p>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionVision;
