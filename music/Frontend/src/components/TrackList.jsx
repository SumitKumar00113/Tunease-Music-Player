import React from 'react';
import { Play, Heart, Clock, Plus, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (seconds) => {
  const secNum = Number(seconds);
  if (isNaN(secNum) || secNum < 0) return '0:00';
  const mins = Math.floor(secNum / 60);
  const secs = Math.floor(secNum % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const TrackList = ({ tracks = [], showIndex = true, artistPage = false }) => {
  const { currentTrack, isPlaying, playTrack, likedTrackIds, toggleLikeTrack, addTrackToQueue } = usePlayer();

  if (!tracks || tracks.length === 0) {
    return (
      <div className="py-12 text-center text-[#A0B0A5] space-y-2 bg-[#12251A]/40 rounded-2xl border border-[#24392B]">
        <Music className="w-10 h-10 mx-auto text-[#24392B]" />
        <p className="text-sm font-medium">No tracks found in this category.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-1">
      
      {/* TABLE HEADER */}
      <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-bold text-[#A0B0A5] uppercase tracking-wider border-b border-[#24392B] select-none ${artistPage ? 'artist-track-grid' : ''}`}>
        <div className="col-span-1 text-center">#</div>
        <div className={artistPage ? 'col-span-10 sm:col-span-9' : 'col-span-6 sm:col-span-5'}>Title</div>
        {!artistPage && <div className="hidden sm:block col-span-3">Album</div>}
        {!artistPage && <div className="hidden md:block col-span-1 text-right">Streams</div>}
        <div className={`${artistPage ? 'col-span-1' : 'col-span-5 sm:col-span-2'} text-right flex items-center justify-end gap-1`}>
          <Clock className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TRACK ROWS */}
      {tracks.map((track, index) => {
        const trackId = track.id || track._id;
        const isCurrent = currentTrack && (currentTrack.id === trackId || currentTrack._id === trackId);
        const isLiked = likedTrackIds.has(trackId);

        return (
          <div
            key={trackId || index}
            onClick={() => playTrack(track, tracks)}
            className={`group grid grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${artistPage ? 'artist-track-grid' : ''} ${
              isCurrent
                ? 'bg-[#12251A] border border-[#1ED760]/30 text-[#F5F7F5]'
                : 'hover:bg-[#12251A]/60 text-[#A0B0A5] border border-transparent hover:border-[#24392B]'
            }`}
          >
            {/* INDEX / PLAY ICON */}
            <div className="col-span-1 flex items-center justify-center">
              {isCurrent ? (
                isPlaying ? (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#1ED760] animate-eq-1 rounded-full" />
                    <span className="w-0.5 bg-[#1ED760] animate-eq-2 rounded-full" />
                    <span className="w-0.5 bg-[#8BE9A7] animate-eq-3 rounded-full" />
                  </div>
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#1ED760] fill-[#1ED760]" />
                )
              ) : (
                <span className="text-xs font-semibold text-[#A0B0A5] group-hover:hidden">
                  {index + 1}
                </span>
              )}
              {!isCurrent && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(track, tracks);
                  }}
                  className="hidden group-hover:block text-[#F5F7F5] hover:text-[#1ED760] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
            </div>

            {/* TITLE & ARTIST */}
            <div className={artistPage ? 'col-span-10 sm:col-span-9 flex items-center gap-3 min-w-0' : 'col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0'}>
              {track.coverUrl && <img
                src={track.coverUrl}
                alt={track.title}
                className="w-10 h-10 rounded-lg object-cover shadow flex-shrink-0 bg-[#07110C]"
              />}
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate transition-colors ${isCurrent ? 'text-[#1ED760]' : 'text-[#F5F7F5]'}`}>
                  {track.title}
                </p>
                {!artistPage && <p className="text-[11px] text-[#A0B0A5] truncate">
                  {track.artistName}
                </p>}
              </div>
            </div>

            {/* ALBUM */}
            {!artistPage && <div className="hidden sm:block col-span-3 text-xs text-[#A0B0A5] truncate">
              {track.album || 'Single'}
            </div>}

            {/* STREAMS */}
            {!artistPage && <div className="hidden md:block col-span-1 text-xs font-mono text-[#A0B0A5] text-right truncate">
              {(track.playCount || 0).toLocaleString()}
            </div>}

            {/* ACTIONS & DURATION */}
            <div className={`${artistPage ? 'col-span-1' : 'col-span-5 sm:col-span-2'} flex items-center justify-end gap-3 text-xs font-mono`}>
              {!artistPage && <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLikeTrack(trackId);
                }}
                className="text-[#A0B0A5] hover:text-[#1ED760] transition-colors cursor-pointer p-0.5"
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'text-[#1ED760] fill-[#1ED760]' : ''}`} />
              </button>
              </>}

              {!artistPage && <button
                onClick={(e) => {
                  e.stopPropagation();
                  addTrackToQueue(track);
                }}
                className="text-[#A0B0A5] hover:text-[#F5F7F5] transition-colors cursor-pointer p-0.5"
                title="Add to queue"
              >
                <Plus className="w-4 h-4" />
              </button>}

              <span className="text-[#A0B0A5] w-10 text-right">
                {formatTime(track.duration)}
              </span>
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default TrackList;

