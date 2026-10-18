'use client';

import React from 'react';
import { Heart, Play } from 'lucide-react';
import { usePlayer } from '../../../context/PlayerContext';
import { TrackList } from '../../../components/player/TrackList';
import { Track } from '../../../types';

export default function LikedPage() {
  const { queue, likedTrackIds, playTrack, user } = usePlayer();

  const likedTracks: Track[] = (queue || []).filter((t) =>
    likedTrackIds.has(t.id || t._id)
  );

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  const userName = user?.fullName
    ? typeof user.fullName === 'string'
      ? user.fullName
      : `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim()
    : 'Listener';

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* LIKED HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#0C0C0E] via-[#141416] to-[#60cfd8]/20 border border-[#29292D] p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 shadow-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#60cfd8]/10 blur-3xl pointer-events-none" />

        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-tr from-[#60cfd8] to-[#32aeb9] flex items-center justify-center shadow-2xl flex-shrink-0 shadow-[#60cfd8]/20">
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-[#050505] fill-[#050505]" />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#60cfd8]/15 text-[#60cfd8] border border-[#60cfd8]/30">
            Favorites Collection
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F5F5] tracking-tight font-['Space_Grotesk']">
            Liked Songs
          </h1>

          <p className="text-xs text-[#A1A1AA]">
            Curated by <span className="text-[#F5F5F5] font-bold">{userName}</span> • {likedTracks.length}{' '}
            {likedTracks.length === 1 ? 'Track' : 'Tracks'}
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start">
            <button
              onClick={handlePlayAll}
              disabled={likedTracks.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-extrabold text-xs shadow-md shadow-[#60cfd8]/20 hover:scale-105 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current stroke-none" />
              <span>Play Favorites</span>
            </button>
          </div>
        </div>
      </section>

      {/* TRACKS LIST */}
      <section className="space-y-4">
        {likedTracks.length === 0 ? (
          <div className="p-12 text-center bg-[#141416] rounded-2xl border border-[#29292D] space-y-2">
            <Heart className="w-8 h-8 text-[#A1A1AA] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#F5F5F5]">Your liked collection is empty</p>
            <p className="text-xs text-[#A1A1AA]">
              Tap the heart icon on any track in Tunease to save it here.
            </p>
          </div>
        ) : (
          <TrackList tracks={likedTracks} />
        )}
      </section>
    </div>
  );
}
