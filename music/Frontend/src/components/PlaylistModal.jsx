import React, { useState } from 'react';
import { X, ListMusic, Plus, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const PlaylistModal = () => {
  const { isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen, addNewPlaylist, queue } = usePlayer();

  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreatePlaylistModalOpen) return null;

  const tracksToChoose = queue || [];

  const toggleSongSelection = (id) => {
    setSelectedSongIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    setIsSubmitting(true);

    try {
      const selectedSongs = tracksToChoose.filter(t => selectedSongIds.includes(t.id || t._id));

      await addNewPlaylist({
        name: playlistName.trim(),
        playListName: playlistName.trim(),
        description: description.trim(),
        songs: selectedSongs,
        isPublic
      });

      setIsCreatePlaylistModalOpen(false);
      setPlaylistName('');
      setDescription('');
      setSelectedSongIds([]);
    } catch (err) {
      console.error('Error creating playlist:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-lg bg-[#0D1B13] rounded-3xl p-6 sm:p-8 border border-[#24392B] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-[#24392B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1ED760]/20 border border-[#1ED760]/40 flex items-center justify-center shadow-lg shadow-[#1ED760]/20">
              <ListMusic className="w-5 h-5 text-[#1ED760]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#F5F7F5] font-['Space_Grotesk']">
                Create Playlist
              </h3>
              <p className="text-xs text-[#A0B0A5]">Assemble your custom soundscape</p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatePlaylistModalOpen(false)}
            className="p-2 rounded-full bg-[#12251A] text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#1A3324] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          
          {/* PLAYLIST NAME */}
          <div className="space-y-1">
            <label className="text-[#A0B0A5] font-bold">Playlist Name *</label>
            <input
              type="text"
              required
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="e.g. Late Night Cyber Vibes"
              className="w-full bg-[#12251A] text-[#F5F7F5] p-3 rounded-xl border border-[#24392B] focus:border-[#1ED760] focus:outline-none"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-[#A0B0A5] font-bold">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the mood or genre of this playlist..."
              className="w-full bg-[#12251A] text-[#F5F7F5] p-3 rounded-xl border border-[#24392B] focus:border-[#1ED760] focus:outline-none resize-none"
            />
          </div>

          {/* SONG SELECTION CHECKBOX LIST */}
          <div className="space-y-2">
            <label className="text-[#A0B0A5] font-bold">Select Initial Songs ({selectedSongIds.length})</label>
            <div className="max-h-40 overflow-y-auto no-scrollbar space-y-1 p-2 rounded-xl bg-[#12251A] border border-[#24392B]">
              {tracksToChoose.map(track => {
                const trackId = track.id || track._id;
                const isSelected = selectedSongIds.includes(trackId);
                return (
                  <div
                    key={trackId}
                    onClick={() => toggleSongSelection(trackId)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      isSelected ? 'bg-[#1ED760]/15 border border-[#1ED760]/40 text-white' : 'hover:bg-white/5 text-[#A0B0A5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={track.coverUrl} alt={track.title} className="w-7 h-7 rounded-md object-cover flex-shrink-0 border border-[#24392B]" />
                      <div className="min-w-0">
                        <p className={`font-bold text-[11px] truncate ${isSelected ? 'text-[#1ED760]' : 'text-[#F5F7F5]'}`}>{track.title}</p>
                        <p className="text-[10px] text-[#A0B0A5] truncate">{track.artistName}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#1ED760] flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#A0B0A5] flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PUBLIC TOGGLE */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="publicCheck"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-[#1ED760] rounded"
            />
            <label htmlFor="publicCheck" className="text-[#A0B0A5] cursor-pointer hover:text-[#F5F7F5]">
              Make playlist public on your profile
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#1ED760] hover:bg-[#1fdf64] text-black font-extrabold text-sm shadow-xl shadow-[#1ED760]/30 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Playlist...' : 'Create Playlist'}
          </button>

        </form>

      </div>

    </div>
  );
};

export default PlaylistModal;
