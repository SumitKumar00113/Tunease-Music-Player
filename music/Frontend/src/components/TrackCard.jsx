import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const TrackCard = ({ track, trackList }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, likedTrackIds, toggleLikeTrack, addTrackToQueue } = usePlayer();

  const trackId = track.id || track._id;
  const isCurrent = currentTrack && (currentTrack.id === trackId || currentTrack._id === trackId);
  const isLiked = likedTrackIds.has(trackId);

  const handlePlayClick = (e) => {
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
      className="group relative rounded-2xl bg-[#12251A] p-3.5 hover:bg-[#162e20] border border-[#24392B] hover:border-[#1ED760]/40 transition-all duration-300 flex flex-col justify-between select-none cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1"
    >
      {/* COVER IMAGE & HOVER PLAY OVERLAY */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 shadow-md bg-[#07110C]">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* EXPLICIT BADGE */}
        {track.isExplicit && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-[#F5F7F5] border border-white/10 uppercase">
            Explicit
          </span>
        )}

        {/* HOVER PLAY BUTTON (SPOTIFY VIBRANT GREEN STYLE) */}
        <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
          isCurrent 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
        }`}>
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-[#1ED760] hover:bg-[#1fdf65] text-[#07110C] flex items-center justify-center shadow-xl shadow-black/60 hover:scale-108 active:scale-95 transition-all cursor-pointer"
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
          <h3 className={`text-sm font-bold truncate transition-colors ${isCurrent ? 'text-[#1ED760]' : 'text-[#F5F7F5]'}`}>
            {track.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeTrack(trackId);
            }}
            className="text-[#A0B0A5] hover:text-[#1ED760] transition-colors flex-shrink-0 cursor-pointer p-0.5"
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-[#1ED760] fill-[#1ED760]' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-[#A0B0A5] truncate hover:text-[#F5F7F5] transition-colors">
          {track.artistName}
        </p>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-3 pt-2 border-t border-[#24392B] flex items-center justify-between text-[11px] text-[#A0B0A5]">
        <span className="px-2 py-0.5 rounded-full bg-[#0D1B13] text-[#8BE9A7] font-medium truncate max-w-[90px] border border-[#24392B]">
          {track.genre || 'Single'}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addTrackToQueue(track);
          }}
          className="hover:text-[#1ED760] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          title="Add to queue"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Queue</span>
        </button>
      </div>

    </div>
  );
};

export default TrackCard;

