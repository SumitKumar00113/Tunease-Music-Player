"use client";

import { Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Cover from "./Cover";
import { usePlayer } from "@/store/player";
import type { Track } from "@/lib/types";

export default function QuickPick({ track, queue, staggerIndex = 0, priority = false }: { track: Track; queue: Track[]; staggerIndex?: number; priority?: boolean }) {
  const play = usePlayer((state) => state.play);
  const reduceMotion = useReducedMotion();
  return (
    <motion.button initial={reduceMotion ? false : { y: 10 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={reduceMotion ? undefined : { y: -3, rotate: staggerIndex % 2 ? 1 : -1, borderColor: "var(--color-line)" }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.32, delay: reduceMotion ? 0 : staggerIndex * 0.07 }} onClick={() => play(track, queue)} className="group flex h-14 min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-transparent bg-elevated/70 text-left transition-colors hover:bg-elevated focus-visible:outline-lime">
      <Cover id={track.id} coverUrl={track.coverUrl} priority={priority} className="size-14 shrink-0 rounded-none" />
      <span className="min-w-0 flex-1 truncate pr-1 text-sm font-medium">{track.title}</span>
      <span className="mr-3 grid size-8 shrink-0 scale-90 place-items-center rounded-full bg-brand text-bg opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
        <Play size={16} fill="currentColor" />
      </span>
    </motion.button>
  );
}
