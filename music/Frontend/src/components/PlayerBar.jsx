import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Heart, 
  Volume2, 
  VolumeX, 
  Maximize2 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (seconds) => {
  const secNum = Number(seconds);
  if (isNaN(secNum) || secNum < 0) return '0:00';
  const mins = Math.floor(secNum / 60);
  const secs = Math.floor(secNum % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    likedTrackIds,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLikeTrack,
    setIsExpandedPlayer
  } = usePlayer();

  if (!currentTrack) return null;

  const trackId = currentTrack.id || currentTrack._id;
  const isLiked = likedTrackIds.has(trackId);
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <footer className="app-playerbar h-20 flex-shrink-0 bg-[#0C0C0E] border-t border-[#29292D] fixed bottom-0 left-0 right-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      
      {/* 1. LEFT TRACK INFORMATION */}
      <div className="flex items-center gap-3 min-w-[180px] sm:min-w-[220px] w-1/4">
        <button
          type="button"
          onClick={() => setIsExpandedPlayer(true)}
          aria-label="Open expanded player"
          className="relative w-12 h-12 rounded-xl overflow-hidden cursor-pointer group shadow-md flex-shrink-0 bg-[#050505] border border-[#29292D]"
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-4 h-4 text-[#F5F5F5]" />
          </div>
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpandedPlayer(true)}
              aria-label={`Open player for ${currentTrack.title}`}
              className="text-xs font-bold text-[#F5F5F5] truncate cursor-pointer hover:underline"
            >
              {currentTrack.title}
            </button>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                <span className="w-0.5 bg-[#60cfd8] animate-eq-1 rounded-full" />
                <span className="w-0.5 bg-[#60cfd8] animate-eq-2 rounded-full" />
                <span className="w-0.5 bg-[#32aeb9] animate-eq-3 rounded-full" />
              </div>
            )}
          </div>
          <p className="text-[11px] text-[#A1A1AA] truncate hover:text-[#F5F5F5] transition-colors">
            {currentTrack.artistName}
          </p>
        </div>

        <button
          onClick={() => toggleLikeTrack(trackId)}
          className="ml-1 text-[#A1A1AA] hover:text-[#60cfd8] transition-colors cursor-pointer p-1"
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-[#60cfd8] fill-[#60cfd8]' : ''}`} />
        </button>
      </div>

      {/* 2. CENTER CONTROLS & TIMELINE PROGRESS */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={toggleShuffle}
            aria-label="Toggle shuffle"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isShuffle ? 'text-[#60cfd8]' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

            <button
            onClick={prevTrack}
            aria-label="Previous track"
            className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer"
            title="Previous"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-10 h-10 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] flex items-center justify-center shadow-lg shadow-[#60cfd8]/30 hover:scale-108 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current stroke-none" />
            ) : (
              <Play className="w-4 h-4 fill-current stroke-none ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            aria-label="Next track"
            className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer"
            title="Next"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={toggleRepeat}
            aria-label="Toggle repeat"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isRepeat ? 'text-[#60cfd8]' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
            }`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* TIMELINE PROGRESS SLIDER */}
        <div className="w-full flex items-center gap-3 text-[10px] font-mono text-[#A1A1AA] select-none">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seekTo(Number(event.target.value))}
            disabled={!duration}
            aria-label="Track progress"
            className="app-track-progress flex-1 h-1 bg-[#29292D] rounded-full cursor-pointer appearance-none"
            style={{ '--track-progress': `${progressPercent}%` }}
          />
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. RIGHT VOLUME & FULLSCREEN SHORTCUTS */}
      <div className="flex items-center justify-end gap-3 min-w-[160px] sm:min-w-[180px] w-1/4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
            className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="w-18 sm:w-24 h-1 bg-[#29292D] rounded-full appearance-none cursor-pointer accent-[#60cfd8]"
          />
        </div>

        <button
          onClick={() => setIsExpandedPlayer(true)}
          aria-label="Open fullscreen player"
          className="text-[#A1A1AA] hover:text-[#60cfd8] transition-colors p-1 cursor-pointer"
          title="Fullscreen Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

    </footer>
  );
};

export default PlayerBar;

