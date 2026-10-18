import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Heart, 
  Volume2, 
  VolumeX, 
  Music, 
  Mic2, 
  ListMusic, 
  Sparkles 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (seconds) => {
  const secNum = Number(seconds);
  if (isNaN(secNum) || secNum < 0) return '0:00';
  const mins = Math.floor(secNum / 60);
  const secs = Math.floor(secNum % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const ExpandedPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    queue,
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
    setIsExpandedPlayer,
    playTrack
  } = usePlayer();

  const [activeTab, setActiveTab] = useState('lyrics'); // 'lyrics' | 'queue'

  if (!currentTrack) return null;

  const trackId = currentTrack.id || currentTrack._id;
  const isLiked = likedTrackIds.has(trackId);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-10 animate-fadeIn">
      
      {/* ATMOSPHERIC BACKGROUND GLOW */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #d8f4f6 0%, #ffffff 60%, transparent 80%)'
        }}
      />

      {/* TOP BAR: BRANDING & MINIMIZE BUTTON */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#60cfd8]/20 border border-[#60cfd8]/40 flex items-center justify-center text-[#60cfd8]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-wide text-[#F5F5F5] uppercase font-['Space_Grotesk']">
              NOW PLAYING — TUNE<span className="text-[#60cfd8]">ASE</span>
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">High-Fidelity Audio Studio</p>
          </div>
        </div>

        {/* TAB TOGGLE: LYRICS vs QUEUE */}
        <div className="flex items-center gap-1 p-1 bg-[#141416] border border-[#29292D] rounded-full">
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'lyrics'
                ? 'bg-[#60cfd8] text-black shadow-md shadow-[#60cfd8]/30'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>Lyrics</span>
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'queue'
                ? 'bg-[#60cfd8] text-black shadow-md shadow-[#60cfd8]/30'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Queue ({queue.length})</span>
          </button>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setIsExpandedPlayer(false)}
          className="p-2.5 rounded-full bg-[#141416] border border-[#29292D] text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#26262B] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* CENTER IMMERSIVE AREA */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto w-full py-6 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: VINYL / COVER ART */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-[#29292D] group">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />
            )}
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight font-['Space_Grotesk']">
              {currentTrack.title}
            </h1>
            <p className="text-base text-[#32aeb9] font-semibold">
              {currentTrack.artistName}
            </p>
            <p className="text-xs text-[#A1A1AA]">
              {currentTrack.album || 'Single'} • {currentTrack.genre || 'Electronic'}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LYRICS OR REAL-TIME QUEUE */}
        <div className="h-full flex flex-col justify-center min-h-0">
          {activeTab === 'lyrics' ? (
            <div className="bg-[#141416]/90 p-6 sm:p-8 rounded-3xl border border-[#29292D] h-[360px] sm:h-[420px] overflow-y-auto no-scrollbar space-y-6 text-center select-none shadow-xl">
              <p className="text-xs text-[#32aeb9] font-bold uppercase tracking-widest">
                Real-Time Synchronized Lyrics
              </p>
              <div className="space-y-4 text-base sm:text-xl font-bold">
                <p className="text-[#A1A1AA]/60 transition-colors">Neon lights flickering in the haze</p>
                <p className="text-[#A1A1AA]/60 transition-colors">We're driving faster through the city craze</p>
                <p className="text-[#60cfd8] text-2xl font-extrabold scale-105 transition-transform duration-300">
                  Feel the pulse resonating inside your veins
                </p>
                <p className="text-[#F5F5F5] transition-colors">Lost in echoes that forever remain</p>
                <p className="text-[#A1A1AA]/60 transition-colors">Turn up the bass let the system fade</p>
                <p className="text-[#A1A1AA]/60 transition-colors">Until tomorrow's light is made...</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#141416]/90 p-4 rounded-3xl border border-[#29292D] h-[360px] sm:h-[420px] overflow-y-auto no-scrollbar space-y-2 shadow-xl">
              <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest px-3 py-2 border-b border-[#29292D]">
                Next in Queue
              </h4>
              {queue.map((t, idx) => {
                const tId = t.id || t._id;
                const isCurrent = currentTrack && (currentTrack.id === tId || currentTrack._id === tId);
                return (
                  <div
                    key={tId + idx}
                    onClick={() => playTrack(t)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#60cfd8]/15 border border-[#60cfd8]/30 text-white'
                        : 'hover:bg-white/5 text-[#A1A1AA]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={t.coverUrl} alt={t.title} className="w-10 h-10 rounded-xl object-cover border border-[#29292D]" />
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isCurrent ? 'text-[#60cfd8]' : 'text-[#F5F5F5]'}`}>
                          {t.title}
                        </p>
                        <p className="text-[11px] text-[#A1A1AA] truncate">{t.artistName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#A1A1AA]">{formatTime(t.duration)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* BOTTOM CONTROLS & TIMELINE */}
      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-4">
        
        {/* PROGRESS BAR */}
        <div className="space-y-1">
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              seekTo(clickPos * duration);
            }}
            className="w-full h-1.5 hover:h-2.5 bg-[#29292D] rounded-full cursor-pointer relative group transition-all"
          >
            <div 
              className="h-full bg-[#60cfd8] rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white opacity-0 group-hover:opacity-100 shadow-lg shadow-[#60cfd8]/50 transition-opacity" />
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono text-[#A1A1AA]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* AUDIO BUTTON CONTROLS */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => toggleLikeTrack(trackId)}
            className="p-2 text-[#A1A1AA] hover:text-[#60cfd8] transition-colors"
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'text-[#60cfd8] fill-[#60cfd8]' : ''}`} />
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleShuffle}
              className={`p-2 transition-colors ${isShuffle ? 'text-[#60cfd8]' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'}`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={prevTrack}
              className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-14 h-14 rounded-full bg-[#60cfd8] text-black flex items-center justify-center shadow-xl shadow-[#60cfd8]/30 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-black text-black" />
              ) : (
                <Play className="w-6 h-6 fill-black text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 transition-colors ${isRepeat ? 'text-[#60cfd8]' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'}`}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* VOLUME */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-[#A1A1AA] hover:text-[#F5F5F5]">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-[#29292D] rounded-full appearance-none cursor-pointer accent-[#60cfd8]"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default ExpandedPlayer;
