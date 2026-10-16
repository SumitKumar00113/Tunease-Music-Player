import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { WaitlistModal } from './components/WaitlistModal';
import { AuthModal } from './components/AuthModal';
import { AppRoutes } from './routes';
import { useLenis } from './hooks/useLenis';
import { CheckCircle, LogOut } from 'lucide-react';
import { AUTH_API_URL } from './config/env';

/**
 * App Component - Tunease Landing Application Shell
 */
export function App() {
  // Initialize Lenis smooth scroll engine
  useLenis();

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTheme, setActiveTheme] = useState('dark');

  const experienceRef = useRef(null);

  // Check logged in status on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await fetch(`${AUTH_API_URL}/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        // Backend unauthenticated or offline
      }
    };
    checkUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (experienceRef.current) {
        const rect = experienceRef.current.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveTheme('light');
        } else {
          setActiveTheme('dark');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#090909] text-[#F5F5F5] bg-dotted-pattern overflow-x-hidden selection:bg-[#FF7900] selection:text-white">
        
        {/* ATMOSPHERIC WARM ORANGE & AMBIENT GLOW REGIONS */}
        <div className="fixed top-0 left-0 right-0 h-[500px] bg-orange-glow pointer-events-none z-0" />
        <div className="fixed top-1/4 left-0 w-[500px] h-[650px] bg-amber-edge-left pointer-events-none z-0" />
        <div className="fixed top-1/3 right-0 w-[500px] h-[650px] bg-amber-edge-right pointer-events-none z-0" />

        {/* FLOATING USER STATUS BANNER IF LOGGED IN */}
        {user && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#FF7900] via-[#FF9020] to-[#FF7900] text-white text-[11px] font-bold py-1 px-4 text-center flex items-center justify-center gap-2 shadow-lg">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Logged in as <strong>{user.fullName?.firstName || user.email}</strong> ({user.email})</span>
            <button
              onClick={handleLogout}
              className="ml-3 underline hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        )}

        {/* FLOATING PILL NAVBAR */}
        <Navbar
          user={user}
          onOpenWaitlist={() => setIsWaitlistOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          activeSection={activeTheme}
        />

        {/* MAIN WEBSITE CANVAS CONTAINER */}
        <main className="relative z-10 my-6 sm:my-10 mx-auto w-[94vw] max-w-[1440px] bg-[#0C0B0A] border border-white/[0.08] shadow-[0_30px_100px_rgba(0,0,0,0.85)] rounded-[32px] sm:rounded-[44px] overflow-hidden transition-colors duration-500">
          <AppRoutes
            onOpenWaitlist={() => setIsWaitlistOpen(true)}
            experienceRef={experienceRef}
          />
        </main>

        {/* AUTHENTICATION MODAL */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(loggedUser) => setUser(loggedUser)}
        />

        {/* VIP BETA WAITLIST MODAL */}
        <WaitlistModal
          isOpen={isWaitlistOpen}
          onClose={() => setIsWaitlistOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
