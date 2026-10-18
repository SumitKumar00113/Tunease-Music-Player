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
    <aside className="app-sidebar w-60 sm:w-64 flex-shrink-0 flex flex-col h-full bg-[#0C0C0E] border-r border-[#29292D] p-4 select-none justify-between z-20">
      
      {/* BRAND & HEADER */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="relative w-9 h-9 rounded-xl bg-[#60cfd8] flex items-center justify-center shadow-lg shadow-[#60cfd8]/25 group">
            <Music className="w-5 h-5 text-[#050505]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#F5F5F5] font-['Space_Grotesk']">
                TUNE<span className="text-[#60cfd8]">ASE</span>
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] font-medium">Music Streaming</p>
          </div>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-[#A1A1AA]/70 uppercase tracking-widest mb-2">
            Menu
          </p>

          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'home' || activeTab === 'discover'
                ? 'bg-[#141416] text-[#60cfd8] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('explore')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#141416] text-[#60cfd8] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explore Genres</span>
          </button>

          <button
            onClick={() => handleNav('library')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'library'
                ? 'bg-[#141416] text-[#60cfd8] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Your Library</span>
          </button>
        </nav>

        {/* PLAYLISTS & SAVED MUSIC */}
        <div className="space-y-1 pt-2 border-t border-[#29292D]">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold text-[#A1A1AA]/70 uppercase tracking-widest">
              Playlists & Favorites
            </p>
            <button
              onClick={() => setIsCreatePlaylistModalOpen(true)}
              className="p-1 rounded-md text-[#A1A1AA] hover:text-[#60cfd8] hover:bg-[#141416] transition-colors cursor-pointer"
              title="Create Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleNav('liked')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'liked'
                ? 'bg-[#141416] text-[#60cfd8] border border-[#29292D] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#60cfd8] to-[#32aeb9] flex items-center justify-center shadow-sm">
                <Heart className="w-3.5 h-3.5 text-[#050505] fill-[#050505]" />
              </div>
              <span>Liked Songs</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#141416] text-[#32aeb9] font-mono border border-[#29292D]">
              {likedTrackIds.size}
            </span>
          </button>

          {/* USER'S REAL PLAYLISTS LIST */}
          <div className="mt-2 space-y-0.5 max-h-48 overflow-y-auto no-scrollbar">
            {playlists.length === 0 ? (
              <p className="text-[11px] text-[#A1A1AA]/60 px-3 py-1.5 italic">No playlists created yet</p>
            ) : (
              playlists.map((pl) => (
                <button
                  key={pl.id || pl._id}
                  onClick={() => {
                    setSelectedPlaylist(pl);
                    setActiveTab('playlist');
                    navigate(`/playlist/${pl._id || pl.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416] truncate transition-all text-left cursor-pointer"
                >
                  <ListMusic className="w-3.5 h-3.5 text-[#32aeb9] flex-shrink-0" />
                  <span className="truncate">{pl.name || pl.playListName}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      {user?.role === 'artist' && <div className="space-y-2 pt-3 border-t border-[#29292D]">
        {/* MANAGE UPLOADS (DIRECT TRACK MANAGER) */}
        <button
          onClick={() => handleNav('dashboard')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#141416] text-[#60cfd8] border border-[#29292D]'
              : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#141416]/60'
          }`}
        >
          <FolderKanban className="w-4 h-4 text-[#32aeb9]" />
          <span>Manage Uploads</span>
        </button>

        {/* UPLOAD TRACK ACTION BUTTON */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full p-2.5 rounded-xl bg-[#60cfd8] hover:bg-[#4ebcc7] active:bg-[#4ebcc7] text-[#050505] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#60cfd8]/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Music</span>
        </button>
      </div>}

    </aside>
  );
};

export default Sidebar;

