
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
    className={`flex flex-col items-center justify-center gap-1 w-full h-16 rounded-2xl transition-all duration-300 relative ${active ? 'text-black' : 'text-gray-400 hover:text-white'}`}
  >
    {active && (
      <div className="absolute inset-x-2 inset-y-1 bg-punchy-yellow rounded-xl -z-10 animate-scaleIn" />
    )}
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
  </button>
);

const Navigation: React.FC<{ activePage: Page; onNavigate: (page: Page) => void }> = ({ activePage, onNavigate }) => {
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 px-2 py-2 z-50 flex justify-between items-center rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
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
