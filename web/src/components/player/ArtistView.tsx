'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Disc3, Music2, Play, RotateCw } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackList } from './TrackList';
import { musicApi } from '../../services/musicApi';
import { Track } from '../../types';

interface ArtistViewProps {
  artistId: string;
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistId }) => {
  const router = useRouter();
  const { selectedArtist, setSelectedArtist, playTrack } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError('');

    musicApi
      .getArtistMusic(artistId)
      .then((artistTracks) => {
        if (!cancelled) setTracks(artistTracks);
      })
      .catch(() => {
        if (!cancelled) setError('We couldn’t load this artist’s releases. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [artistId, retryCount]);

  const artistTracks = tracks;
  const artistName =
    artistTracks[0]?.artistName ||
    artistTracks[0]?.artist ||
    (selectedArtist === artistId ? selectedArtist : 'Tunease Artist');

  const genres = Array.from(
    new Set(artistTracks.map((track) => track.genre).filter(Boolean))
  ) as string[];

  const artwork = artistTracks.find((track) => track.imageUrl)?.imageUrl;

  useEffect(() => {
    if (!artistName) return;
    setSelectedArtist(artistName);
  }, [artistName, setSelectedArtist]);

  return (
    <main className="space-y-8 animate-fadeIn pb-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-bold text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* ARTIST HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-[#141416] border border-[#29292D] p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 shadow-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#60cfd8]/10 blur-3xl pointer-events-none" />

        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-[#29292D] bg-[#050505]">
          {artwork ? (
            <img
              src={artwork}
              alt={`${artistName} artwork`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#A1A1AA]">
              <Music2 size={40} />
            </div>
          )}
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#60cfd8]/15 text-[#60cfd8] border border-[#60cfd8]/30">
            Artist Discography
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F5F5] tracking-tight font-['Space_Grotesk']">
            {artistName || (isLoading ? 'Loading artist...' : 'Artist')}
          </h1>

          {genres.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#A1A1AA]"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {artistTracks.length > 0 && (
            <p className="text-xs font-semibold text-[#A1A1AA]">
              {artistTracks.length} {artistTracks.length === 1 ? 'release' : 'releases'} in Tunease catalog
            </p>
          )}

          <div className="pt-2 flex items-center justify-center md:justify-start">
            <button
              type="button"
              onClick={() => artistTracks.length > 0 && playTrack(artistTracks[0], artistTracks)}
              disabled={artistTracks.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-extrabold text-xs shadow-md shadow-[#60cfd8]/20 hover:scale-105 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play size={16} fill="currentColor" />
              Play Discography
            </button>
          </div>
        </div>
      </section>

      {/* RELEASES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#29292D] pb-3">
          <div>
            <p className="text-[10px] font-bold text-[#60cfd8] uppercase tracking-wider">Discography</p>
            <h2 className="text-lg font-bold text-[#F5F5F5]">Releases</h2>
          </div>
          <Disc3 size={20} className="text-[#A1A1AA]" />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#A1A1AA] bg-[#141416] rounded-2xl border border-[#29292D]">
            Loading releases…
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-300 bg-[#141416] rounded-2xl border border-red-500/30 space-y-3">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <RotateCw size={14} /> Retry
            </button>
          </div>
        ) : artistTracks.length > 0 ? (
          <TrackList tracks={artistTracks} />
        ) : (
          <div className="p-8 text-center text-xs text-[#A1A1AA] bg-[#141416] rounded-2xl border border-[#29292D]">
            No published releases are available for this artist yet.
          </div>
        )}
      </section>
    </main>
  );
};

export default ArtistView;
