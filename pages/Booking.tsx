import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Users, Timer, ChevronRight, CheckCircle2, X, Award, Quote, Loader2, ArrowRight } from 'lucide-react';
import { classesApi, bookingsApi, coachesApi, ApiGymClass, ApiBooking, ApiCoach } from '../utils/api';

interface BookingProps {
  userId: string;
}

// Fallback mock data when API is unavailable
const MOCK_CLASSES = [
  { id: '1', name: 'Elite CrossTraining', coachName: 'Marco', time: '08:00', duration: '50m', intensity: 'High' as const, capacity: 15, booked: 12, type: 'Functional' },
  { id: '2', name: 'Power Yoga Flow', coachName: 'Sarah', time: '09:30', duration: '60m', intensity: 'Medium' as const, capacity: 20, booked: 20, type: 'Yoga' },
  { id: '3', name: 'Metabolic Conditioning', coachName: 'Julian', time: '11:00', duration: '45m', intensity: 'High' as const, capacity: 12, booked: 4, type: 'HIIT' },
  { id: '4', name: 'Body Sculpt', coachName: 'Emma', time: '17:00', duration: '55m', intensity: 'Medium' as const, capacity: 18, booked: 14, type: 'Strength' },
  { id: '5', name: 'Core Foundations', coachName: 'Sarah', time: '18:30', duration: '30m', intensity: 'Low' as const, capacity: 15, booked: 2, type: 'Functional' },
];

const COACH_DETAILS: Record<string, { bio: string, tagline: string, exp: string, tags: string[] }> = {
  'Marco': {
    bio: "Former Olympic weightlifting competitor specializing in functional strength and explosive power.",
    tagline: "Performance is a mindset.",
    exp: "12 Years Exp",
    tags: ["Olympic Lifting", "CrossFit L3", "Mobility"]
  },
  'Sarah': {
    bio: "Sarah blends Vinyasa flow with modern biomechanics to build resilient, flexible bodies.",
    tagline: "Find stillness in motion.",
    exp: "8 Years Exp",
    tags: ["Yoga Alliance 500H", "Pilates", "Rehab"]
  },
  'Julian': {
    bio: "A high-energy conditioning expert who turns metabolic training into a party.",
    tagline: "Don't stop when you're tired, stop when you're done.",
    exp: "5 Years Exp",
    tags: ["HIIT", "Cardio", "Group Energy"]
  },
  'Emma': {
    bio: "Emma focuses on sculpting and toning through high-rep resistance training.",
    tagline: "Sculpt your masterpiece.",
    exp: "6 Years Exp",
    tags: ["Bodybuilding", "Nutrition", "Strength"]
  }
};

interface DisplayClass {
  id: string;
  name: string;
  coachName: string;
  time: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  capacity: number;
  booked: number;
  type: string;
}

