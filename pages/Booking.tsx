
import React, { useState } from 'react';
import { Calendar, Filter, Users, Timer, ChevronRight, CheckCircle2, X, Award, Quote } from 'lucide-react';
import { GymClass } from '../types';

const MOCK_CLASSES: GymClass[] = [
  { id: '1', name: 'Elite CrossTraining', coach: 'Marco', time: '08:00', duration: '50m', intensity: 'High', capacity: 15, booked: 12, type: 'Functional' },
  { id: '2', name: 'Power Yoga Flow', coach: 'Sarah', time: '09:30', duration: '60m', intensity: 'Medium', capacity: 20, booked: 20, type: 'Yoga' },
  { id: '3', name: 'Metabolic Conditioning', coach: 'Julian', time: '11:00', duration: '45m', intensity: 'High', capacity: 12, booked: 4, type: 'HIIT' },
  { id: '4', name: 'Body Sculpt', coach: 'Emma', time: '17:00', duration: '55m', intensity: 'Medium', capacity: 18, booked: 14, type: 'Strength' },
  { id: '5', name: 'Core Foundations', coach: 'Sarah', time: '18:30', duration: '30m', intensity: 'Low', capacity: 15, booked: 2, type: 'Functional' },
];

// Mock Coach Data Map
const COACH_DETAILS: Record<string, { bio: string, tagline: string, exp: string, tags: string[] }> = {
  'Marco': {
    bio: "Former Olympic weightlifting competitor specializing in functional strength and explosive power. Marco pushes you to find your true limits.",
    tagline: "Performance is a mindset.",
    exp: "12 Years Exp",
    tags: ["Olympic Lifting", "CrossFit L3", "Mobility"]
  },
  'Sarah': {
    bio: "Sarah blends Vinyasa flow with modern biomechanics to build resilient, flexible bodies. Her classes focus on breath, alignment, and inner focus.",
    tagline: "Find stillness in motion.",
    exp: "8 Years Exp",
    tags: ["Yoga Alliance 500H", "Pilates", "Rehab"]
  },
  'Julian': {
    bio: "A high-energy conditioning expert who turns metabolic training into a party. Julian's HIIT sessions are legendary for calorie focus.",
    tagline: "Don't stop when you're tired, stop when you're done.",
    exp: "5 Years Exp",
    tags: ["HIIT", "Cardio", "Group Energy"]
  },
  'Emma': {
    bio: "Emma focuses on sculpting and toning through high-rep resistance training. She emphasizes form and time-under-tension.",
    tagline: "Sculpt your masterpiece.",
    exp: "6 Years Exp",
    tags: ["Bodybuilding", "Nutrition", "Strength"]
  }
};

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookedClasses, setBookedClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);

  const days = [
    { label: 'Mon', date: '22' },
    { label: 'Tue', date: '23' },
    { label: 'Wed', date: '24' },
    { label: 'Thu', date: '25' },
    { label: 'Fri', date: '26' },
    { label: 'Sat', date: '27' },
  ];

  // Filter Logic
  const filteredClasses = MOCK_CLASSES.filter(c => {
    if (activeFilter === 'All') return true;
    return c.type === activeFilter || c.intensity === activeFilter;
  });

  const handleBook = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening modal
    if (bookedClasses.includes(id)) {
      setBookedClasses(prev => prev.filter(cid => cid !== id));
    } else {
      setBookedClasses(prev => [...prev, id]);
    }
  };

  const handleWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal
    alert("You've been added to the waitlist! We'll notify you if a spot opens.");
  };

  return (
    <div className="space-y-6 relative">
      <header>
        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Schedule</h2>
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Book your performance</p>
      </header>

      {/* Horizontal Date Picker */}
      <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDate(idx)}
            className={`flex flex-col items-center min-w-[56px] py-4 rounded-2xl transition-all duration-300 border ${selectedDate === idx
                ? 'bg-punchy-yellow border-punchy-yellow text-black scale-105 shadow-lg shadow-punchy-yellow/20'
                : 'bg-white/5 border-white/5 text-gray-400'
              }`}
          >
            <span className="text-[10px] font-bold uppercase">{day.label}</span>
            <span className="text-lg font-black">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <div className="bg-royal-blue p-2 rounded-xl text-white">
          <Filter size={16} />
        </div>
        {['All', 'Strength', 'HIIT', 'Yoga', 'Functional'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${activeFilter === f
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-transparent text-gray-500'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Class List */}
      <div className="space-y-4 pb-24">
        {filteredClasses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No classes found for this filter.</p>
          </div>
        ) : filteredClasses.map((gymClass) => {
          const isBooked = bookedClasses.includes(gymClass.id);
          const currentBooked = isBooked ? gymClass.booked + 1 : gymClass.booked;
          const isFull = currentBooked >= gymClass.capacity;

          return (
            <div
              key={gymClass.id}
              onClick={() => setSelectedClass(gymClass)} // Open Modal
              className={`bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden transition-all hover:bg-white/10 active:scale-[0.98] group cursor-pointer ${isFull && !isBooked ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isBooked ? 'bg-green-500 text-black' : 'bg-royal-blue/20 text-royal-blue'}`}>
                    {isBooked ? <CheckCircle2 size={20} /> : <Timer size={20} />}
                  </div>
                  <div>
                    <h4 className="font-black text-lg leading-none uppercase italic group-hover:text-punchy-yellow transition-colors">
                      {gymClass.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest flex items-center gap-1">
                      <span>{gymClass.type}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-punchy-yellow">Coach {gymClass.coach}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-white">{gymClass.time}</span>
                  <p className="text-[10px] text-gray-500 font-bold">{gymClass.duration}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                    <Users size={12} className={isBooked ? 'text-green-500' : 'text-royal-blue'} />
                    {currentBooked}/{gymClass.capacity} spots
                  </div>
                  <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${gymClass.intensity === 'High' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                      gymClass.intensity === 'Medium' ? 'border-orange-500/30 text-orange-500 bg-orange-500/10' :
                        'border-green-500/30 text-green-500 bg-green-500/10'
                    }`}>
                    {gymClass.intensity}
                  </div>
                </div>

                {isBooked ? (
                  <button
                    onClick={(e) => handleBook(e, gymClass.id)}
                    className="bg-green-500 text-black font-black uppercase text-xs px-6 py-2 rounded-xl shadow-[0_4px_10px_rgba(34,197,94,0.3)] active:scale-95 transition-all"
                  >
                    Joined
                  </button>
                ) : isFull ? (
                  <button
                    onClick={handleWaitlist}
                    className="flex items-center gap-1 text-xs font-black uppercase text-royal-blue bg-royal-blue/10 px-4 py-2 rounded-xl active:scale-95 transition-transform"
                  >
                    Waitlist
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleBook(e, gymClass.id)}
                    className="bg-punchy-yellow text-black font-black uppercase text-xs px-6 py-2 rounded-xl shadow-[0_4px_10px_rgba(255,215,0,0.2)] active:scale-95 transition-all"
                  >
                    Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coach Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedClass(null)}>
          <div
            className="w-full max-w-sm bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-white/10 shadow-2xl animate-slideUp relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedClass(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center -mt-12">
              <div className="w-24 h-24 rounded-3xl bg-zinc-800 p-1 shadow-xl border-2 border-punchy-yellow">
                <img
                  src={`https://i.pravatar.cc/150?u=${selectedClass.coach}`}
                  className="w-full h-full rounded-2xl object-cover"
                  alt={selectedClass.coach}
                />
              </div>

              <h3 className="text-2xl font-black italic mt-4 text-white uppercase">{selectedClass.coach}</h3>
              <p className="text-punchy-yellow font-bold text-xs uppercase tracking-widest mb-6">
                {COACH_DETAILS[selectedClass.coach]?.exp || 'Expert Coach'}
              </p>

              <div className="w-full space-y-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
                  <Quote size={40} className="absolute top-2 right-2 text-white/5" />
                  <p className="text-sm text-gray-300 italic leading-relaxed text-center relative z-10">
                    "{COACH_DETAILS[selectedClass.coach]?.tagline || 'Push your limits.'}"
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">About the Coach</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {COACH_DETAILS[selectedClass.coach]?.bio || 'A dedicated fitness professional committed to helping you reach your performance goals through science-based training.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {COACH_DETAILS[selectedClass.coach]?.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-royal-blue/20 text-royal-blue rounded-lg text-[10px] font-bold uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedClass(null)}
                className="mt-8 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
