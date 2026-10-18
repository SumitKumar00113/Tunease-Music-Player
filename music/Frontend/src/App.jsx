import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerBar } from './components/PlayerBar';
import { ExpandedPlayer } from './components/ExpandedPlayer';
import { UploadMusicModal } from './components/UploadMusicModal';
import { PlaylistModal } from './components/PlaylistModal';
import { AuthModal } from './components/AuthModal';
import { AppRoutes } from './routes';
import { io } from "socket.io-client";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'https://tunease-auth-service-latest.onrender.com';
const LOGIN_URL = import.meta.env.VITE_AUTH_LOGIN_URL || `${AUTH_URL}/login`;

const MainContent = () => {
  const { queue, playTrack, socketRef } = usePlayer();

  useEffect(() => {
    let socket;
    try {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";
      socket = io(SOCKET_URL, {
        withCredentials: true,
        reconnectionAttempts: 3,
        timeout: 2000
      });
      if (socketRef) {
        socketRef.current = socket;
      }

      socket.on("play", (data) => {
        const musicId = typeof data === 'object' ? data.musicId : data;
        if (musicId && queue) {
          const match = queue.find(t => t.id === musicId || t._id === musicId);
          if (match) {
            playTrack(match);
          }
        }
      });
    } catch (err) {
      console.warn("Socket connection note:", err);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [queue, playTrack, socketRef]);

  return (
    <div className="app-main-content flex-1 flex flex-col h-full min-w-0 overflow-y-auto no-scrollbar pb-24 p-6 sm:p-8 space-y-8">
      <AppRoutes />
    </div>
  );
};

const AppShell = () => {
  const location = useLocation();
  const { user, isLoading } = usePlayer();
  const isUserDashboard = location.pathname.startsWith('/user_dashboard');
  const isStudio = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if (!isLoading && !user) window.location.replace(LOGIN_URL);
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#25313B] font-['Inter']">
        <p role="status" className="text-sm font-semibold">Checking your Tunease session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white px-6 text-center font-['Inter'] text-[#25313B]">
        <h1 className="text-xl font-bold">Sign in to open Tunease</h1>
        <p className="text-sm text-[#A1A1AA]">Taking you to the Tunease login page.</p>
        <a className="text-sm font-semibold text-[#60cfd8] underline" href={LOGIN_URL}>Continue to sign in</a>
      </main>
    );
  }

  return (
        <div className={`app-root relative w-screen h-screen bg-[#F4F7F8] text-[#25313B] flex items-center justify-center overflow-hidden font-['Inter'] selection:bg-[#60cfd8] selection:text-black${isUserDashboard ? ' app-root-dashboard' : ' app-root-light'}${isStudio ? ' app-root-studio' : ''}`}>
          
          {/* ATMOSPHERIC GREEN GLOW EFFECTS */}
          <div className="fixed top-0 left-0 right-0 h-[450px] bg-orange-glow pointer-events-none z-0" />
          <div className="fixed top-1/3 left-0 w-[450px] h-[650px] bg-orange-edge-left pointer-events-none z-0" />
          <div className="fixed top-1/2 right-0 w-[450px] h-[650px] bg-orange-edge-right pointer-events-none z-0" />

          {/* MAIN WEBSITE CANVAS CONTAINER */}
          <div className="app-canvas relative z-10 w-[96vw] max-w-[1600px] h-[92vh] max-h-[1000px] bg-white border border-[#E4EAEC] shadow-2xl rounded-[28px] overflow-hidden flex flex-col">
            
            {/* TOP HEADER & BODY GRID */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {!isStudio && <Sidebar />}
              <div className="app-content-column flex-1 flex flex-col min-w-0 bg-[#F7F9FA]">
                {!isStudio && <Header />}
                <MainContent />
              </div>
            </div>

            {/* BOTTOM FIXED PLAYER BAR */}
            {!isStudio && <PlayerBar />}

          </div>

          {/* FULLSCREEN IMMERSIVE PLAYER OVERLAY */}
          <ExpandedPlayerWrapper />

          {/* MODALS */}
          {!isStudio && <UploadMusicModal />}
          <PlaylistModal />
          <AuthModal />

        </div>
  );
};

export function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </PlayerProvider>
  );
}

const ExpandedPlayerWrapper = () => {
  const { isExpandedPlayer } = usePlayer();
  return isExpandedPlayer ? <ExpandedPlayer /> : null;
};

export default App;

