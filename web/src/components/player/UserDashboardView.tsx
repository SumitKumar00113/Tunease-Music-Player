'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Flame,
  Headphones,
  Music2,
  Play,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { musicApi } from '../../services/musicApi';
import { SpotifyTrack, Track } from '../../types';
import { TrackList } from './TrackList';

const getName = (user: { fullName?: string | { firstName?: string; lastName?: string } } | null): string => {
  const fullName = user?.fullName;
  if (typeof fullName === 'string') return fullName.trim();
  return [fullName?.firstName, fullName?.lastName].filter(Boolean).join(' ');
};

export const UserDashboardView: React.FC = () => {
  const router = useRouter();
  const {
    user,
    queue,
    history,
    currentTrack,
    isPlaying,
    searchQuery,
    playTrack,
    togglePlayPause,
  } = usePlayer();

  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
  const [spotifyLoading, setSpotifyLoading] = useState<boolean>(true);

  const displayName = getName(user);
  const firstName = displayName.split(' ')[0] || 'Listener';
  const featuredTrack = currentTrack || queue[0];
  const spotifyQuery = searchQuery.trim() || 'popular music';

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSpotifyLoading(true);
      try {
        const tracks = await musicApi.searchSpotifyTracks(spotifyQuery);
        if (!cancelled) setSpotifyTracks(tracks);
      } catch (err) {
        console.warn('Spotify search error:', err);
      } finally {
        if (!cancelled) setSpotifyLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [spotifyQuery]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* USER HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#0C0C0E] via-[#141416] to-[#60cfd8]/15 border border-[#29292D] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#60cfd8]/15 border border-[#60cfd8]/30 text-[#60cfd8] text-xs font-bold">
            <Headphones className="w-3.5 h-3.5" />
            <span>Lossless Personal Feed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight font-['Space_Grotesk']">
            Welcome back, {firstName}
          </h1>

          <p className="text-xs text-[#A1A1AA] max-w-lg">
            Pick up where you left off, explore curated soundscapes, and discover new artist releases in lossless fidelity.
          </p>

          {featuredTrack && (
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => playTrack(featuredTrack, queue)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] font-extrabold text-xs shadow-md shadow-[#60cfd8]/20 hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current stroke-none" />
                <span>Resume Playback</span>
              </button>

              <button
                onClick={() => router.push('/explore')}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#141416] hover:bg-white/5 border border-[#29292D] text-[#F5F5F5] font-bold text-xs hover:border-[#60cfd8] transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#60cfd8]" />
                <span>Explore Genres</span>
              </button>
            </div>
          )}
        </div>

        {featuredTrack && (
          <div className="w-48 h-48 rounded-2xl overflow-hidden border border-[#29292D] shadow-2xl relative bg-[#050505] flex-shrink-0">
            <img
              src={featuredTrack.imageUrl}
              alt={featuredTrack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
              <p className="text-xs font-bold text-white truncate">{featuredTrack.title}</p>
              <p className="text-[10px] text-[#A1A1AA] truncate">{featuredTrack.artistName || featuredTrack.artist}</p>
            </div>
          </div>
        )}
      </section>

      {/* SPOTIFY DISCOVERY STREAM */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#29292D] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#60cfd8]" />
            <div>
              <h2 className="text-lg font-bold text-[#F5F5F5]">Global Spotify Trends</h2>
              <p className="text-xs text-[#A1A1AA]">Realtime metadata matching across Spotify catalog</p>
            </div>
          </div>
        </div>

        {spotifyLoading ? (
          <div className="p-8 text-center text-xs text-[#A1A1AA] bg-[#141416] rounded-2xl border border-[#29292D]">
            Querying Spotify API for global tracks…
          </div>
        ) : spotifyTracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {spotifyTracks.slice(0, 8).map((st) => (
              <div
                key={st.id}
                className="p-3 bg-[#141416] rounded-2xl border border-[#29292D] hover:border-[#60cfd8]/40 transition-all flex items-center gap-3 group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#29292D]">
                  {st.imageUrl ? (
                    <img src={st.imageUrl} alt={st.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A1A1AA]">
                      <Music2 size={16} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#60cfd8] truncate transition-colors">
                    {st.title}
                  </p>
                  <p className="text-[10px] text-[#A1A1AA] truncate">{st.artist}</p>
                  <p className="text-[9px] text-[#A1A1AA]/60 truncate">{st.album}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#A1A1AA] bg-[#141416] rounded-2xl border border-[#29292D]">
            No live Spotify streams found.
          </div>
        )}
      </section>

      {/* RECENTLY PLAYED / QUEUE LIST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#29292D] pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#60cfd8]" />
            <div>
              <h2 className="text-lg font-bold text-[#F5F5F5]">Up Next in Your Stream</h2>
              <p className="text-xs text-[#A1A1AA]">Lossless tracks queued for playback</p>
            </div>
          </div>
        </div>

        <TrackList tracks={queue.slice(0, 8)} />
      </section>
    </div>
  );
};

export default UserDashboardView;
