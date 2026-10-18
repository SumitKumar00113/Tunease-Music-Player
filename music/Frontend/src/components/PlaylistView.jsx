import React from 'react';
import { Play, ArrowLeft, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackList } from './TrackList';
import { useNavigate } from 'react-router-dom';

export const PlaylistView = () => {
  const navigate = useNavigate();
  const { selectedPlaylist, setActiveTab, playTrack, deletePlaylist } = usePlayer();

  if (!selectedPlaylist) {
    return (
      <div className="py-12 text-center text-[#A1A1AA]">
        No playlist selected.{' '}
        <button 
          onClick={() => {
            setActiveTab('library');
            navigate('/library');
          }} 
          className="text-[#60cfd8] underline cursor-pointer"
        >
          Go back to Library
        </button>
      </div>
    );
  }

  const playlistId = selectedPlaylist.id || selectedPlaylist._id;
  const songs = selectedPlaylist.songs || [];

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playTrack(songs[0], songs);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${selectedPlaylist.name || selectedPlaylist.playListName}"?`)) {
      await deletePlaylist(playlistId);
      navigate('/library');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* BACK BUTTON & ACTIONS */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setActiveTab('library');
            navigate('/library');
          }}
          className="flex items-center gap-2 text-xs font-bold text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141416] hover:bg-red-500/20 text-[#A1A1AA] hover:text-red-400 border border-[#29292D] text-xs font-semibold transition-colors cursor-pointer"
          title="Delete this playlist"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Playlist</span>
        </button>
      </div>

      {/* PLAYLIST HEADER BANNER */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-[#141416] p-6 sm:p-8 rounded-3xl border border-[#29292D] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#60cfd8]/10 blur-3xl pointer-events-none" />

        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-[#29292D] bg-[#050505]">
          <img
            src={selectedPlaylist.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80'}
            alt={selectedPlaylist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#60cfd8]/15 text-[#60cfd8] border border-[#60cfd8]/30">
            Playlist
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F5F5] tracking-tight font-['Space_Grotesk']">
            {selectedPlaylist.name || selectedPlaylist.playListName}
          </h1>

          <p className="text-xs text-[#A1A1AA] max-w-xl">
            {selectedPlaylist.description || 'Curated music playlist on Tunease platform.'}
          </p>

          <p className="text-xs font-semibold text-[#A1A1AA]">
            Created by <span className="text-[#F5F5F5] font-bold">{selectedPlaylist.artistName || 'You'}</span> • {songs.length} Tracks
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              onClick={handlePlayAll}
              disabled={songs.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-extrabold text-xs shadow-md shadow-[#60cfd8]/20 hover:scale-105 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current stroke-none" />
              <span>Play All</span>
            </button>
          </div>
        </div>
      </div>

      {/* TRACKS LIST */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#F5F5F5]">Tracks in this Playlist</h3>
        <TrackList tracks={songs} />
      </div>

    </div>
  );
};

export default PlaylistView;

