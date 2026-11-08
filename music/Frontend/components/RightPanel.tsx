"use client";

import dynamic from "next/dynamic";
import Cover from "./Cover";
import { usePlayer } from "@/store/player";

const VinylVisual = dynamic(() => import("./VinylVisual"), { ssr: false, loading: () => <div aria-hidden="true" className="mx-auto aspect-square w-full max-w-[280px] animate-pulse rounded-[28px] bg-elevated" /> });

export default function RightPanel() {
  const queue = usePlayer((state) => state.queue);
  const index = usePlayer((state) => state.index);
  const play = usePlayer((state) => state.play);
  const isPlaying = usePlayer((state) => state.isPlaying);
  const current = queue[index];
  const upNext = queue.slice(index + 1);
  return (
    <aside aria-label="Now playing panel" className="hidden min-h-0 flex-col gap-5 overflow-y-auto border-l border-line bg-surface p-5 xl:flex">
      <h2 className="text-sm font-semibold">Now playing</h2>
      {current ? <>
        <VinylVisual id={current.id} coverUrl={current.coverUrl} isPlaying={isPlaying} />
        <div><h3 className="truncate font-display text-2xl font-extrabold">{current.title}</h3><p className="mt-1 truncate text-sm text-muted">{current.artist}</p></div>
        <div className="h-px bg-line" />
        <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Next in queue</h2><span className="text-xs text-muted">{upNext.length}</span></div>
        <div className="flex flex-col gap-1">
          {upNext.length === 0 ? <p className="rounded-[18px] bg-elevated/50 p-3 text-sm text-muted">Queue is empty.</p> : upNext.map((track) => (
            <button key={`${track.id}-${queue.indexOf(track)}`} onClick={() => play(track)} aria-label={`Play ${track.title} by ${track.artist}`} className="flex items-center gap-3 rounded-[18px] p-2 text-left transition-colors hover:bg-elevated">
              <Cover id={track.id} coverUrl={track.coverUrl} className="!rounded-[14px] size-10 shrink-0" />
              <span className="min-w-0"><span className="block truncate text-sm">{track.title}</span><span className="block truncate text-xs text-muted">{track.artist}</span></span>
            </button>
          ))}
        </div>
      </> : <p className="rounded-[20px] border border-line bg-elevated/50 p-4 text-sm leading-6 text-muted">Choose a song and it will show up here.</p>}

    </aside>
  );
}
