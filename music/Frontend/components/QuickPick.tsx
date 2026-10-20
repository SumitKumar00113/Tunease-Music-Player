"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import Cover from "./Cover";
import { usePlayer } from "@/store/player";
import type { Track } from "@/lib/types";

export default function QuickPick({ track, queue }: { track: Track; queue: Track[] }) {
  const play = usePlayer((state) => state.play);
  return (
    <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3, borderColor: "var(--color-line)" }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.18 }} onClick={() => play(track, queue)} className="group flex h-14 min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-transparent bg-elevated/70 text-left transition-colors hover:bg-elevated focus-visible:outline-accent-soft">
      <Cover id={track.id} coverUrl={track.coverUrl} className="size-14 shrink-0 rounded-none" />
      <span className="min-w-0 flex-1 truncate pr-1 text-sm font-medium">{track.title}</span>
      <span className="mr-3 grid size-8 shrink-0 scale-90 place-items-center rounded-full bg-brand text-bg opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
        <Play size={16} fill="currentColor" />
      </span>
    </motion.button>
  );
}
