'use client';

import React from 'react';
import { Sidebar } from '../../components/player/Sidebar';
import { Header } from '../../components/player/Header';
import { PlayerBar } from '../../components/player/PlayerBar';
import { ExpandedPlayer } from '../../components/player/ExpandedPlayer';
import { UploadMusicModal } from '../../components/player/UploadMusicModal';
import { PlaylistModal } from '../../components/player/PlaylistModal';
import { usePlayer } from '../../context/PlayerContext';

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpandedPlayer } = usePlayer();

  return (
    <div className="relative w-screen h-screen bg-[#070709] text-[#F5F5F5] flex items-center justify-center overflow-hidden font-['Inter'] selection:bg-[#60cfd8] selection:text-black">
      {/* ATMOSPHERIC GLOW EFFECTS */}
      <div className="fixed top-0 left-0 right-0 h-[450px] bg-cyan-glow pointer-events-none z-0 opacity-40" />
      <div className="fixed top-1/3 left-0 w-[450px] h-[650px] bg-cyan-edge-left pointer-events-none z-0 opacity-30" />
      <div className="fixed top-1/2 right-0 w-[450px] h-[650px] bg-cyan-edge-right pointer-events-none z-0 opacity-30" />

      {/* MAIN WEBSITE CANVAS CONTAINER */}
      <div className="relative z-10 w-full h-full sm:w-[96vw] sm:max-w-[1600px] sm:h-[94vh] sm:max-h-[1050px] bg-[#0C0C0E] border border-[#29292D] sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col">
        {/* TOP HEADER & BODY GRID */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 bg-[#0C0C0E]/90 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-8">
              {children}
            </main>
          </div>
        </div>

        {/* BOTTOM FIXED PLAYER BAR */}
        <PlayerBar />
      </div>

      {/* FULLSCREEN IMMERSIVE PLAYER OVERLAY */}
      {isExpandedPlayer && <ExpandedPlayer />}

      {/* MODALS */}
      <UploadMusicModal />
      <PlaylistModal />
    </div>
  );
}
