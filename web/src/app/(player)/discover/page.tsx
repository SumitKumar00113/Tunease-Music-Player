'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePlayer } from '../../../context/PlayerContext';
import { HeroBanner } from '../../../components/player/HeroBanner';
import { TrackCard } from '../../../components/player/TrackCard';
import { TrackList } from '../../../components/player/TrackList';
import { Flame, Sparkles, Verified } from 'lucide-react';
import { Track } from '../../../types';

interface FeaturedArtist {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  monthlyListeners: number;
  verified: boolean;
  topTracks: Track[];
}

export default function DiscoverPage() {
  const router = useRouter();
  const { queue, searchQuery, setSelectedArtist } = usePlayer();

  const filteredTracks = searchQuery
    ? queue.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.artistName && t.artistName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (t.artist && t.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (t.genre && t.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : queue;

  // Extract unique artists from tracks
  const artistMap = new Map<string, FeaturedArtist>();
  queue.forEach((track) => {
    const name = track.artistName || track.artist || 'Tunease Creator';
    if (!artistMap.has(name)) {
      artistMap.set(name, {
        id: track.artistId || track.id || `art-${name}`,
        name: name,
        avatar:
          track.imageUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        followers: 12500,
        monthlyListeners: 85000,
        verified: true,
        topTracks: [track],
      });
    } else {
      const existing = artistMap.get(name)!;
      existing.topTracks.push(track);
    }
  });
  const uniqueArtists = Array.from(artistMap.values()).slice(0, 6);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* HERO BANNER */}
      <HeroBanner />

      {/* TRENDING NOW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#60cfd8]" />
            <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">Trending Now</h2>
          </div>
          <button
            onClick={() => router.push('/explore')}
            className="text-xs font-semibold text-[#A1A1AA] hover:text-[#60cfd8] transition-colors cursor-pointer"
          >
            See all
          </button>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="p-8 text-center bg-[#141416] rounded-2xl border border-[#29292D]">
            <p className="text-sm text-[#A1A1AA]">No tracks found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredTracks.slice(0, 6).map((track) => (
              <TrackCard key={track.id || track._id} track={track} trackList={filteredTracks} />
            ))}
          </div>
        )}
      </section>

      {/* FRESH RELEASES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#60cfd8]" />
            <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">Fresh Releases</h2>
          </div>
        </div>
        <TrackList tracks={filteredTracks.slice(0, 10)} />
      </section>

      {/* TOP ARTISTS SECTION */}
      {uniqueArtists.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">Featured Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {uniqueArtists.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  setSelectedArtist(art.name);
                  router.push(`/artist/${art.id}`);
                }}
                className="group flex flex-col items-center p-4 bg-[#141416] hover:bg-white/5 rounded-2xl border border-[#29292D] hover:border-[#60cfd8]/40 transition-all cursor-pointer text-center shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden border-2 border-[#29292D] group-hover:border-[#60cfd8] transition-colors shadow-lg bg-[#050505]">
                  <img
                    src={art.avatar}
                    alt={art.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-sm text-[#F5F5F5] group-hover:text-[#60cfd8] transition-colors truncate max-w-[120px]">
                    {art.name}
                  </h3>
                  {art.verified && <Verified className="w-3.5 h-3.5 text-[#60cfd8] shrink-0" />}
                </div>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">Artist</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
