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
import PageSkeleton from "@/components/PageSkeleton";

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

  if (loading) return <PageSkeleton variant="playlist"/>;
  if (error || !playlist) return <section className="mx-auto mt-16 max-w-lg rounded-2xl border border-line bg-surface p-8 text-center"><h1 className="font-display text-2xl font-semibold">Playlist unavailable</h1><p className="mt-2 text-sm text-muted">This playlist could not be loaded.</p><Link href="/library" className="mt-5 inline-flex rounded-full bg-lime px-5 py-2 text-sm font-semibold text-bg">Go to your library</Link></section>;

  const total = playlist.tracks.reduce((sum, track) => sum + track.duration, 0);
  const durationLabel = `${Math.floor(total / 3600)} hr ${Math.floor(total % 3600 / 60)} min`;
  const handleShuffle = () => { const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5); if (shuffled[0]) play(shuffled[0], shuffled); };
  const playlistArtStyle = playlist.coverUrl ? ({
    "--playlist-art": `url("${playlist.coverUrl}")`,
    backgroundImage: `linear-gradient(180deg, color-mix(in srgb, var(--color-violet) 24%, transparent), color-mix(in srgb, var(--color-bg) 70%, transparent) 44%, var(--color-bg) 100%), url("${playlist.coverUrl}")`,
  } as CSSProperties) : ({
    backgroundImage: "linear-gradient(180deg, color-mix(in srgb, var(--color-violet) 28%, transparent), var(--color-bg) 100%)",
  } as CSSProperties);
  const playlistTitleStyle = playlist.coverUrl ? ({
    backgroundImage: `url("${playlist.coverUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  } as CSSProperties) : undefined;

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }} style={playlistArtStyle} className="playlist-header-gradient flex min-h-[260px] flex-col items-start gap-5 rounded-[28px] border border-line p-5 sm:flex-row sm:items-end sm:gap-7 md:min-h-[340px] md:p-8">
        <Cover id={playlist.id} coverUrl={playlist.coverUrl} layoutId={`playlist-cover-${playlist.id}`} priority className="w-36 shrink-0 !rounded-[22px] shadow-2xl shadow-bg/60 md:w-48" />
        <div className="min-w-0 pb-1"><span className="text-xs font-semibold uppercase tracking-widest text-muted">Playlist</span><h1 style={playlistTitleStyle} className={`mt-3 break-words font-display text-[clamp(3.5rem,8vw,8rem)] font-extrabold leading-[0.8] tracking-[-0.06em] ${playlist.coverUrl ? "playlist-image-title" : "text-text"}`}>{playlist.name}</h1><p className="mt-3 text-sm text-muted">{playlist.owner} · {playlist.tracks.length} songs · {durationLabel}</p></div>
      </motion.header>

      <div className="flex items-center gap-3">
        <PlayAllButton tracks={playlist.tracks} />
        <button aria-label="Shuffle playlist" onClick={handleShuffle} className="grid size-12 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-lime hover:text-lime"><Shuffle size={19} /></button>
        <button aria-label={liked ? "Remove playlist from library" : "Add playlist to library"} aria-pressed={liked} onClick={() => setLiked((value) => !value)} className={`grid size-12 place-items-center rounded-full border border-line bg-surface transition hover:border-pink ${liked ? "text-pink" : "text-muted hover:text-foreground"}`}><Heart size={19} fill={liked ? "currentColor" : "none"} /></button>
        <button aria-label="More playlist actions" className="grid size-12 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-lime hover:text-foreground"><MoreHorizontal size={19}/></button>
      </div>

      <style jsx>{`
        .playlist-image-title {
          color: var(--color-text);
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
        }

        @supports ((-webkit-background-clip: text) or (background-clip: text)) {
          .playlist-image-title {
            color: transparent;
            -webkit-text-fill-color: transparent;
          }
        }
      `}</style>

      <div role="table" aria-label={`${playlist.name} tracks`} className="flex flex-col">
        <div className="grid grid-cols-[28px_minmax(0,1fr)_60px] items-center gap-3 border-b border-line px-2 pb-2 text-[10px] font-semibold tracking-[0.16em] text-muted sm:grid-cols-[28px_minmax(0,3fr)_2fr_64px] sm:gap-4 sm:px-3">
          <span>#</span><span>TITLE</span><span className="hidden sm:block">ALBUM</span><span className="text-right">TIME</span>
        </div>
        {playlist.tracks.length ? playlist.tracks.map((track, index) => <TrackRow key={track.id} track={track} n={index + 1} queue={playlist.tracks} />) : <p className="rounded-xl border border-line bg-surface p-6 text-center text-sm text-muted">This playlist has no tracks yet.</p>}
      </div>
    </div>
  );
}
