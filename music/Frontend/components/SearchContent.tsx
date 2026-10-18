"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import PlaylistCard from "./PlaylistCard";
import SectionSkeleton from "./SectionSkeleton";
import TrackRow from "./TrackRow";
import { searchTracks } from "@/lib/api";
import type { SearchResults } from "@/lib/types";

const emptyResults: SearchResults = { tracks: [], playlists: [] };

export default function SearchContent() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const normalized = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";
    setQuery(initialQuery);
  }, []);

  useEffect(() => {
    if (!normalized) {
      setResults(emptyResults);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    let active = true;
    const timer = window.setTimeout(() => {
      searchTracks(normalized).then((value) => { if (active) setResults(value); }).catch(() => { if (active) setError("Search is unavailable. Try again in a moment."); }).finally(() => { if (active) setLoading(false); });
    }, 300);
    return () => { active = false; window.clearTimeout(timer); };
  }, [normalized]);

  const handleChange = (value: string) => {
    setQuery(value);
    const nextUrl = value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search";
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7">
      <div><p className="mb-1 text-sm text-muted">Find your next favorite</p><h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Search</h1></div>
      <label className="flex h-12 max-w-2xl items-center gap-3 rounded-full border border-line bg-surface px-4 transition focus-within:border-accent"><Search size={19} className="shrink-0 text-muted" /><span className="sr-only">Search songs, artists, and playlists</span><input autoFocus value={query} onChange={(event) => handleChange(event.target.value)} placeholder="Songs, artists, playlists" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" /></label>
      {!normalized ? <div className="rounded-2xl border border-line bg-surface px-6 py-12 text-center"><h2 className="font-display text-xl font-semibold">What are you in the mood for?</h2><p className="mt-2 text-sm text-muted">Search by song, artist, album, or playlist.</p></div> : error ? <p role="alert" className="rounded-xl border border-line bg-surface p-5 text-sm text-muted">{error}</p> : loading ? <div className="space-y-7"><section className="space-y-3"><div className="h-6 w-24 animate-pulse rounded bg-elevated" /><SectionSkeleton count={4} /></section><section className="space-y-3"><div className="h-6 w-20 animate-pulse rounded bg-elevated" />{[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-lg bg-surface" />)}</section></div> : (
        <>
          <section aria-labelledby="song-results-heading" className="space-y-3"><h2 id="song-results-heading" className="font-display text-xl font-semibold">Songs</h2>{results.tracks.length ? <div className="flex flex-col">{results.tracks.map((track, index) => <TrackRow key={track.id} track={track} n={index + 1} queue={results.tracks} />)}</div> : <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">No songs match “{normalized}”.</p>}</section>
          <section aria-labelledby="playlist-results-heading" className="space-y-3"><h2 id="playlist-results-heading" className="font-display text-xl font-semibold">Playlists</h2>{results.playlists.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{results.playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}</div> : <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">No playlists match “{normalized}”.</p>}</section>
        </>
      )}
    </div>
  );
}
