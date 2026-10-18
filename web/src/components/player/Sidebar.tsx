'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Compass, 
  Library, 
  Heart, 
  Plus, 
  Upload, 
  ListMusic, 
  Music,
  FolderKanban
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Playlist } from '../../types';

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    playlists, 
    setSelectedPlaylist, 
    setIsUploadModalOpen, 
    setIsCreatePlaylistModalOpen,
    likedTrackIds,
    user
  } = usePlayer();

  const isNavActive = (path: string) => {
    if (path === '/discover' && (pathname === '/discover' || pathname === '/app')) return true;
    return pathname === path;
  };

  return (
    <aside className="w-60 sm:w-64 flex-shrink-0 flex flex-col h-full bg-[#0C0C0E] border-r border-[#29292D] p-4 select-none justify-between z-20">
      <div className="space-y-6">
        {/* BRAND & HEADER */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5A00] to-[#FFA000] flex items-center justify-center shadow-lg shadow-[#FF5A00]/25 transition-transform group-hover:scale-105">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#F5F5F5] font-['Space_Grotesk']">
                TUNE<span className="text-[#FF7A00]">ASE</span>
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] font-medium">Lossless Streaming</p>
          </div>
        </Link>

        {/* MAIN NAVIGATION */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-[#A1A1AA]/70 uppercase tracking-widest mb-2">
            Menu
          </p>

          <Link
            href="/discover"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isNavActive('/discover')
                ? 'bg-[#141416] text-[#FF7A00] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            href="/explore"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isNavActive('/explore')
                ? 'bg-[#141416] text-[#FF7A00] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explore Genres</span>
          </Link>

          <Link
            href="/library"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isNavActive('/library')
                ? 'bg-[#141416] text-[#FF7A00] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Your Library</span>
          </Link>
        </nav>

        {/* PLAYLISTS & SAVED MUSIC */}
        <div className="space-y-1 pt-2 border-t border-[#29292D]">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold text-[#A1A1AA]/70 uppercase tracking-widest">
              Playlists & Favorites
            </p>
            <button
              onClick={() => setIsCreatePlaylistModalOpen(true)}
              className="p-1 rounded-md text-[#A1A1AA] hover:text-[#FF7A00] hover:bg-[#141416] transition-colors cursor-pointer"
              title="Create Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/liked"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isNavActive('/liked')
                ? 'bg-[#141416] text-[#FF7A00] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF5A00] to-[#FF8A00] flex items-center justify-center shadow-sm">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span>Liked Songs</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#141416] text-[#FF7A00] font-mono border border-[#29292D]">
              {likedTrackIds.size}
            </span>
          </Link>

          {/* USER'S PLAYLISTS */}
          <div className="mt-2 space-y-0.5 max-h-48 overflow-y-auto">
            {playlists.length === 0 ? (
              <p className="text-[11px] text-[#A1A1AA]/60 px-3 py-1.5 italic">No playlists created yet</p>
            ) : (
              playlists.map((pl: Playlist) => (
                <button
                  key={pl.id || pl._id}
                  onClick={() => {
                    setSelectedPlaylist(pl);
                    router.push(`/playlist/${pl._id || pl.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416] truncate transition-all text-left cursor-pointer"
                >
                  <ListMusic className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
                  <span className="truncate">{pl.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      {user?.role === 'artist' && (
        <div className="space-y-2 pt-3 border-t border-[#29292D]">
          <Link
            href="/dashboard"
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isNavActive('/dashboard')
                ? 'bg-[#141416] text-[#FF7A00] border border-[#29292D]'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-[#FF7A00]" />
            <span>Manage Uploads</span>
          </Link>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] hover:brightness-110 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Music</span>
          </button>
        </div>
      )}
    </aside>
  );
};
