
import React from 'react';
import { Home, Calendar, User, LayoutGrid, MessageCircle } from 'lucide-react';
import { Page } from '../types';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-punchy-yellow scale-110' : 'text-gray-500 hover:text-gray-300'}`}
  >
    <Icon size={24} strokeWidth={active ? 3 : 2} />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    {active && <div className="w-1 h-1 rounded-full bg-punchy-yellow mt-1 animate-pulse" />}
  </button>
);

const Navigation: React.FC<{ activePage: Page; onNavigate: (page: Page) => void }> = ({ activePage, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 pb-8 z-50 flex justify-around items-center safe-area-bottom rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <NavButton
        active={activePage === Page.HOME}
        onClick={() => onNavigate(Page.HOME)}
        icon={Home}
        label="Home"
      />
      <NavButton
        active={activePage === Page.BOOKING}
        onClick={() => onNavigate(Page.BOOKING)}
        icon={Calendar}
        label="Book"
      />
      <NavButton
        active={activePage === Page.COMMUNITY}
        onClick={() => onNavigate(Page.COMMUNITY)}
        icon={MessageCircle}
        label="Tribe"
      />
      <NavButton
        active={activePage === Page.PROFILE}
        onClick={() => onNavigate(Page.PROFILE)}
        icon={User}
        label="Profile"
      />
    </nav>
  );
};

export default Navigation;
