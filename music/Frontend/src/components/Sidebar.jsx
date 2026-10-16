import React from 'react';
import { 
  Home, 
  Compass, 
  Library, 
  Heart, 
  Plus, 
  Upload, 
  ListMusic, 
  Music,
  FolderKanban
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { 
    activeTab, 
    setActiveTab, 
    playlists, 
    setSelectedPlaylist, 
    setIsUploadModalOpen, 
    setIsCreatePlaylistModalOpen,
    likedTrackIds,
    user
  } = usePlayer();

  const handleNav = (tab) => {
    setActiveTab(tab);
    if (tab === 'home' || tab === 'discover') navigate('/');
    else if (tab === 'explore') navigate('/explore');
    else if (tab === 'library') navigate('/library');
    else if (tab === 'liked') navigate('/liked');
    else if (tab === 'dashboard') navigate('/dashboard');
  };

  return (
    <aside className="app-sidebar w-60 sm:w-64 flex-shrink-0 flex flex-col h-full bg-[#0D1B13] border-r border-[#24392B] p-4 select-none justify-between z-20">
      
      {/* BRAND & HEADER */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="relative w-9 h-9 rounded-xl bg-[#1ED760] flex items-center justify-center shadow-lg shadow-[#1ED760]/25 group">
            <Music className="w-5 h-5 text-[#07110C]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#F5F7F5] font-['Space_Grotesk']">
                TUNE<span className="text-[#1ED760]">ASE</span>
              </span>
            </div>
            <p className="text-[11px] text-[#A0B0A5] font-medium">Music Streaming</p>
          </div>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-[#A0B0A5]/70 uppercase tracking-widest mb-2">
            Menu
          </p>

          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'home' || activeTab === 'discover'
                ? 'bg-[#12251A] text-[#1ED760] border border-[#24392B] shadow-sm'
                : 'text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#12251A]/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('explore')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#12251A] text-[#1ED760] border border-[#24392B] shadow-sm'
                : 'text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#12251A]/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explore Genres</span>
          </button>

          <button
            onClick={() => handleNav('library')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'library'
                ? 'bg-[#12251A] text-[#1ED760] border border-[#24392B] shadow-sm'
                : 'text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#12251A]/60'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Your Library</span>
          </button>
        </nav>

        {/* PLAYLISTS & SAVED MUSIC */}
        <div className="space-y-1 pt-2 border-t border-[#24392B]">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold text-[#A0B0A5]/70 uppercase tracking-widest">
              Playlists & Favorites
            </p>
            <button
              onClick={() => setIsCreatePlaylistModalOpen(true)}
              className="p-1 rounded-md text-[#A0B0A5] hover:text-[#1ED760] hover:bg-[#12251A] transition-colors cursor-pointer"
              title="Create Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleNav('liked')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'liked'
                ? 'bg-[#12251A] text-[#1ED760] border border-[#24392B] shadow-sm'
                : 'text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#12251A]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#1ED760] to-[#8BE9A7] flex items-center justify-center shadow-sm">
                <Heart className="w-3.5 h-3.5 text-[#07110C] fill-[#07110C]" />
              </div>
              <span>Liked Songs</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#12251A] text-[#8BE9A7] font-mono border border-[#24392B]">
              {likedTrackIds.size}
            </span>
          </button>

          {/* USER'S REAL PLAYLISTS LIST */}
          <div className="mt-2 space-y-0.5 max-h-48 overflow-y-auto no-scrollbar">
            {playlists.length === 0 ? (
              <p className="text-[11px] text-[#A0B0A5]/60 px-3 py-1.5 italic">No playlists created yet</p>
            ) : (
              playlists.map((pl) => (
                <button
                  key={pl.id || pl._id}
                  onClick={() => {
                    setSelectedPlaylist(pl);
                    setActiveTab('playlist');
                    navigate(`/playlist/${pl._id || pl.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#12251A] truncate transition-all text-left cursor-pointer"
                >
                  <ListMusic className="w-3.5 h-3.5 text-[#8BE9A7] flex-shrink-0" />
                  <span className="truncate">{pl.name || pl.playListName}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      {user?.role === 'artist' && <div className="space-y-2 pt-3 border-t border-[#24392B]">
        {/* MANAGE UPLOADS (DIRECT TRACK MANAGER) */}
        <button
          onClick={() => handleNav('dashboard')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#12251A] text-[#1ED760] border border-[#24392B]'
              : 'text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#12251A]/60'
          }`}
        >
          <FolderKanban className="w-4 h-4 text-[#8BE9A7]" />
          <span>Manage Uploads</span>
        </button>

        {/* UPLOAD TRACK ACTION BUTTON */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full p-2.5 rounded-xl bg-[#1ED760] hover:bg-[#1fdf65] active:bg-[#1ab852] text-[#07110C] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1ED760]/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Music</span>
        </button>
      </div>}

    </aside>
  );
};

export default Sidebar;

