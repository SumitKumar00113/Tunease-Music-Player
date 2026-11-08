"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import Cover from "./Cover";
import TrackRow from "./TrackRow";
import Sticker from "@/components/ui/Sticker";
import ColorTile from "@/components/ui/ColorTile";
import RevealWords from "@/components/ui/RevealWords";
import { searchTracks } from "@/lib/api";
import type { SearchResults } from "@/lib/types";

const emptyResults: SearchResults = { tracks: [], playlists: [] };

const genres = [
  { name: "rock", color: "var(--color-lime)", cover: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=500&q=80" },
  { name: "pop", color: "var(--color-lav)", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80" },
  { name: "hip hop", color: "var(--color-pink)", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80" },
  { name: "jazz", color: "var(--color-sky)", cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=500&q=80" },
  { name: "blues", color: "var(--color-violet)", cover: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=500&q=80" },
  { name: "classical", color: "var(--color-muted)", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=500&q=80" },
  { name: "reggae", color: "var(--color-red)", cover: "https://images.unsplash.com/photo-1524365-720d0b9f1d9c?auto=format&fit=crop&w=500&q=80" },
  { name: "folk", color: "var(--color-lime)", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80" },
  { name: "country", color: "var(--color-lav)", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80" },
];

function ShimmerBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`search-shimmer rounded-[14px] ${className}`} />;
}

function SearchLoadingState() {
  return (
    <div className="space-y-8" aria-label="Loading search results" aria-busy="true">
      <section className="space-y-3">
        <ShimmerBlock className="h-7 w-24" />
        <div className="space-y-2 rounded-[24px] border border-line bg-surface p-3 sm:p-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3 py-1"><ShimmerBlock className="size-10 shrink-0" /><div className="flex-1 space-y-2"><ShimmerBlock className="h-3 w-2/3" /><ShimmerBlock className="h-2.5 w-1/3" /></div><ShimmerBlock className="h-3 w-10" /></div>)}
        </div>
      </section>
      <section className="space-y-3">
        <ShimmerBlock className="h-7 w-28" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="rounded-[24px] border border-line bg-surface p-3"><ShimmerBlock className="aspect-square w-full rounded-[20px]" /><ShimmerBlock className="mt-3 h-3 w-3/4" /><ShimmerBlock className="mt-2 h-2.5 w-1/2" /></div>)}
        </div>
      </section>
    </div>
  );
}

function EmptyResults({ kind, query }: { kind: string; query: string }) {
  return (
    <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
      <ShimmerBlock className="mb-4 h-2 w-16" />
      <p className="m-0 text-sm font-semibold text-foreground">No {kind} found for “{query}”.</p>
      <div aria-hidden="true" className="mt-4 flex gap-2 opacity-50"><ShimmerBlock className="h-2 w-2/5" /><ShimmerBlock className="h-2 w-1/5" /></div>
    </div>
  );
}

export default function SearchContent({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [loading, setLoading] = useState(Boolean(initialQuery.trim()));
  const [error, setError] = useState("");
  const normalized = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (!normalized) return;
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchTracks(normalized, controller.signal).then((value) => { if (active) setResults(value); }).catch((reason: unknown) => { if (active && !(reason instanceof DOMException && reason.name === "AbortError")) setError("Search is unavailable. Try again in a moment."); }).finally(() => { if (active) setLoading(false); });
    }, 300);
    return () => { active = false; controller.abort(); window.clearTimeout(timer); };
  }, [normalized]);

  const handleChange = (value: string) => {
    setLoading(Boolean(value.trim()));
    setError("");
    setQuery(value);
    const nextUrl = value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search";
    router.replace(nextUrl, { scroll: false });
  };

  const chooseGenre = (genre: string) => {
    handleChange(genre);
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 pb-8">
      <header className="relative isolate overflow-hidden rounded-[28px] border border-line bg-surface/70 px-5 py-6 sm:px-8 sm:py-8">
        <div aria-hidden="true" className="glow-brand pointer-events-none absolute -right-16 -top-36 -z-10 size-[26rem] rounded-full blur-3xl" />
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-lime">Find your next favorite</p>
        <h1 className="m-0 font-display text-5xl font-extrabold leading-[0.85] tracking-[-0.05em] sm:text-7xl"><RevealWords>Search</RevealWords></h1>
        <div className="mt-6 flex max-w-3xl flex-wrap items-center gap-2.5" aria-label="Try a genre">
          {genres.map(({ name }) => (
            <button key={name} type="button" onClick={() => chooseGenre(name)} aria-label={`Search ${name}`} className="rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime">
              <Sticker>{name}</Sticker>
            </button>
          ))}
        </div>
        <form role="search" onSubmit={(event) => event.preventDefault()} className="mt-6 flex h-12 max-w-2xl items-center gap-3 rounded-full border border-line bg-bg px-4 transition focus-within:border-lime focus-within:bg-elevated">
          <Search size={19} aria-hidden="true" className="shrink-0 text-muted" />
          <label htmlFor="search-page-input" className="sr-only">Search songs, artists, and playlists</label>
          <input ref={inputRef} id="search-page-input" autoFocus value={query} onChange={(event) => handleChange(event.target.value)} placeholder="Songs, artists, playlists" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted" />
          <button type="submit" aria-label="Search" className="sr-only">Search</button>
        </form>
      </header>

      {error ? <p role="alert" className="rounded-[20px] border border-red/30 bg-red/10 p-4 text-sm text-red">{error}</p> : loading ? <SearchLoadingState /> : normalized ? (
        <div className="space-y-8">
          <motion.section initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.3 }} aria-labelledby="song-results-heading" className="space-y-3">
            <div className="flex items-baseline justify-between gap-3"><h2 id="song-results-heading" className="m-0 text-3xl">Songs</h2><span className="text-xs text-muted">{results.tracks.length} results</span></div>
            {results.tracks.length ? <div className="divide-y divide-line/70">{results.tracks.map((track, index) => <TrackRow key={track.id} track={track} n={index + 1} queue={results.tracks} />)}</div> : <EmptyResults kind="songs" query={normalized} />}
          </motion.section>
          <motion.section initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.3, delay: 0.07 }} aria-labelledby="playlist-results-heading" className="space-y-3">
            <div className="flex items-baseline justify-between gap-3"><h2 id="playlist-results-heading" className="m-0 text-3xl">Playlists</h2><span className="text-xs text-muted">{results.playlists.length} results</span></div>
            {results.playlists.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{results.playlists.map((playlist, index) => (
              <motion.div key={playlist.id} initial={reduceMotion ? false : { y: 9 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={reduceMotion ? undefined : { y: -4, rotate: index % 2 ? 1.2 : -1.2 }} transition={{ duration: 0.32, delay: reduceMotion ? 0 : index * 0.07 }}>
              <Link href={`/playlist/${encodeURIComponent(playlist.id)}`} className="group block rounded-[24px] border border-line bg-surface p-3 transition-colors hover:bg-elevated">
                <Cover id={playlist.id} coverUrl={playlist.coverUrl} priority={index === 0} className="!rounded-[22px] w-full shadow-lg shadow-bg/40" />
                <span className="block truncate px-1 pt-3 text-sm font-semibold">{playlist.name}</span>
                <span className="mt-1 block truncate px-1 text-xs text-muted">{playlist.tracks.length} songs · {playlist.owner}</span>
              </Link>
              </motion.div>
            ))}</div> : <EmptyResults kind="playlists" query={normalized} />}
          </motion.section>
        </div>
      ) : (
        <motion.section initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.3 }} aria-labelledby="browse-heading" className="space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-lav">Explore the sound</p>
            <h2 id="browse-heading" className="m-0 text-3xl sm:text-4xl">Browse all</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {genres.map((genre, index) => (
              <motion.button key={genre.name} type="button" onClick={() => chooseGenre(genre.name)} aria-label={`Browse ${genre.name}`} initial={reduceMotion ? false : { y: 10 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.15 }} whileHover={reduceMotion ? undefined : { y: -4, rotate: index % 2 ? 1.2 : -1.2 }} transition={{ duration: 0.3, delay: reduceMotion ? 0 : index * 0.07 }} className="group relative overflow-hidden rounded-[24px] border border-line bg-surface p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime">
                <ColorTile aria-hidden="true" color={genre.color} coverSrc={genre.cover} priority={index === 0} className="max-w-none rounded-[20px] transition-transform duration-300 group-hover:scale-[0.98]" />
                <span className="block px-2 pb-2 pt-3 text-sm font-bold capitalize">{genre.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}

      <style jsx>{`
        .search-shimmer {
          background: linear-gradient(100deg, var(--color-surface) 20%, var(--color-elevated) 45%, var(--color-surface) 70%);
          background-size: 220% 100%;
          animation: search-shimmer 1.45s linear infinite;
        }

        @keyframes search-shimmer {
          from { background-position: 100% 0; }
          to { background-position: -120% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .search-shimmer { animation: none; }
        }
      `}</style>
    </div>
  );
}
