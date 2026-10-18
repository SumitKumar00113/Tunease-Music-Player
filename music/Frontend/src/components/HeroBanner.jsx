import React from 'react';
import { Play, Pause, Plus, Sparkles, Upload } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const HeroBanner = () => {
  const { playTrack, addTrackToQueue, currentTrack, isPlaying, togglePlayPause, queue, setIsUploadModalOpen, user } = usePlayer();
  const isArtist = user?.role === 'artist';
  
  const hasTracks = queue && queue.length > 0;
  const heroTrack = hasTracks ? queue[0] : null;
  const isCurrentHero = heroTrack && currentTrack && (currentTrack.id === heroTrack.id || currentTrack._id === heroTrack.id);

  const handlePlayHero = () => {
    if (!heroTrack) return;
    if (isCurrentHero) {
      togglePlayPause();
    } else {
      playTrack(heroTrack, queue);
    }
  };

  if (!hasTracks) {
    return (
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C0C0E] via-[#141416] to-[#050505] p-6 sm:p-10 border border-[#29292D] shadow-2xl mb-8 group">
        {/* ATMOSPHERIC GREEN RADIAL GLOW */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#60cfd8]/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#60cfd8] opacity-10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#60cfd8]/15 border border-[#60cfd8]/30 text-[#60cfd8] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Tunease Music Streaming
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-black text-[#F5F5F5] tracking-tight leading-none font-['Space_Grotesk']">
              Music For Every Moment
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#32aeb9]">
              Stream independent artists, explore new genres, and share playlists
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-lg leading-relaxed">
            {isArtist
              ? 'Discover fresh music and share your original tracks with Tunease listeners.'
              : 'Discover fresh music, explore new genres, and find your next favorite track.'}
          </p>

          {isArtist && <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-extrabold text-sm shadow-xl shadow-[#60cfd8]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Your First Track</span>
            </button>
          </div>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#141416] p-6 sm:p-8 md:p-10 border border-[#29292D] shadow-2xl mb-8 group">
      
      {/* ATMOSPHERIC GREEN RADIAL GLOW */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#60cfd8]/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#60cfd8] opacity-10 rounded-full blur-[120px] pointer-events-none" />

      {/* BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroTrack.coverUrl}
          alt={heroTrack.title}
          className="w-full h-full object-cover object-center opacity-20 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/80 to-transparent" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="max-w-2xl space-y-4">
          {/* BADGES */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#60cfd8]/15 border border-[#60cfd8]/30 text-[#60cfd8] text-xs font-bold uppercase tracking-wider">
              Featured Track
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#050505]/60 text-[#A1A1AA] text-xs font-semibold border border-[#29292D]">
              {heroTrack.genre || 'Single'}
            </span>
          </div>

          {/* TITLE & ARTIST */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-black text-[#F5F5F5] tracking-tight leading-tight font-['Space_Grotesk']">
              {heroTrack.title}
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#32aeb9] flex items-center gap-2">
              <span>{heroTrack.artistName}</span>
              <span className="text-xs text-[#A1A1AA] font-normal">• {heroTrack.album || 'Single'}</span>
            </p>
          </div>

          {/* DESCRIPTION */}
          {heroTrack.description && (
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-lg line-clamp-2 leading-relaxed">
              {heroTrack.description}
            </p>
          )}

          {/* ACTIONS */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayHero}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-extrabold text-sm shadow-xl shadow-[#60cfd8]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isCurrentHero && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current stroke-none" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current stroke-none ml-0.5" />
                  <span>Play Now</span>
                </>
              )}
            </button>

            <button
              onClick={() => addTrackToQueue(heroTrack)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#050505]/60 border border-[#29292D] hover:border-[#60cfd8] text-[#F5F5F5] font-bold text-sm hover:bg-[#141416] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#60cfd8]" />
              <span>Add to Queue</span>
            </button>
          </div>
        </div>

        {/* HERO ALBUM ARTWORK PREVIEW */}
        <div className="hidden md:block flex-shrink-0 relative w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-2xl border border-[#29292D] group/cover">
          <img
            src={heroTrack.coverUrl}
            alt={heroTrack.title}
            className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>

    </div>
  );
};

export default HeroBanner;

