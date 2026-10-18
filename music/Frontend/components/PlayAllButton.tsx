"use client";

import { Play } from "lucide-react";
import { usePlayer } from "@/store/player";
import type { Track } from "@/lib/types";

export default function PlayAllButton({ tracks }: { tracks: Track[] }) {
  const play = usePlayer((s) => s.play);
  return (
    <button
      aria-label="Play playlist"
      onClick={() => tracks[0] && play(tracks[0], tracks)}
      className="grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg shadow-accent/20 transition-transform hover:scale-105"
    >
      <Play size={24} className="translate-x-0.5" />
    </button>
  );
}
