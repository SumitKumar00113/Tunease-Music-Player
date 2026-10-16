import React, { useState } from 'react';
import { GENRE_CATEGORIES } from '../data/mockData';
import { TrackCard } from './TrackCard';
import { Compass, Flame } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const ExploreView = () => {
  const { searchQuery, queue } = usePlayer();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const tracksToUse = queue || [];

  let filteredTracks = tracksToUse;
  if (selectedGenre) {
    filteredTracks = filteredTracks.filter(t => 
      t.genre && t.genre.toLowerCase() === selectedGenre.toLowerCase()
    );
  }
  if (searchQuery) {
    filteredTracks = filteredTracks.filter(
      t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.genre && t.genre.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] font-['Space_Grotesk'] flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-[#1ED760]" />
            Explore Genres & Categories
          </h2>
          <p className="text-xs text-[#A0B0A5]">Browse tracks by soundscape, mood, and musical tags</p>
        </div>

        {selectedGenre && (
          <button
            onClick={() => setSelectedGenre(null)}
            className="text-xs px-3.5 py-1.5 rounded-full bg-[#12251A] hover:bg-[#162e20] text-[#1ED760] font-bold border border-[#24392B] hover:border-[#1ED760] transition-all cursor-pointer"
          >
            Clear Filter ({selectedGenre}) ✕
          </button>
        )}
      </div>

      {/* GENRES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {GENRE_CATEGORIES.map(genre => {
          const isSelected = selectedGenre?.toLowerCase() === genre.name.toLowerCase();
          return (
            <div
              key={genre.id}
              onClick={() => setSelectedGenre(isSelected ? null : genre.name)}
              className={`group relative h-36 rounded-2xl overflow-hidden bg-[#12251A] p-4 flex flex-col justify-between cursor-pointer border transition-all duration-300 shadow-md hover:scale-[1.02] ${
                isSelected
                  ? 'border-[#1ED760] ring-2 ring-[#1ED760]/40 shadow-lg shadow-[#1ED760]/20'
                  : 'border-[#24392B] hover:border-[#1ED760]/50'
              }`}
            >
              <img
                src={genre.coverUrl}
                alt={genre.name}
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110C] via-[#07110C]/50 to-transparent" />

              <span className="relative z-10 text-[10px] font-bold text-[#8BE9A7] uppercase tracking-wider">
                Genre
              </span>
              <h3 className={`relative z-10 font-extrabold text-sm transition-colors ${
                isSelected ? 'text-[#1ED760]' : 'text-[#F5F7F5] group-hover:text-[#1ED760]'
              }`}>
                {genre.name}
              </h3>
            </div>
          );
        })}
      </div>

      {/* FEATURED CATEGORY TRACKS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#F5F7F5] flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#1ED760]" />
            {selectedGenre ? `${selectedGenre} Tracks` : 'Catalog Audio Tracks'}
          </h3>
          <span className="text-xs text-[#A0B0A5] font-mono">
            {filteredTracks.length} tracks
          </span>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="py-12 text-center text-[#A0B0A5] bg-[#12251A] rounded-2xl p-6 border border-[#24392B]">
            <p className="text-sm font-semibold">No tracks found for {selectedGenre || 'this query'}.</p>
            <button
              onClick={() => setSelectedGenre(null)}
              className="mt-2 text-xs text-[#1ED760] hover:underline cursor-pointer"
            >
              View all tracks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredTracks.map(track => (
              <TrackCard key={track.id || track._id} track={track} trackList={filteredTracks} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ExploreView;

