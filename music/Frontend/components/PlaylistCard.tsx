import Link from "next/link";
import Cover from "./Cover";
import type { Playlist } from "@/lib/types";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link href={`/playlist/${encodeURIComponent(playlist.id)}`} className="group rounded-xl border border-transparent bg-surface p-3 transition duration-200 hover:-translate-y-0.5 hover:border-line hover:bg-elevated">
      <Cover id={playlist.id} coverUrl={playlist.coverUrl} className="w-full shadow-lg shadow-bg/50" />
      <div className="pt-3">
        <div className="truncate text-sm font-semibold">{playlist.name}</div>
        <div className="mt-1 truncate text-xs text-muted">{playlist.tracks.length} songs · {playlist.owner}</div>
      </div>
    </Link>
  );
}
