import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Star, User } from 'lucide-react';
import { Supplement, Staff } from '../types';

interface ShopProps {
    onBack: () => void;
}

const MOCK_SUPPLEMENTS: Supplement[] = [
    { id: '1', name: 'Whey Isolate', price: 49.99, category: 'Protein', image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=200' },
    { id: '2', name: 'Pre-Workout X', price: 34.99, category: 'Pre-Workout', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Multivitamin', price: 19.99, category: 'Vitamins', image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200' },
    { id: '4', name: 'Lifting Straps', price: 14.99, category: 'Gear', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200' },
];

const MOCK_STAFF: Staff[] = [
    { id: '1', name: 'Coach Marco', role: 'Head Coach', image: 'https://i.pravatar.cc/150?u=coach', available: true },
    { id: '2', name: 'Sarah Fit', role: 'Nutritionist', image: 'https://i.pravatar.cc/150?u=sarah', available: false },
    { id: '3', name: 'Mike Power', role: 'PT Specialist', image: 'https://i.pravatar.cc/150?u=mike', available: true },
];

const Shop: React.FC<ShopProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'supplements' | 'staff'>('supplements');

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="bg-white/10 p-2 rounded-xl active:scale-95 transition-transform"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-black italic text-white">FUEL STATION</h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Shop & Connect</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('supplements')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'supplements' ? 'bg-orange-500 text-white' : 'text-gray-400'
                        }`}
                >
                    Supplements
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'staff' ? 'bg-punchy-yellow text-black' : 'text-gray-400'
                        }`}
                >
                    Team
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'supplements' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {MOCK_SUPPLEMENTS.map(item => (
                            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                                <div className="aspect-square rounded-xl bg-black/20 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm truncate">{item.name}</h3>
                                    <p className="text-[10px] text-gray-400 uppercase">{item.category}</p>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-black text-punchy-yellow">${item.price}</span>
                                    <button className="bg-white/10 p-2 rounded-lg active:bg-white/20">
                                        <ShoppingBag size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {MOCK_STAFF.map(staff => (
                            <div key={staff.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                                <div className="relative">
                                    <img src={staff.image} alt={staff.name} className="w-12 h-12 rounded-full border border-white/10" />
                                    {staff.available && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm">{staff.name}</h3>
                                    <p className="text-[10px] text-gray-400 uppercase">{staff.role}</p>
                                </div>
                                <button className="bg-royal-blue/20 text-royal-blue px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                    Book
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
