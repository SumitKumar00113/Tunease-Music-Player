"use client";

import { useEffect, useState } from "react";
import PlaylistCard from "@/components/PlaylistCard";
import QuickPick from "@/components/QuickPick";
import SectionSkeleton from "@/components/SectionSkeleton";
import { getPlaylists } from "@/lib/api";
import type { Playlist, Track } from "@/lib/types";

export default function HomeContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
    };

    updateGreeting();
    const interval = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    getPlaylists().then((items) => {
      if (active) setPlaylists(items);
    }).catch(() => {
      if (active) setError("Music is unavailable right now. Please try again.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const tracks: Track[] = playlists.flatMap((playlist) => playlist.tracks);
  const quickPicks = tracks.filter((track, index) => tracks.findIndex((item) => item.id === track.id) === index).slice(0, 6);
  const renderPlaylistRow = (items: Playlist[], label: string) => {
    if (loading) return <SectionSkeleton count={4} />;
    if (error) return <p className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">{error}</p>;
    if (items.length === 0) return <p className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">No playlists yet. Browse music and your saved playlists will appear here.</p>;
    return <div aria-label={label} className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{items.map((playlist) => <PlaylistCard key={`${label}-${playlist.id}`} playlist={playlist} />)}</div>;
  };

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 pb-4">
      <div className="home-greeting py-3">
        <p className="mb-1 text-sm text-muted">Your sound, right where you left it</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{greeting || "Welcome back"}</h1>
      </div>

      <section aria-labelledby="quick-picks-heading" className="flex flex-col gap-3">
        <h2 id="quick-picks-heading" className="font-display text-xl font-semibold">Jump back in</h2>
        {loading ? <SectionSkeleton count={6} /> : quickPicks.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">No tracks available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {quickPicks.map((track) => <QuickPick key={track.id} track={track} queue={tracks} />)}
          </div>
        )}
      </section>

      <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
        <h2 id="recent-heading" className="font-display text-xl font-semibold">Recently played</h2>
        {renderPlaylistRow(playlists.slice(0, 5), "Recently played playlists")}
      </section>

      <section aria-labelledby="made-heading" className="flex flex-col gap-3">
        <h2 id="made-heading" className="font-display text-xl font-semibold">Made for you</h2>
        {renderPlaylistRow([...playlists].reverse().slice(0, 5), "Made for you playlists")}
      </section>
    </div>
  );
}
