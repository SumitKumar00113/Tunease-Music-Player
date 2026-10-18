'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Library, Heart, ListMusic, Plus } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackList } from './TrackList';
import { Playlist, Track } from '../../types';

export const LibraryView: React.FC = () => {
  const router = useRouter();
  const {
    playlists,
    likedTrackIds,
    setSelectedPlaylist,
    setIsCreatePlaylistModalOpen,
    queue,
  } = usePlayer();

  const likedTracks: Track[] = (queue || []).filter((t) =>
    likedTrackIds.has(t.id || t._id)
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] font-['Space_Grotesk'] flex items-center gap-2.5">
            <Library className="w-7 h-7 text-[#60cfd8]" />
            Your Music Library
          </h2>
          <p className="text-xs text-[#A1A1AA]">Manage your saved playlists, favorite tracks, and collections</p>
        </div>

        <button
          onClick={() => setIsCreatePlaylistModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-bold text-xs shadow-md shadow-[#60cfd8]/20 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* QUICK CARDS: LIKED SONGS & PLAYLIST CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LIKED SONGS BANNER CARD */}
        <div
          onClick={() => router.push('/liked')}
          className="group relative h-48 rounded-3xl overflow-hidden bg-gradient-to-tr from-[#0C0C0E] via-[#141416] to-[#60cfd8]/25 p-6 flex flex-col justify-between cursor-pointer border border-[#29292D] hover:border-[#60cfd8]/50 shadow-xl hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#60cfd8]/20 border border-[#60cfd8]/40 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#60cfd8] fill-[#60cfd8]" />
            </div>
            <span className="text-xs font-bold text-[#60cfd8] bg-[#050505]/60 px-3 py-1 rounded-full border border-[#29292D]">
              {likedTracks.length} {likedTracks.length === 1 ? 'Song' : 'Songs'}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-[#F5F5F5] group-hover:text-[#60cfd8] transition-colors">
              Liked Songs
            </h3>
            <p className="text-xs text-[#A1A1AA]">Your favorited audio collection</p>
          </div>
        </div>

        {/* PLAYLIST CARDS */}
        {playlists.map((pl: Playlist) => {
          const plId = pl.id || pl._id;
          return (
            <div
              key={plId}
              onClick={() => {
                setSelectedPlaylist(pl);
                router.push(`/playlist/${plId}`);
              }}
              className="group relative h-48 rounded-3xl overflow-hidden bg-[#141416] p-5 flex flex-col justify-between cursor-pointer border border-[#29292D] hover:border-[#60cfd8]/50 transition-all shadow-md hover:scale-[1.02]"
            >
              <img
                src={
                  pl.coverImage ||
                  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80'
                }
                alt={pl.name}
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/70 to-transparent" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#050505]/60 border border-[#29292D] flex items-center justify-center">
                  <ListMusic className="w-4 h-4 text-[#60cfd8]" />
                </div>
                <span className="text-xs font-mono text-[#A1A1AA] bg-[#050505]/60 px-2.5 py-0.5 rounded-full border border-[#29292D]">
                  {pl.musics ? pl.musics.length : 0} Tracks
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="text-lg font-bold text-[#F5F5F5] group-hover:text-[#60cfd8] transition-colors truncate">
                  {pl.name}
                </h3>
                <p className="text-xs text-[#A1A1AA] truncate">Curated playlist</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIKED SONGS PREVIEW LIST */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-[#F5F5F5] flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#60cfd8] fill-[#60cfd8]" />
          Favorited Tracks
        </h3>
        <TrackList tracks={likedTracks} />
      </div>
    </div>
  );
};

export default LibraryView;
