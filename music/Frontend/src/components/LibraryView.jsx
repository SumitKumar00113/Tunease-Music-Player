import React from 'react';
import { Library, Heart, ListMusic, Plus } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackList } from './TrackList';
import { useNavigate } from 'react-router-dom';

export const LibraryView = () => {
  const navigate = useNavigate();
  const { 
    playlists, 
    likedTrackIds, 
    setSelectedPlaylist, 
    setActiveTab, 
    setIsCreatePlaylistModalOpen,
    queue
  } = usePlayer();

  const likedTracks = (queue || []).filter(t => likedTrackIds.has(t.id || t._id));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] font-['Space_Grotesk'] flex items-center gap-2.5">
            <Library className="w-7 h-7 text-[#1ED760]" />
            Your Music Library
          </h2>
          <p className="text-xs text-[#A0B0A5]">Manage your saved playlists, favorite tracks, and collections</p>
        </div>

        <button
          onClick={() => setIsCreatePlaylistModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1ED760] hover:bg-[#1fdf65] text-[#07110C] font-bold text-xs shadow-md shadow-[#1ED760]/20 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* QUICK CARDS: LIKED SONGS & PLAYLIST CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* LIKED SONGS BANNER CARD */}
        <div 
          onClick={() => {
            setActiveTab('liked');
            navigate('/liked');
          }}
          className="group relative h-48 rounded-3xl overflow-hidden bg-gradient-to-tr from-[#0D1B13] via-[#12251A] to-[#1ED760]/25 p-6 flex flex-col justify-between cursor-pointer border border-[#24392B] hover:border-[#1ED760]/50 shadow-xl hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#1ED760]/20 border border-[#1ED760]/40 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#1ED760] fill-[#1ED760]" />
            </div>
            <span className="text-xs font-bold text-[#8BE9A7] bg-[#07110C]/60 px-3 py-1 rounded-full border border-[#24392B]">
              {likedTracks.length} {likedTracks.length === 1 ? 'Song' : 'Songs'}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-[#F5F7F5] group-hover:text-[#1ED760] transition-colors">Liked Songs</h3>
            <p className="text-xs text-[#A0B0A5]">Your favorited audio collection</p>
          </div>
        </div>

        {/* PLAYLIST CARDS */}
        {playlists.map((pl) => (
          <div
            key={pl.id || pl._id}
            onClick={() => {
              setSelectedPlaylist(pl);
              setActiveTab('playlist');
              navigate(`/playlist/${pl._id || pl.id}`);
            }}
            className="group relative h-48 rounded-3xl overflow-hidden bg-[#12251A] p-5 flex flex-col justify-between cursor-pointer border border-[#24392B] hover:border-[#1ED760]/50 transition-all shadow-md hover:scale-[1.02]"
          >
            <img
              src={pl.coverUrl}
              alt={pl.name}
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B13] via-[#0D1B13]/70 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#07110C]/60 border border-[#24392B] flex items-center justify-center">
                <ListMusic className="w-4 h-4 text-[#8BE9A7]" />
              </div>
              <span className="text-xs font-mono text-[#A0B0A5] bg-[#07110C]/60 px-2.5 py-0.5 rounded-full border border-[#24392B]">
                {pl.songs ? pl.songs.length : 0} Tracks
              </span>
            </div>

            <div className="relative z-10 space-y-1">
              <h3 className="text-lg font-bold text-[#F5F7F5] group-hover:text-[#1ED760] transition-colors truncate">
                {pl.name || pl.playListName}
              </h3>
              <p className="text-xs text-[#A0B0A5] truncate">By {pl.artistName || 'You'}</p>
            </div>
          </div>
        ))}

      </div>

      {/* LIKED SONGS PREVIEW LIST */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-[#F5F7F5] flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#1ED760] fill-[#1ED760]" />
          Favorited Tracks
        </h3>
        <TrackList tracks={likedTracks} />
      </div>

    </div>
  );
};

export default LibraryView;

