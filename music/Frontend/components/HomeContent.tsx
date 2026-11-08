"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import PlaylistCard from "@/components/PlaylistCard";
import QuickPick from "@/components/QuickPick";
import SectionSkeleton from "@/components/SectionSkeleton";
import Chip from "@/components/ui/Chip";
import ColorTile from "@/components/ui/ColorTile";
import SquircleAvatar from "@/components/ui/SquircleAvatar";
import RevealWords from "@/components/ui/RevealWords";
import useLoopActive from "@/components/ui/useLoopActive";
import { getPlaylists } from "@/lib/api";
import type { Playlist, Track } from "@/lib/types";

const genres = [
  { name: "Ambient", color: "var(--color-lav)", cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80" },
  { name: "Electronic", color: "var(--color-lime)", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80" },
  { name: "Indie", color: "var(--color-red)", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80" },
  { name: "Jazz", color: "var(--color-muted)", cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=500&q=80" },
  { name: "Soul", color: "var(--color-sky)", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80" },
];

const artists = [
  { name: "Ari Nova", ring: "var(--color-lime)" },
  { name: "Mika Moon", ring: "var(--color-lav)" },
  { name: "Kai Rivers", ring: "var(--color-pink)" },
  { name: "Noah June", ring: "var(--color-sky)" },
  { name: "Sage Bloom", ring: "var(--color-red)" },
  { name: "Remy Sol", ring: "var(--color-lime)" },
];

function DiagonalDivider() {
  return <div aria-hidden="true" className="h-1.5 w-full bg-gradient-to-r from-lime/70 via-lav/60 to-sky/70 [clip-path:polygon(0_0,100%_0,98%_100%,0_100%)]" />;
}

const HomeOrbit = dynamic(() => import("./HomeOrbit"), { ssr: false, loading: () => <div aria-hidden="true" className="pointer-events-none absolute right-[-2rem] top-1/2 hidden size-[23rem] rounded-full border border-line/40 lg:block" /> });

export default function HomeContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");
  const reduceMotion = useReducedMotion();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeActive = useLoopActive(marqueeRef);
  const marqueeControls = useAnimationControls();
  const [marqueeHovered, setMarqueeHovered] = useState(false);

  useEffect(() => {
    if (marqueeActive && !marqueeHovered) void marqueeControls.start({ x: ["0%", "-50%"], transition: { duration: 34, ease: "linear", repeat: Infinity } });
    else marqueeControls.stop();
    return () => marqueeControls.stop();
  }, [marqueeActive, marqueeHovered, marqueeControls]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
    };

    updateGreeting();
    const interval = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    getPlaylists().then((items) => {
      if (active) setPlaylists(items);
    }).catch(() => {
      if (active) setError("Music is unavailable right now. Please try again.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const tracks: Track[] = playlists.flatMap((playlist) => playlist.tracks);
  const quickPicks = tracks.filter((track, index) => tracks.findIndex((item) => item.id === track.id) === index).slice(0, 6);
  const renderPlaylistRow = (items: Playlist[], label: string) => {
    if (loading) return <SectionSkeleton count={4} />;
    if (error) return <p className="rounded-[20px] border border-line bg-surface p-5 text-sm text-muted">{error}</p>;
    if (items.length === 0) return <p className="rounded-[20px] border border-line bg-surface p-5 text-sm text-muted">No playlists yet. Browse music and your saved playlists will appear here.</p>;
    return <div aria-label={label} className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{items.map((playlist, index) => <PlaylistCard key={`${label}-${playlist.id}`} playlist={playlist} staggerIndex={index} priority={index === 0} />)}</div>;
  };

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 pb-8">
      <header className="relative isolate overflow-hidden py-8 sm:py-12">
        <div aria-hidden="true" className="glow-brand pointer-events-none absolute -left-12 -top-16 -z-10 size-[22rem] rounded-full blur-3xl sm:left-12 sm:size-[30rem]" />
        <HomeOrbit />
        <p className="relative z-10 mb-3 text-sm font-medium text-muted">{greeting || "Your sound, right where you left it"}</p>
        <h1 className="relative z-10 m-0 font-display text-[clamp(5.5rem,18vw,15rem)] font-extrabold leading-[0.72] tracking-[-0.07em] text-foreground"><RevealWords>Discover</RevealWords></h1>
      </header>

      <DiagonalDivider />

      <nav aria-label="Discover categories" className="flex flex-wrap gap-2">
        <Chip active>All</Chip>
        <Chip>Artists</Chip>
        <Chip>Playlists</Chip>
        <Chip>Songs</Chip>
      </nav>

      <DiagonalDivider />

      <motion.section aria-labelledby="genres-heading" className="flex flex-col gap-4" initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.35 }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime">Find your frequency</p>
            <h2 id="genres-heading" className="m-0 text-3xl sm:text-4xl"><RevealWords>Popular genres</RevealWords></h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {genres.map((genre, index) => (
            <motion.article key={genre.name} initial={reduceMotion ? false : { y: 10 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.32, delay: index * 0.07 }} whileHover={reduceMotion ? undefined : { y: -4, rotate: index % 2 ? 1.3 : -1.3 }} className="group relative overflow-hidden rounded-[24px] border border-line bg-surface p-2.5 transition-colors hover:bg-elevated sm:p-3">
              <ColorTile color={genre.color} coverSrc={genre.cover} priority={index === 0} className="max-w-none rounded-[20px]" />
              <h3 className="mb-1 mt-3 px-1 text-xl sm:text-2xl"><RevealWords>{genre.name}</RevealWords></h3>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <DiagonalDivider />

      <motion.section aria-labelledby="quick-access-heading" className="flex flex-col gap-4" initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.35, delay: 0.06 }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime">Pick up where you left off</p>
            <h2 id="quick-access-heading" className="m-0 text-3xl sm:text-4xl"><RevealWords>Quick access</RevealWords></h2>
          </div>
        </div>
        {loading ? <SectionSkeleton count={6} /> : quickPicks.length === 0 ? (
          <p className="rounded-[20px] border border-line bg-surface p-5 text-sm text-muted">{error || "No tracks available yet."}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
            {quickPicks.map((track, index) => <QuickPick key={track.id} track={track} queue={tracks} staggerIndex={index} priority={index === 0} />)}
          </div>
        )}
      </motion.section>

      <DiagonalDivider />

      <motion.section aria-labelledby="artists-heading" className="flex flex-col gap-4" initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.35, delay: 0.06 }}>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-lav">Curated for your next favorite</p>
          <h2 id="artists-heading" className="m-0 text-3xl sm:text-4xl"><RevealWords>Artists for you</RevealWords></h2>
        </div>
        <div ref={marqueeRef} className="artist-marquee overflow-hidden py-2">
          <motion.div animate={marqueeControls} onHoverStart={() => setMarqueeHovered(true)} onHoverEnd={() => setMarqueeHovered(false)} className="artist-marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1 ? true : undefined} className={`artist-marquee-group flex shrink-0 gap-5 pr-5 sm:gap-7 sm:pr-7 ${copy === 1 ? "artist-marquee-copy" : ""}`}>
                {artists.map((artist) => (
                  <figure key={`${copy}-${artist.name}`} className="m-0 flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-24">
                    <SquircleAvatar name={artist.name} ringColor={artist.ring} className="size-16 rounded-[22px] sm:size-20 sm:rounded-[26px]" />
                    <figcaption className="w-full truncate text-xs font-medium text-muted">{artist.name}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <DiagonalDivider />

      <motion.section aria-labelledby="recent-heading" className="flex flex-col gap-3" initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.35 }}>
        <h2 id="recent-heading" className="m-0 text-3xl sm:text-4xl"><RevealWords>Recently played</RevealWords></h2>
        {renderPlaylistRow(playlists.slice(0, 5), "Recently played playlists")}
      </motion.section>

      <motion.section aria-labelledby="made-heading" className="flex flex-col gap-3" initial={reduceMotion ? false : { y: 8 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.35 }}>
        <h2 id="made-heading" className="m-0 text-3xl sm:text-4xl"><RevealWords>Made for you</RevealWords></h2>
        {renderPlaylistRow([...playlists].reverse().slice(0, 5), "Made for you playlists")}
      </motion.section>
    </div>
  );
}
