'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  PlayCircle,
  Plus,
  Play,
  Trash2,
  Radio,
  Music,
  FolderKanban,
  Activity,
  UserRound,
  ArrowUpRight,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Track } from '../../types';

export const DashboardView: React.FC = () => {
  const router = useRouter();
  const {
    uploadedTracks,
    playlists,
    setIsUploadModalOpen,
    setIsCreatePlaylistModalOpen,
    playTrack,
    deleteUploadedTrack,
    setSelectedPlaylist,
    user,
  } = usePlayer();

  const [filterTab, setFilterTab] = useState<'all' | 'popular' | 'recent'>('all');

  const totalStreams = uploadedTracks.reduce((acc, track) => {
    return acc + (track.duration ? Math.round(track.duration / 3) : 120);
  }, 0);

  const sortedTracks = [...uploadedTracks].sort((a, b) => {
    if (filterTab === 'popular') return (b.duration || 0) - (a.duration || 0);
    if (filterTab === 'recent') {
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    }
    return 0;
  });

  const formatDuration = (seconds?: number): string => {
    const secNum = Number(seconds);
    if (isNaN(secNum) || secNum < 0) return '0:00';
    const mins = Math.floor(secNum / 60);
    const secs = Math.floor(secNum % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const userName = user?.fullName
    ? typeof user.fullName === 'string'
      ? user.fullName
      : `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim()
    : 'Music Creator';

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* CREATOR HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#0C0C0E] via-[#141416] to-[#60cfd8]/15 border border-[#29292D] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#60cfd8]/15 border border-[#60cfd8]/30 text-[#60cfd8] text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Tunease Creator Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight font-['Space_Grotesk']">
            Welcome back, {userName}
          </h1>

          <p className="text-xs text-[#A1A1AA] max-w-lg">
            Manage your high-fidelity releases, inspect streaming analytics, and distribute losslessly to listeners worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-extrabold text-xs shadow-md shadow-[#60cfd8]/20 hover:scale-105 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Release New Track</span>
            </button>

            <button
              onClick={() => setIsCreatePlaylistModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141416] hover:bg-white/5 border border-[#29292D] text-[#F5F5F5] font-bold text-xs hover:border-[#60cfd8] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Playlist</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center w-36 h-36 rounded-full bg-[#60cfd8]/10 border border-[#60cfd8]/30 shadow-2xl relative">
          <Music className="w-16 h-16 text-[#60cfd8] animate-pulse" />
        </div>
      </section>

      {/* AGGREGATED STATS METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141416] border border-[#29292D] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Total Streams</span>
            <Activity className="w-4 h-4 text-[#60cfd8]" />
          </div>
          <p className="text-2xl font-extrabold text-[#F5F5F5]">{totalStreams.toLocaleString()}</p>
          <p className="text-[10px] text-[#60cfd8]">Lossless playbacks</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141416] border border-[#29292D] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Published Tracks</span>
            <PlayCircle className="w-4 h-4 text-[#60cfd8]" />
          </div>
          <p className="text-2xl font-extrabold text-[#F5F5F5]">{uploadedTracks.length}</p>
          <p className="text-[10px] text-[#A1A1AA]">Live in master library</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141416] border border-[#29292D] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Playlists Created</span>
            <FolderKanban className="w-4 h-4 text-[#60cfd8]" />
          </div>
          <p className="text-2xl font-extrabold text-[#F5F5F5]">{playlists.length}</p>
          <p className="text-[10px] text-[#A1A1AA]">Custom collections</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141416] border border-[#29292D] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Global Listeners</span>
            <UserRound className="w-4 h-4 text-[#60cfd8]" />
          </div>
          <p className="text-2xl font-extrabold text-[#F5F5F5]">1,420</p>
          <p className="text-[10px] text-[#60cfd8]">+18% this month</p>
        </div>
      </div>

      {/* TRACKS MANAGEMENT */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29292D] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">Your Master Releases</h2>
            <p className="text-xs text-[#A1A1AA]">Manage uploaded audio assets and track performance</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#141416] border border-[#29292D] rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'all' ? 'bg-[#60cfd8] text-black' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
              }`}
            >
              All Tracks
            </button>
            <button
              onClick={() => setFilterTab('popular')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'popular' ? 'bg-[#60cfd8] text-black' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setFilterTab('recent')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'recent' ? 'bg-[#60cfd8] text-black' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
              }`}
            >
              Recent
            </button>
          </div>
        </div>

        {sortedTracks.length === 0 ? (
          <div className="py-16 text-center bg-[#141416] rounded-3xl border border-[#29292D] p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#60cfd8]/15 text-[#60cfd8] flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F5F5F5]">No tracks released yet</h3>
              <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
                Release your first lossless studio recording to Tunease and reach audiophiles worldwide.
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-bold text-xs shadow-md shadow-[#60cfd8]/20 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Track</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#141416] rounded-2xl border border-[#29292D] divide-y divide-[#29292D] overflow-hidden">
            {sortedTracks.map((track: Track, idx: number) => {
              const trackId = track.id || track._id;
              return (
                <div
                  key={trackId}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-mono text-[#A1A1AA] w-6 text-center">
                      {idx + 1}
                    </span>

                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#050505] border border-[#29292D]">
                      <img
                        src={track.imageUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => playTrack(track, sortedTracks)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Play className="w-5 h-5 text-[#60cfd8] fill-[#60cfd8]" />
                      </button>
                    </div>

                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#60cfd8] transition-colors truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-[#A1A1AA] truncate">
                        {track.album || 'Single'} • {track.genre || 'Electronic'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA]">
                    <span className="hidden sm:inline">
                      {formatDuration(track.duration)}
                    </span>

                    <button
                      onClick={() => deleteUploadedTrack(trackId)}
                      className="p-2 rounded-lg text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete track"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardView;
