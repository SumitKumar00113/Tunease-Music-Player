"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MoreHorizontal, Shuffle } from "lucide-react";
import Cover from "./Cover";
import PlayAllButton from "./PlayAllButton";
import TrackRow from "./TrackRow";
import { getPlaylist } from "@/lib/api";
import { usePlayer } from "@/store/player";
import type { Playlist } from "@/lib/types";

export default function PlaylistDetail({ id }: { id: string }) {
  const [loaded, setLoaded] = useState<{ id: string; playlist: Playlist | null; error: boolean } | null>(null);
  const playlist = loaded?.id === id ? loaded.playlist : null;
  const loading = loaded?.id !== id;
  const [liked, setLiked] = useState(false);
  const play = usePlayer((state) => state.play);
  const error = loaded?.id === id && loaded.error;

  useEffect(() => {
    let active = true;
    getPlaylist(id).then((result) => { if (active) setLoaded({ id, playlist: result, error: false }); }).catch(() => { if (active) setLoaded({ id, playlist: null, error: true }); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="animate-pulse space-y-7"><div className="flex items-end gap-5"><div className="size-40 rounded-xl bg-elevated md:size-52" /><div className="space-y-3"><div className="h-4 w-20 rounded bg-elevated" /><div className="h-10 w-64 rounded bg-elevated" /></div></div><div className="space-y-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-14 rounded-lg bg-surface" />)}</div></div>;
  if (error || !playlist) return <section className="mx-auto mt-16 max-w-lg rounded-2xl border border-line bg-surface p-8 text-center"><h1 className="font-display text-2xl font-semibold">Playlist unavailable</h1><p className="mt-2 text-sm text-muted">This playlist could not be loaded.</p><Link href="/library" className="mt-5 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-foreground">Go to your library</Link></section>;

  const total = playlist.tracks.reduce((sum, track) => sum + track.duration, 0);
  const durationLabel = `${Math.floor(total / 3600)} hr ${Math.floor(total % 3600 / 60)} min`;
  const handleShuffle = () => { const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5); if (shuffled[0]) play(shuffled[0], shuffled); };
  const playlistArtStyle = playlist.coverUrl ? ({ "--playlist-art": `url("${playlist.coverUrl}")` } as CSSProperties) : undefined;

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }} style={playlistArtStyle} className="playlist-header-gradient flex min-h-[220px] flex-col items-start gap-5 rounded-2xl p-5 sm:flex-row sm:items-end sm:gap-7 md:p-7">
        <Cover id={playlist.id} coverUrl={playlist.coverUrl} layoutId={`playlist-cover-${playlist.id}`} priority className="w-40 shrink-0 rounded-xl shadow-2xl shadow-bg/60 md:w-[220px]" />
        <div className="min-w-0 pb-1"><span className="text-xs font-semibold uppercase tracking-widest text-muted">Playlist</span><h1 className="mt-2 break-words font-display text-3xl font-bold tracking-tight md:text-5xl">{playlist.name}</h1><p className="mt-3 text-sm text-muted">{playlist.owner} · {playlist.tracks.length} songs · {durationLabel}</p></div>
      </motion.header>

      <div className="flex items-center gap-3">
        <PlayAllButton tracks={playlist.tracks} />
        <button aria-label="Shuffle playlist" onClick={handleShuffle} className="grid size-12 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-accent-soft"><Shuffle size={19} /></button>
        <button aria-label={liked ? "Remove playlist from library" : "Add playlist to library"} aria-pressed={liked} onClick={() => setLiked((value) => !value)} className={`grid size-12 place-items-center rounded-full border border-line bg-surface transition hover:border-accent ${liked ? "text-accent-soft" : "text-muted hover:text-foreground"}`}><Heart size={19} fill={liked ? "currentColor" : "none"} /></button>
        <button aria-label="More playlist actions" className="grid size-12 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-foreground"><MoreHorizontal size={19}/></button>
      </div>

      <div role="table" aria-label={`${playlist.name} tracks`} className="flex flex-col">
        <div className="grid grid-cols-[28px_minmax(0,1fr)_60px] items-center gap-3 border-b border-line px-2 pb-2 text-[10px] font-semibold tracking-[0.16em] text-muted sm:grid-cols-[28px_minmax(0,3fr)_2fr_64px] sm:gap-4 sm:px-3">
          <span>#</span><span>TITLE</span><span className="hidden sm:block">ALBUM</span><span className="text-right">TIME</span>
        </div>
        {playlist.tracks.length ? playlist.tracks.map((track, index) => <TrackRow key={track.id} track={track} n={index + 1} queue={playlist.tracks} />) : <p className="rounded-xl border border-line bg-surface p-6 text-center text-sm text-muted">This playlist has no tracks yet.</p>}
      </div>
    </div>
  );
}