const Booking: React.FC<BookingProps> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookedClassIds, setBookedClassIds] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<DisplayClass | null>(null);
  const [classes, setClasses] = useState<DisplayClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Generate dates for the week
  const today = new Date();
  const days = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      label: date.toLocaleDateString('en', { weekday: 'short' }),
      date: date.getDate().toString(),
      fullDate: date.toISOString().split('T')[0],
    };
  });

  useEffect(() => {
    loadClasses();
    loadUserBookings();
  }, [selectedDate]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const apiClasses = await classesApi.getAll(days[selectedDate].fullDate);
      const displayClasses: DisplayClass[] = apiClasses.map(c => ({
        id: c.id,
        name: c.name,
        coachName: c.coach?.name || 'Unknown Coach',
        time: c.startTime?.slice(0, 5) || '00:00',
        duration: `${c.durationMinutes}m`,
        intensity: c.intensity,
        capacity: c.capacity,
        booked: c.bookings?.length || 0,
        type: c.type,
      }));
      setClasses(displayClasses.length > 0 ? displayClasses : MOCK_CLASSES);
      setError('');
    } catch (err) {
      console.warn('API unavailable, using mock data');
      setClasses(MOCK_CLASSES);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBookings = async () => {
    try {
      const bookings = await bookingsApi.getByUser(userId);
      setBookedClassIds(bookings.filter(b => b.status === 'Booked').map(b => b.classId));
    } catch (err) {
      console.warn('Could not load user bookings');
    }
  };

  const filteredClasses = classes.filter(c => {
    if (activeFilter === 'All') return true;
    return c.type === activeFilter || c.intensity === activeFilter;
  });

  const handleBook = async (e: React.MouseEvent, classId: string) => {
    e.stopPropagation();

    if (bookedClassIds.includes(classId)) {
      try {
        const bookings = await bookingsApi.getByUser(userId);
        const booking = bookings.find(b => b.classId === classId && b.status === 'Booked');
        if (booking) {
          await bookingsApi.cancel(booking.id);
          setBookedClassIds(prev => prev.filter(id => id !== classId));
        }
      } catch (err) {
        setBookedClassIds(prev => prev.filter(id => id !== classId));
      }
    } else {
      try {
        await bookingsApi.create(userId, classId);
        setBookedClassIds(prev => [...prev, classId]);
      } catch (err) {
        setBookedClassIds(prev => [...prev, classId]);
      }
    }
  };

  const handleWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("You've been added to the waitlist! We'll notify you if a spot opens.");
  };

  return (
    <div className="space-y-6 relative pb-24">
      {/* Header */}
      <header className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 animate-slideInRight">
            SCHEDULE
          </h1>
          <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] animate-fadeIn" style={{ animationDelay: '200ms' }}>
            Book Your Session
          </p>
        </div>
      </header>

      {/* Horizontal Date Picker */}
      <div className="flex justify-between gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDate(idx)}
            style={{ animationDelay: `${idx * 50}ms` }}
            className={`flex flex-col items-center min-w-[70px] py-4 rounded-3xl transition-all duration-300 border animate-slideUp ${selectedDate === idx
              ? 'bg-punchy-yellow border-punchy-yellow text-black scale-105 shadow-[0_0_20px_rgba(255,215,0,0.4)]'
              : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
              }`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider">{day.label}</span>
            <span className="text-xl font-black">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <div className="bg-white/5 border border-white/10 p-2 rounded-xl text-white backdrop-blur-md">
          <Filter size={16} />
        </div>
        {['All', 'Strength', 'HIIT', 'Yoga', 'Functional'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all duration-300 ${activeFilter === f
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
              : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Class List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-punchy-yellow" size={32} />
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No classes found for this filter.</p>
          </div>
        ) : filteredClasses.map((gymClass, index) => {
          const isBooked = bookedClassIds.includes(gymClass.id);
          const currentBooked = isBooked ? gymClass.booked + 1 : gymClass.booked;
          const isFull = currentBooked >= gymClass.capacity;

          return (
            <div
              key={gymClass.id}
              onClick={() => setSelectedClass(gymClass)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:border-punchy-yellow/30 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] group cursor-pointer animate-slideUp ${isFull && !isBooked ? 'opacity-60 grayscale' : ''}`}
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-punchy-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isBooked ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/5 text-gray-400 group-hover:bg-punchy-yellow group-hover:text-black'}`}>
                    {isBooked ? <CheckCircle2 size={24} /> : <Timer size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-xl leading-none uppercase italic text-white group-hover:text-punchy-yellow transition-colors">
                      {gymClass.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 tracking-[0.15em] flex items-center gap-2">
                      <span className="text-punchy-yellow">Coach {gymClass.coachName}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-white/70">{gymClass.type}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white italic tracking-tight">{gymClass.time}</span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{gymClass.duration}</p>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                    <Users size={12} className={isBooked ? 'text-green-500' : 'text-gray-500'} />
                    {currentBooked}/{gymClass.capacity} <span className="hidden sm:inline">spots</span>
                  </div>
                  <div className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${gymClass.intensity === 'High' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                    gymClass.intensity === 'Medium' ? 'border-orange-500/20 text-orange-500 bg-orange-500/5' :
                      'border-green-500/20 text-green-500 bg-green-500/5'
                    }`}>
                    {gymClass.intensity} Intensity
                  </div>
                </div>

                {isBooked ? (
                  <button
                    onClick={(e) => handleBook(e, gymClass.id)}
                    className="bg-green-500 text-black font-black uppercase text-[10px] px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-95 transition-all tracking-wider"
                  >
                    Joined
                  </button>
                ) : isFull ? (
                  <button
                    onClick={handleWaitlist}
                    className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 bg-white/5 px-4 py-2.5 rounded-xl active:scale-95 transition-transform tracking-wider"
                  >
                    Waitlist
                    <ChevronRight size={12} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleBook(e, gymClass.id)}
                    className="bg-white text-black hover:bg-punchy-yellow font-black uppercase text-[10px] px-6 py-2.5 rounded-xl shadow-lg active:scale-95 transition-all tracking-wider"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coach Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn p-4" onClick={() => setSelectedClass(null)}>
          <div
            className="w-full max-w-sm bg-[#141414] rounded-[2rem] p-8 border border-white/10 shadow-2xl animate-slideUp relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-punchy-yellow/10 blur-[80px] rounded-full pointer-events-none" />

            <button
              onClick={() => setSelectedClass(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors border border-white/5 hover:bg-white/10"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-28 h-28 rounded-3xl bg-black p-1 shadow-2xl border border-white/10 mb-6 rotate-3">
                <img
                  src={`https://i.pravatar.cc/150?u=${selectedClass.coachName}`}
                  className="w-full h-full rounded-2xl object-cover grayscale contrast-125"
                  alt={selectedClass.coachName}
                />
              </div>

              <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-1">{selectedClass.coachName}</h3>
              <p className="text-punchy-yellow font-bold text-[10px] uppercase tracking-[0.2em] mb-8 bg-punchy-yellow/10 px-3 py-1 rounded-full border border-punchy-yellow/20">
                {COACH_DETAILS[selectedClass.coachName]?.exp || 'Expert Coach'}
              </p>

              <div className="w-full space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                  <Quote size={40} className="absolute top-2 right-2 text-white/5" />
                  <p className="text-sm text-gray-200 italic leading-relaxed text-center relative z-10 font-medium">
                    "{COACH_DETAILS[selectedClass.coachName]?.tagline || 'Push your limits.'}"
                  </p>
                </div>

                <div className="space-y-2 text-center">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Specialization</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {COACH_DETAILS[selectedClass.coachName]?.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedClass(null)}
                className="mt-8 w-full bg-white text-black hover:bg-punchy-yellow font-black py-4 rounded-2xl text-xs uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95"
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
