import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Loader2, X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { productsApi, coachesApi, ApiProduct, ApiCoach } from '../utils/api';

interface ShopProps {
    userId: string;
    onBack: () => void;
}

interface DisplayProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string;
}

interface DisplayStaff {
    id: string;
    name: string;
    role: string;
    image: string;
    available: boolean;
}

interface CartItem {
    product: DisplayProduct;
    quantity: number;
}

const CATEGORIES = ['All', 'Protein', 'Creatine', 'Vitamins', 'Pre-Workout', 'Amino Acids', 'Gear'] as const;
type Category = typeof CATEGORIES[number];

const MOCK_PRODUCTS: DisplayProduct[] = [
    // Proteins
    { id: '1', name: 'Whey Isolate', price: 49.99, category: 'Protein', image: '/products/whey_protein.png', description: 'Premium whey protein isolate with 25g protein per serving. Fast-absorbing for optimal muscle recovery. Zero sugar, low carb formula.' },
    { id: '2', name: 'Casein Protein', price: 44.99, category: 'Protein', image: '/products/whey_protein.png', description: 'Slow-release casein protein for overnight muscle recovery. 24g protein per serving. Ideal for before bed.' },
    { id: '3', name: 'Plant Protein', price: 39.99, category: 'Protein', image: '/products/whey_protein.png', description: 'Vegan protein blend from pea, rice, and hemp. Complete amino acid profile with 22g protein per serving.' },

    // Creatine
    { id: '4', name: 'Creatine Monohydrate', price: 29.99, category: 'Creatine', image: '/products/creatine.png', description: 'Pure creatine monohydrate for strength and power. 5g per serving. Micronized for better absorption.' },
    { id: '5', name: 'Creatine HCL', price: 34.99, category: 'Creatine', image: '/products/creatine.png', description: 'Concentrated creatine hydrochloride. No loading phase required. Zero bloating formula.' },

    // Vitamins
    { id: '6', name: 'Multivitamin Pro', price: 19.99, category: 'Vitamins', image: '/products/vitamin.png', description: 'Complete daily multivitamin with 23 essential vitamins and minerals. Supports immune health and energy levels.' },
    { id: '7', name: 'Vitamin D3 + K2', price: 14.99, category: 'Vitamins', image: '/products/vitamin.png', description: 'High-potency vitamin D3 (5000 IU) with K2 for bone health and immune support.' },
    { id: '8', name: 'Omega-3 Fish Oil', price: 24.99, category: 'Vitamins', image: '/products/vitamin.png', description: 'Triple-strength omega-3 with EPA & DHA. Supports heart, brain, and joint health.' },

    // Pre-Workout
    { id: '9', name: 'Pre-Workout X', price: 34.99, category: 'Pre-Workout', image: '/products/pre_workout.png', description: 'High-intensity pre-workout with caffeine, beta-alanine, and nitric oxide boosters. Explosive energy and enhanced focus.' },
    { id: '10', name: 'Stim-Free Pre', price: 32.99, category: 'Pre-Workout', image: '/products/pre_workout.png', description: 'Caffeine-free pre-workout with pump enhancers. Perfect for evening workouts or caffeine-sensitive users.' },

    // Amino Acids
    { id: '11', name: 'BCAA 2:1:1', price: 27.99, category: 'Amino Acids', image: '/products/pre_workout.png', description: 'Branched-chain amino acids in optimal 2:1:1 ratio. Supports muscle recovery and reduces soreness.' },
    { id: '12', name: 'EAA Complex', price: 31.99, category: 'Amino Acids', image: '/products/pre_workout.png', description: 'All 9 essential amino acids for complete muscle protein synthesis. Great taste, zero sugar.' },
    { id: '13', name: 'L-Glutamine', price: 22.99, category: 'Amino Acids', image: '/products/creatine.png', description: 'Pure L-Glutamine for gut health and muscle recovery. 5g per serving.' },

    // Gear
    { id: '14', name: 'Lifting Straps', price: 14.99, category: 'Gear', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=400', description: 'Heavy-duty cotton lifting straps for maximum grip support. Ideal for deadlifts, rows, and pull exercises.' },
    { id: '15', name: 'Shaker Bottle', price: 9.99, category: 'Gear', image: '/products/shaker.png', description: 'BPA-free shaker bottle with mixing ball. 24oz capacity, leak-proof design.' },
    { id: '16', name: 'Gym Gloves', price: 19.99, category: 'Gear', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400', description: 'Padded workout gloves with wrist support. Breathable mesh back, anti-slip palm.' },
];

const MOCK_STAFF: DisplayStaff[] = [
    { id: '1', name: 'Coach Marco', role: 'Head Coach', image: 'https://i.pravatar.cc/150?u=coach', available: true },
    { id: '2', name: 'Sarah Fit', role: 'Nutritionist', image: 'https://i.pravatar.cc/150?u=sarah', available: false },
    { id: '3', name: 'Mike Power', role: 'PT Specialist', image: 'https://i.pravatar.cc/150?u=mike', available: true },
];

const Shop: React.FC<ShopProps> = ({ userId, onBack }) => {
    const [activeTab, setActiveTab] = useState<'supplements' | 'staff'>('supplements');
    const [products, setProducts] = useState<DisplayProduct[]>([]);
    const [staff, setStaff] = useState<DisplayStaff[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');

    // Cart state - load from localStorage on init
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('mgclub_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showCart, setShowCart] = useState(false);
    const [addedToCartId, setAddedToCartId] = useState<string | null>(null);
    const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

    // Product detail modal
    const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('mgclub_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [apiProducts, apiCoaches] = await Promise.all([
                productsApi.getAll(),
                coachesApi.getAll()
            ]);

            if (apiProducts.length > 0) {
                setProducts(apiProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    category: p.category,
                    image: p.imageUrl || 'https://via.placeholder.com/200',
                    description: `Premium ${p.name} - High quality supplement for your fitness goals.`,
                })));
            } else {
                setProducts(MOCK_PRODUCTS);
            }

            if (apiCoaches.length > 0) {
                setStaff(apiCoaches.map(c => ({
                    id: c.id,
                    name: c.name,
                    role: c.specialties?.[0] || 'Coach',
                    image: c.imageUrl || `https://i.pravatar.cc/150?u=${c.id}`,
                    available: c.isAvailable,
                })));
            } else {
                setStaff(MOCK_STAFF);
            }
        } catch (err) {
            console.warn('API unavailable, using mock data');
            setProducts(MOCK_PRODUCTS);
            setStaff(MOCK_STAFF);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: DisplayProduct) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });

        // Show add to cart animation
        setAddedToCartId(product.id);
        setTimeout(() => setAddedToCartId(null), 1500);
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#121212] to-black space-y-8 pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="bg-white/5 hover:bg-white/10 p-3 rounded-xl active:scale-95 transition-all border border-white/5"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            FUEL STATION
                        </h1>
                        <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                            Premium Supplements
                        </p>
                    </div>
                </div>

                {/* Cart Button */}
                <button
                    onClick={() => setShowCart(true)}
                    className="group relative bg-gradient-to-br from-orange-500 to-red-600 p-3.5 rounded-2xl active:scale-95 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                >
                    <ShoppingCart size={24} className="text-white fill-white/20" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-punchy-yellow text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#121212] shadow-lg transform scale-100 transition-transform group-hover:scale-110">
                            {cartCount}
                        </span>
                    )}
                </button>
            </header>

            {/* Content Wrapper */}
            <div className="px-6 space-y-8">
                {/* Tabs */}
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('supplements')}
                        className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'supplements'
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Supplements
                    </button>
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'staff'
                            ? 'bg-punchy-yellow text-black shadow-lg'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Team
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-orange-500" size={48} />
                        <p className="text-gray-500 font-mono text-xs animate-pulse">LOADING ASSETS...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeTab === 'supplements' ? (
                            <>
                                {/* Category Filter Buttons */}
                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${selectedCategory === cat
                                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transform scale-105'
                                                : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-2 gap-4 pb-20">
                                    {products
                                        .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
                                        .map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="group relative bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] overflow-hidden"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                                onClick={() => setSelectedProduct(item)}
                                            >
                                                {/* Hover Glow Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                                <div className="aspect-square rounded-2xl bg-black/40 overflow-hidden relative shadow-inner">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                                        <p className="text-[10px] font-bold text-white uppercase tracking-wider">{item.category}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-sm leading-tight text-white group-hover:text-orange-500 transition-colors line-clamp-2">{item.name}</h3>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                                                    <span className="font-black text-lg text-white">${item.price}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                                        className="bg-white/10 hover:bg-orange-500 p-2.5 rounded-xl transition-all duration-300 group-hover:shadow-lg group-active:scale-90"
                                                    >
                                                        <Plus size={16} className="text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                {staff.map((member, index) => (
                                    <div
                                        key={member.id}
                                        className="bg-[#1A1A1A]/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4 animate-fadeIn"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="relative">
                                            <img src={member.image} alt={member.name} className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" />
                                            {member.available && (
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#121212] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-white text-lg italic">{member.name}</h3>
                                            <p className="text-xs text-notebook-gray uppercase font-bold tracking-wider">{member.role}</p>
                                        </div>
                                        <button className="bg-punchy-yellow/10 text-punchy-yellow px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-punchy-yellow hover:text-black transition-colors">
                                            Book
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-end md:items-center justify-center animate-fadeIn p-4">
                    <div className="bg-[#141414] w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative animate-slideUp">
                        {/* Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none" />

                        {/* Product Image */}
                        <div className="relative h-72 bg-gradient-to-b from-gray-900 to-[#141414] flex items-center justify-center p-8 group">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="h-full w-auto object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500"
                            />
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 bg-black/40 hover:bg-white/10 backdrop-blur-md p-2 rounded-full text-white transition-colors border border-white/5"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-8 space-y-6 relative">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                                        {selectedProduct.category}
                                    </span>
                                    <span className="text-gray-500 text-xs font-mono">ID: {selectedProduct.id.padStart(4, '0')}</span>
                                </div>
                                <h2 className="text-3xl font-black text-white italic tracking-tight">{selectedProduct.name}</h2>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                {selectedProduct.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Price</p>
                                    <p className="text-4xl font-black text-white tracking-tight">${selectedProduct.price}</p>
                                </div>
                                <button
                                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-2xl font-black uppercase tracking-wider flex items-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] text-white"
                                >
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer - now cleaner */}
            {showCart && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end animate-fadeIn">
                    <div className="bg-[#121212] w-full max-w-sm h-full border-l border-white/10 shadow-2xl flex flex-col animate-slideInRight">
                        {/* Cart Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
                            <h2 className="text-xl font-black italic text-white flex items-center gap-3">
                                <ShoppingBag className="text-orange-500" />
                                YOUR CART
                                <span className="text-sm not-italic font-normal text-gray-500 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                                    {cartCount} items
                                </span>
                            </h2>
                            <button
                                onClick={() => setShowCart(false)}
                                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <ShoppingCart size={64} className="text-gray-600 mb-4" />
                                    <p className="text-gray-400 font-bold">Your cart is empty</p>
                                    <p className="text-xs text-gray-600 mt-2">Add some fuel to get started</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product.id} className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/30 rounded-2xl p-3 flex gap-4 transition-all duration-300">
                                        <div className="w-20 h-20 bg-black/30 rounded-xl overflow-hidden shrink-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-bold text-sm text-white line-clamp-1">{item.product.name}</h3>
                                                <p className="text-orange-500 text-xs font-black uppercase tracking-wider">{item.product.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-white">${(item.product.price * item.quantity).toFixed(2)}</p>

                                                <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                                                    <button
                                                        onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, -1) : removeFromCart(item.product.id)}
                                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, 1)}
                                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 bg-[#1A1A1A] border-t border-white/10 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Taxes</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xl font-black text-white pt-4 border-t border-white/10">
                                        <span>Total</span>
                                        <span className="text-punchy-yellow">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowCart(false); setShowCheckoutConfirm(true); }}
                                    className="w-full bg-white text-black hover:bg-punchy-yellow p-4 rounded-xl font-black uppercase tracking-wider active:scale-95 transition-all shadow-lg"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add to Cart Toast Notification */}
            {addedToCartId && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-4 rounded-2xl font-black uppercase tracking-wider shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-bounce z-[80] flex items-center gap-3 pointer-events-none">
                    <div className="bg-green-500 rounded-full p-1">
                        <ShoppingCart size={16} className="text-white" />
                    </div>
                    Added to cart
                </div>
            )}

            {/* Checkout Confirmation Modal */}
            {showCheckoutConfirm && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[80] flex items-center justify-center p-6 animate-fadeIn">
                    <div className="bg-[#121212] w-full max-w-sm rounded-[2rem] border border-white/10 overflow-hidden text-center p-8 space-y-8 relative">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400" />

                        <div className="bg-green-500/10 w-24 h-24 rounded-full mx-auto flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <ShoppingBag size={40} className="text-green-500" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black italic text-white">ORDER PLACED!</h2>
                            <p className="text-gray-400 text-sm">Your gear is on ready for pickup.</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
                            <p className="text-punchy-yellow font-black text-xl uppercase tracking-wider">Front Desk</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Pickup Location</p>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="text-4xl font-black text-white mb-6">
                                <span className="text-gray-600 text-xl font-bold align-top">$</span>
                                {cartTotal.toFixed(2)}
                            </div>
                            <button
                                onClick={() => { setShowCheckoutConfirm(false); setCart([]); }}
                                className="w-full bg-green-500 hover:bg-green-400 text-black p-4 rounded-xl font-black uppercase tracking-wider active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
