
import React, { useState, useEffect } from 'react';
import { Page } from './types';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [showSmartPass, setShowSmartPass] = useState(false);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('mgclub_session');
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('mgclub_session', 'active');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mgclub_session');
    setIsAuthenticated(false);
    setActivePage(Page.HOME);
  };

  const renderPage = () => {
    switch (activePage) {
      case Page.HOME:
        return <Home onOpenSmartPass={() => setShowSmartPass(true)} onNavigate={setActivePage} />;
      case Page.BOOKING:
        return <Booking />;
      case Page.COMMUNITY:
        return <Community />;
      case Page.PROFILE:
        return <Profile onLogout={handleLogout} />;
      case Page.SHOP:
        return <Shop onBack={() => setActivePage(Page.HOME)} />;
      case Page.ARENA:
        return <Arena onBack={() => setActivePage(Page.HOME)} />;
      default:
        return <Home onOpenSmartPass={() => setShowSmartPass(true)} onNavigate={setActivePage} />;
    }
  };

  if (!isAuthenticated) {
    return <SignIn onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-carbon-black text-white pb-24 relative overflow-hidden">
      {/* Background Glows for High Contrast */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-royal-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-punchy-yellow/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 pt-6 animate-fadeIn">
        {renderPage()}
      </main>

      {/* Navigation Overlay */}
      <Navigation activePage={activePage} onNavigate={setActivePage} />

      {/* Smart Pass Modal */}
      {showSmartPass && <SmartPass onClose={() => setShowSmartPass(false)} />}
    </div>
  );
};

export default App;
