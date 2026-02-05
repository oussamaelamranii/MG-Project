
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { ApiUser } from './utils/api';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import SmartPass from './components/SmartPass';
import SignIn from './pages/SignIn';
import Community from './pages/Community';
import Shop from './pages/Shop';
import Arena from './pages/Arena';

const App: React.FC = () => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [showSmartPass, setShowSmartPass] = useState(false);

  useEffect(() => {
    // Check for existing session and user data
    const session = localStorage.getItem('mgclub_session');
    const storedUser = localStorage.getItem('mgclub_user');

    if (session && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as ApiUser;
        setUser(parsedUser);
      } catch {
        // Invalid user data, clear session
        localStorage.removeItem('mgclub_session');
        localStorage.removeItem('mgclub_user');
      }
    }
  }, []);

  const handleLogin = (loggedInUser: ApiUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('mgclub_session');
    localStorage.removeItem('mgclub_user');
    setUser(null);
    setActivePage(Page.HOME);
  };

  const renderPage = () => {
    if (!user) return null;

    switch (activePage) {
      case Page.HOME:
        return <Home onOpenSmartPass={() => setShowSmartPass(true)} onNavigate={setActivePage} />;
      case Page.BOOKING:
        return <Booking userId={user.id} />;
      case Page.COMMUNITY:
        return <Community userId={user.id} userName={user.name} />;
      case Page.PROFILE:
        return <Profile user={user} onLogout={handleLogout} />;
      case Page.SHOP:
        return <Shop userId={user.id} onBack={() => setActivePage(Page.HOME)} />;
      case Page.ARENA:
        return <Arena userId={user.id} onBack={() => setActivePage(Page.HOME)} />;
      default:
        return <Home onOpenSmartPass={() => setShowSmartPass(true)} onNavigate={setActivePage} />;
    }
  };

  if (!user) {
    return <SignIn onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#121212] to-black text-white pb-24 relative overflow-hidden">
      {/* Background Glows for High Contrast */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-royal-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-punchy-yellow/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto px-4 pt-6 pb-28 animate-fadeIn">
        {renderPage()}
      </main>

      {/* Navigation Overlay */}
      <Navigation activePage={activePage} onNavigate={setActivePage} />

      {/* Smart Pass Modal */}
      {showSmartPass && <SmartPass userId={user.id} onClose={() => setShowSmartPass(false)} />}
    </div>
  );
};

export default App;
