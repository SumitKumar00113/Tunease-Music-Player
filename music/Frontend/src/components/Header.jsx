import React from 'react';
import { Search, LogIn, Upload, User as UserIcon } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const Header = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setIsUploadModalOpen, 
    user,
    setIsAuthModalOpen 
  } = usePlayer();

  const userName = user?.fullName
    ? (typeof user.fullName === 'string' 
        ? user.fullName 
        : `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim())
    : 'Music Listener';
  const userRole = user?.role === 'artist' 
    ? 'Creator' 
    : user?.role === 'admin' 
    ? 'Admin' 
    : user 
    ? 'Listener' 
    : 'Guest';
  const avatarUrl = user?.profilePhoto;

  return (
    <header className="app-header h-16 flex-shrink-0 px-6 flex items-center justify-between bg-[#0D1B13]/90 backdrop-blur-md border-b border-[#24392B] z-10 sticky top-0">
      
      {/* SEARCH INPUT */}
      <div className="relative w-72 sm:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0A5]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tracks, artists, or genres..."
          className="w-full bg-[#12251A] text-[#F5F7F5] placeholder-[#A0B0A5]/60 text-xs font-medium pl-10 pr-9 py-2.5 rounded-full border border-[#24392B] focus:border-[#1ED760] focus:ring-1 focus:ring-[#1ED760] focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0B0A5] hover:text-[#F5F7F5] text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* RIGHT CONTROLS & USER PROFILE */}
      <div className="flex items-center gap-3">
        
        {/* CREATOR UPLOAD SHORTCUT */}
        {user?.role === 'artist' && <button
          onClick={() => setIsUploadModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12251A] border border-[#24392B] hover:border-[#1ED760] text-xs font-semibold text-[#F5F7F5] hover:text-[#1ED760] transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-[#1ED760]" />
          <span>Upload</span>
        </button>}

        {/* USER PROFILE PILL OR SIGN IN */}
        {user ? (
          <div 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2.5 pl-3 border-l border-[#24392B] cursor-pointer group select-none"
            title="Manage Account"
          >
            <div className="w-8 h-8 rounded-full bg-[#12251A] border border-[#1ED760]/50 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#1ED760] flex items-center justify-center text-[11px] font-bold text-[#07110C]">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-[#F5F7F5] leading-tight group-hover:text-[#1ED760] transition-colors max-w-[120px] truncate">{userName}</p>
              <p className="text-[10px] text-[#8BE9A7] font-semibold">{userRole}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1ED760] hover:bg-[#1fdf65] text-[#07110C] text-xs font-bold shadow-md shadow-[#1ED760]/20 hover:scale-105 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Sign In</span>
          </button>
        )}

      </div>

    </header>
  );
};

export default Header;

