import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Cover from "./Cover";
import type { Playlist } from "@/lib/types";

export default function PlaylistCard({ playlist, staggerIndex = 0, priority = false }: { playlist: Playlist; staggerIndex?: number; priority?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div initial={reduceMotion ? false : { y: 10 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.18 }} whileHover={reduceMotion ? undefined : { y: -4, rotate: staggerIndex % 2 ? 1.2 : -1.2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.34, delay: reduceMotion ? 0 : staggerIndex * 0.07 }}>
    <Link href={`/playlist/${encodeURIComponent(playlist.id)}`} className="group block rounded-xl border border-transparent bg-surface p-3 transition duration-200 hover:border-line hover:bg-elevated">
      <Cover id={playlist.id} coverUrl={playlist.coverUrl} priority={priority} layoutId={`playlist-cover-${playlist.id}`} className="w-full shadow-lg shadow-bg/50" />
      <div className="pt-3">
        <div className="truncate text-sm font-semibold">{playlist.name}</div>
        <div className="mt-1 truncate text-xs text-muted">{playlist.tracks.length} songs · {playlist.owner}</div>
      </div>
    </Link>
    </motion.div>
  );
}
