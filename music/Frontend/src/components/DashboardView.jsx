import React, { useState } from 'react';
import { 
  UploadCloud, 
  PlayCircle, 
  ListMusic, 
  Plus, 
  Play, 
  Trash2, 
  Radio, 
  CheckCircle2, 
  Music,
  FolderKanban
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

export const DashboardView = () => {
  const navigate = useNavigate();
  const { 
    uploadedTracks, 
    playlists, 
    setIsUploadModalOpen, 
    setIsCreatePlaylistModalOpen,
    playTrack,
    deleteUploadedTrack,
    setSelectedPlaylist,
    setActiveTab,
    user
  } = usePlayer();

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'popular' | 'recent'

  // Calculate real aggregated stats from actual tracks
  const totalStreams = uploadedTracks.reduce((acc, track) => acc + (track.playCount || 0), 0);

  // Filtered tracks logic
  const sortedTracks = [...uploadedTracks].sort((a, b) => {
    if (filterTab === 'popular') return (b.playCount || 0) - (a.playCount || 0);
    if (filterTab === 'recent') return (b.releaseDate || '').localeCompare(a.releaseDate || '');
    return 0;
  });

  const formatDuration = (seconds) => {
    const secNum = Number(seconds);
    if (isNaN(secNum) || secNum < 0) return '0:00';
    const mins = Math.floor(secNum / 60);
    const secs = Math.floor(secNum % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const userName = user?.fullName
    ? (typeof user.fullName === 'string'
        ? user.fullName
        : `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim())
    : 'Music Creator';
  const avatarUrl = user?.profilePhoto;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* 1. TOP CREATOR SPOTLIGHT BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-[#12251A] p-6 sm:p-8 border border-[#24392B] shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#1ED760]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Creator Avatar"
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#1ED760] shadow-lg shadow-[#1ED760]/20"
                />
              ) : (
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#0D1B13] border-2 border-[#1ED760] flex items-center justify-center text-2xl font-bold text-[#1ED760]">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 p-1 bg-[#1ED760] rounded-full border-2 border-[#0D1B13]" title="Verified Creator">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#07110C]" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#1ED760]/15 text-[#1ED760] border border-[#1ED760]/30">
                  {user?.role === 'artist' ? 'Artist & Creator' : 'Creator Studio'}
                </span>
                {user?._id && (
                  <span className="text-xs text-[#A0B0A5] font-mono">ID: {user._id.slice(-6)}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F7F5] tracking-tight font-['Space_Grotesk']">
                {userName}
              </h1>
              <p className="text-xs text-[#A0B0A5] max-w-lg">
                Manage your music releases, monitor streams, and publish new tracks to the Tunease streaming catalog.
              </p>
            </div>
          </div>

          {/* QUICK TOP ACTIONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1ED760] hover:bg-[#1fdf65] text-[#07110C] font-extrabold text-xs shadow-lg shadow-[#1ED760]/20 hover:scale-105 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Track</span>
            </button>

            <button
              onClick={() => setIsCreatePlaylistModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D1B13] border border-[#24392B] hover:border-[#1ED760] text-[#F5F7F5] font-semibold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#1ED760]" />
              <span>New Playlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* PUBLISHED TRACKS */}
        <div className="bg-[#12251A] p-5 rounded-2xl border border-[#24392B] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#A0B0A5] uppercase tracking-wider">Published Releases</span>
            <div className="w-8 h-8 rounded-xl bg-[#1ED760]/10 text-[#1ED760] flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] font-mono">
              {uploadedTracks.length} {uploadedTracks.length === 1 ? 'Track' : 'Tracks'}
            </h3>
            <p className="text-[11px] text-[#A0B0A5]">
              Live in streaming catalog
            </p>
          </div>
        </div>

        {/* TOTAL STREAMS CARD */}
        <div className="bg-[#12251A] p-5 rounded-2xl border border-[#24392B] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#A0B0A5] uppercase tracking-wider">Total Streams</span>
            <div className="w-8 h-8 rounded-xl bg-[#1ED760]/10 text-[#1ED760] flex items-center justify-center">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] font-mono">
              {totalStreams.toLocaleString()}
            </h3>
            <p className="text-[11px] text-[#8BE9A7] font-semibold">
              Real listener playback events
            </p>
          </div>
        </div>

        {/* CREATED PLAYLISTS */}
        <div className="bg-[#12251A] p-5 rounded-2xl border border-[#24392B] space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#A0B0A5] uppercase tracking-wider">Active Playlists</span>
            <div className="w-8 h-8 rounded-xl bg-[#1ED760]/10 text-[#1ED760] flex items-center justify-center">
              <ListMusic className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] font-mono">
              {playlists.length} {playlists.length === 1 ? 'Playlist' : 'Playlists'}
            </h3>
            <p className="text-[11px] text-[#A0B0A5]">
              Curated soundscapes
            </p>
          </div>
        </div>

      </div>

      {/* 3. MANAGE YOUR MUSIC CATALOG */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#F5F7F5] flex items-center gap-2 font-['Space_Grotesk']">
              <FolderKanban className="w-5 h-5 text-[#1ED760]" />
              Manage Uploaded Music ({uploadedTracks.length})
            </h3>
            <p className="text-xs text-[#A0B0A5]">Play tracks, review durations, or remove songs from the live database</p>
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-1.5 bg-[#0D1B13] p-1 rounded-xl border border-[#24392B] text-xs font-semibold">
            {[
              { id: 'all', label: 'All' },
              { id: 'popular', label: 'Most Streamed' },
              { id: 'recent', label: 'Recently Added' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-[#1ED760] text-[#07110C] font-bold shadow-sm'
                    : 'text-[#A0B0A5] hover:text-[#F5F7F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TRACKS LIST */}
        {sortedTracks.length === 0 ? (
          <div className="py-16 text-center bg-[#12251A] rounded-3xl border border-[#24392B] space-y-3 p-6">
            <UploadCloud className="w-12 h-12 mx-auto text-[#24392B]" />
            <h4 className="text-base font-bold text-[#F5F7F5]">No tracks uploaded yet</h4>
            <p className="text-xs text-[#A0B0A5] max-w-sm mx-auto">
              Upload your high-fidelity MP3 or WAV audio tracks with album art to publish them to the streaming catalog.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1ED760] hover:bg-[#1fdf65] text-[#07110C] font-bold text-xs shadow-md shadow-[#1ED760]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Upload First Track</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#12251A] rounded-2xl border border-[#24392B] overflow-hidden divide-y divide-[#24392B]">
            {sortedTracks.map((track, idx) => (
              <div
                key={track.id || track._id || idx}
                className="flex items-center justify-between p-4 hover:bg-[#162e20]/60 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 group bg-[#07110C]">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => playTrack(track, sortedTracks)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#1ED760] transition-opacity cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F5F7F5] truncate">{track.title}</h4>
                    <p className="text-[11px] text-[#A0B0A5] truncate">{track.artistName} • {track.genre || 'Single'}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-6 text-xs text-[#A0B0A5] font-mono">
                  <span>{(track.playCount || 0).toLocaleString()} streams</span>
                  <span>{formatDuration(track.duration)}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => playTrack(track, sortedTracks)}
                    className="p-2 rounded-xl bg-[#0D1B13] hover:bg-[#1ED760]/20 text-[#A0B0A5] hover:text-[#1ED760] transition-colors border border-[#24392B] cursor-pointer"
                    title="Play track"
                  >
                    <Play className="w-4 h-4 fill-current stroke-none" />
                  </button>

                  <button
                    onClick={async () => {
                      if (window.confirm(`Delete "${track.title}" from library?`)) {
                        await deleteUploadedTrack(track.id || track._id);
                      }
                    }}
                    className="p-2 rounded-xl bg-[#0D1B13] hover:bg-red-500/20 text-[#A0B0A5] hover:text-red-400 transition-colors border border-[#24392B] cursor-pointer"
                    title="Delete track from backend"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. USER PLAYLISTS MANAGEMENT */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#F5F7F5] flex items-center gap-2 font-['Space_Grotesk']">
            <ListMusic className="w-5 h-5 text-[#1ED760]" />
            Your Created Playlists ({playlists.length})
          </h3>
          <button
            onClick={() => setIsCreatePlaylistModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#12251A] border border-[#24392B] hover:border-[#1ED760] text-xs font-bold text-[#F5F7F5] hover:text-[#1ED760] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Playlist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id || pl._id}
              onClick={() => {
                setSelectedPlaylist(pl);
                setActiveTab('playlist');
                navigate(`/playlist/${pl._id || pl.id}`);
              }}
              className="bg-[#12251A] p-4 rounded-2xl border border-[#24392B] hover:border-[#1ED760]/50 cursor-pointer flex items-center gap-4 transition-all group shadow-sm hover:shadow-md"
            >
              <img
                src={pl.coverUrl}
                alt={pl.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#24392B] flex-shrink-0 group-hover:scale-105 transition-transform bg-[#07110C]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#F5F7F5] group-hover:text-[#1ED760] transition-colors truncate">
                  {pl.name || pl.playListName}
                </h4>
                <p className="text-[11px] text-[#A0B0A5] truncate">{pl.songs ? pl.songs.length : 0} Tracks</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardView;

