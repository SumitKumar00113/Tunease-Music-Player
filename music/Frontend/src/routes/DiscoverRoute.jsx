import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { HeroBanner } from '../components/HeroBanner';
import { TrackCard } from '../components/TrackCard';
import { TrackList } from '../components/TrackList';
import { Flame, Sparkles, Verified } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DiscoverRoute() {
  const { queue, searchQuery, setSelectedArtist, setActiveTab } = usePlayer();
  const navigate = useNavigate();

  const filteredTracks = searchQuery
    ? queue.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.genre && t.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : queue;

  // Extract unique artists from tracks
  const artistMap = new Map();
  queue.forEach((track) => {
    const name = track.artistName || 'Tunease Creator';
    if (!artistMap.has(name)) {
      artistMap.set(name, {
        id: track.artistId || track.id || `art-${name}`,
        name: name,
        avatar:
          track.coverUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        followers: 12500,
        monthlyListeners: track.playCount ? track.playCount + 15000 : 85000,
        verified: true,
        topTracks: [track],
      });
    } else {
      const existing = artistMap.get(name);
      existing.topTracks.push(track);
    }
  });
  const uniqueArtists = Array.from(artistMap.values()).slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HERO BANNER */}
      <HeroBanner />

      {/* TRENDING NOW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#1ED760]" />
            <h2 className="text-xl font-bold text-[#F5F7F5] tracking-tight">Trending Now</h2>
          </div>
          <button 
            onClick={() => {
              setActiveTab('explore');
              navigate('/explore');
            }}
            className="text-xs font-semibold text-[#A0B0A5] hover:text-[#1ED760] transition-colors cursor-pointer"
          >
            See all
          </button>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="p-8 text-center bg-[#12251A] rounded-2xl border border-[#24392B]">
            <p className="text-sm text-[#A0B0A5]">No tracks found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredTracks.slice(0, 6).map((track) => (
              <TrackCard key={track.id || track._id} track={track} trackList={filteredTracks} />
            ))}
          </div>
        )}
      </section>

      {/* RECOMMENDED TRACKS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8BE9A7]" />
            <h2 className="text-xl font-bold text-[#F5F7F5] tracking-tight">Fresh Releases</h2>
          </div>
        </div>
        <TrackList tracks={filteredTracks.slice(0, 10)} />
      </section>

      {/* TOP ARTISTS SECTION */}
      {uniqueArtists.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#F5F7F5] tracking-tight">Featured Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {uniqueArtists.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  setSelectedArtist(art);
                  setActiveTab('artist');
                  navigate(`/artist/${art.id}`);
                }}
                className="group flex flex-col items-center p-4 bg-[#12251A] hover:bg-[#162e20] rounded-2xl border border-[#24392B] hover:border-[#1ED760]/40 transition-all cursor-pointer text-center shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden border-2 border-[#24392B] group-hover:border-[#1ED760] transition-colors shadow-lg bg-[#07110C]">
                  <img src={art.avatar} alt={art.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-sm text-[#F5F7F5] group-hover:text-[#1ED760] transition-colors truncate max-w-[120px]">
                    {art.name}
                  </h3>
                  {art.verified && <Verified className="w-3.5 h-3.5 text-[#1ED760] shrink-0" />}
                </div>
                <p className="text-[11px] text-[#A0B0A5] mt-0.5">
                  Artist
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DiscoverRoute;

