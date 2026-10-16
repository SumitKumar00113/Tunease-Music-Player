import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Logo } from './components/Logo';
import { ArrowLeft } from 'lucide-react';
import { AppRoutes } from './routes';

const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api/auth';
const LANDING_URL = import.meta.env.VITE_LANDING_URL || 'http://localhost:5173';

export function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check user session on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.warn('Auth backend unreachable or user not logged in.');
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between overflow-x-hidden selection:bg-[#FF5A00] selection:text-white">
        {/* ATMOSPHERIC GLOW EFFECTS */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-glow pointer-events-none z-0" />
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-glow pointer-events-none z-0" />

        {/* HEADER NAVBAR */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Logo />
          <a
            href={LANDING_URL}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Landing Page</span>
          </a>
        </header>

        {/* MAIN CONTAINER */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-md bg-[#0C0C0E] border border-white/12 rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Decorative glows inside container */}
            <div className="absolute -top-28 -right-28 w-72 h-72 bg-[#FF5A00]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-[#D96A32]/15 rounded-full blur-3xl pointer-events-none" />

            <AppRoutes
              apiBaseUrl={API_BASE_URL}
              user={user}
              checkingAuth={checkingAuth}
              onLoginSuccess={(loggedUser) => setUser(loggedUser)}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setUser(updatedUser)}
            />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 py-6 text-center text-xs text-neutral-500">
          <p>© 2026 Tunease Music. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
