'use client';

import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Track } from '../../types';

interface TrackCardProps {
  track: Track;
  trackList?: Track[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, trackList }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, likedTrackIds, toggleLikeTrack, addTrackToQueue } = usePlayer();

  const trackId = track.id || track._id;
  const isCurrent = currentTrack && (currentTrack.id === trackId || currentTrack._id === trackId);
  const isLiked = likedTrackIds.has(trackId);
  const coverUrl = track.imageUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80';

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, trackList);
    }
  };

  return (
    <div 
      onClick={() => playTrack(track, trackList)}
      className="group relative rounded-2xl bg-[#141416] p-3.5 hover:bg-[#1E1712] border border-[#29292D] hover:border-[#FF5A00]/40 transition-all duration-300 flex flex-col justify-between select-none cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1"
    >
      {/* COVER IMAGE & HOVER PLAY OVERLAY */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 shadow-md bg-[#050505]">
        <img
          src={coverUrl}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
          isCurrent 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
        }`}>
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-[#FF5A00] to-[#FFA000] text-white flex items-center justify-center shadow-xl shadow-black/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isCurrent && isPlaying ? 'Pause' : 'Play'}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current stroke-none" />
            ) : (
              <Play className="w-5 h-5 fill-current stroke-none ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* TRACK DETAILS */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-1">
          <h3 className={`text-sm font-bold truncate transition-colors ${isCurrent ? 'text-[#FF7A00]' : 'text-[#F5F5F5]'}`}>
            {track.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeTrack(trackId);
            }}
            className="text-[#A1A1AA] hover:text-[#FF5A00] transition-colors flex-shrink-0 cursor-pointer p-0.5"
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-[#FF5A00] fill-[#FF5A00]' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-[#A1A1AA] truncate hover:text-[#F5F5F5] transition-colors">
          {track.artistName || track.artist}
        </p>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-3 pt-2 border-t border-[#29292D] flex items-center justify-between text-[11px] text-[#A1A1AA]">
        <span className="px-2 py-0.5 rounded-full bg-[#0C0C0E] text-[#FF8A00] font-medium truncate max-w-[90px] border border-[#29292D]">
          {track.genre || 'Single'}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addTrackToQueue(track);
          }}
          className="hover:text-[#FF7A00] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="Add to queue"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Queue</span>
        </button>
      </div>
    </div>
  );
};
