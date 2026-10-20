"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import Cover from "./Cover";
import { usePlayer } from "@/store/player";
import type { Track } from "@/lib/types";

const fmt = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export default function TrackRow({ track, n, queue }: { track: Track; n: number; queue: Track[] }) {
  const play = usePlayer((state) => state.play);
  const current = usePlayer((state) => state.queue[state.index]);
  const isPlaying = usePlayer((state) => state.isPlaying);
  const active = current?.id === track.id;
  return (
    <motion.button
      initial={{ opacity: 0, x: 4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, delay: Math.min(n * 0.012, 0.16) }}
      whileHover={{ borderColor: "var(--color-line)" }}
      whileTap={{ scale: 0.995 }}
      onClick={() => play(track, queue)}
      aria-label={`${active && isPlaying ? "Pause" : "Play"} ${track.title} by ${track.artist}`}
      aria-current={active ? "true" : undefined}
      className={`group grid min-h-[52px] w-full grid-cols-[28px_minmax(0,1fr)_60px] items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors sm:grid-cols-[28px_minmax(0,3fr)_2fr_64px] sm:gap-4 sm:px-3 ${active ? "track-row-active" : "hover:bg-elevated/70"}`}
    >
      <span className={`grid place-items-center text-sm ${active ? "text-accent-soft" : "text-muted"}`}>
        {active && isPlaying ? <span className="flex h-4 items-end gap-0.5" aria-label="Now playing"><i className="h-2 w-0.5 animate-pulse rounded bg-current"/><i className="h-4 w-0.5 animate-pulse rounded bg-current [animation-delay:120ms]"/><i className="h-2.5 w-0.5 animate-pulse rounded bg-current [animation-delay:240ms]"/></span> : <><span className="group-hover:hidden">{n}</span><Play size={14} className="hidden group-hover:block" fill="currentColor" /></>}
      </span>
      <span className="flex min-w-0 items-center gap-3">
        <Cover id={track.id} coverUrl={track.coverUrl} className="size-10 shrink-0" />
        <span className="min-w-0">
          <span className={`block truncate text-sm font-medium ${active ? "text-accent-soft" : "text-foreground"}`}>{track.title}</span>
          <span className="block truncate text-xs text-muted">{track.artist}</span>
        </span>
      </span>
      <span className="hidden truncate text-sm text-muted sm:block">{track.album}</span>
      <span className="text-right text-sm tabular-nums text-muted">{fmt(track.duration)}</span>
    </motion.button>
  );
}
