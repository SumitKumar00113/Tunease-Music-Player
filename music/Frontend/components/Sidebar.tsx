"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, ListMusic, Plus, Search } from "lucide-react";
import Cover from "./Cover";
import { getPlaylists } from "@/lib/api";
import type { Playlist } from "@/lib/types";

const navigation = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
];

export default function Sidebar() {
  const path = usePathname();
  const reduceMotion = useReducedMotion();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getPlaylists().then((items) => { if (active) setPlaylists(items); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <aside className="hidden min-h-0 flex-col gap-5 overflow-hidden border-r border-line bg-bg p-4 md:flex">
      <Link href="/" aria-label="Tunease home" className="px-2 py-1 font-display text-3xl font-extrabold tracking-tight">
        <span className="text-foreground">Tune</span><span className="text-lime">ase</span>
      </Link>
      <nav aria-label="Main navigation" className="flex flex-col gap-1.5">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = path === href || href !== "/" && path.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`relative isolate flex h-12 items-center gap-3 rounded-[18px] px-4 text-sm font-semibold transition-colors ${active ? "text-bg" : "text-muted hover:text-foreground"}`}>
              {active && <motion.span layoutId="sidebar-active-pill" aria-hidden="true" className="absolute inset-0 -z-10 rounded-[18px] bg-lime" transition={{ type: "spring", bounce: 0.18, duration: reduceMotion ? 0 : 0.35 }} />}
              <Icon size={19} />{label}
            </Link>
          );
        })}
      </nav>
      <div className="h-px bg-line" />
      <div className="flex items-center justify-between px-2 text-sm font-semibold">
        <Link href="/library" className="flex items-center gap-2 text-muted transition hover:text-foreground"><ListMusic size={17} /> Your Library</Link>
        <Link href="/library" aria-label="Create playlist" className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-elevated hover:text-foreground"><Plus size={17} /></Link>
      </div>
      <div className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        {loading ? Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3 rounded-[16px] p-2" aria-hidden="true"><div className="size-11 animate-pulse rounded-[14px] bg-elevated" /><div className="flex-1"><div className="h-3 rounded bg-elevated" /><div className="mt-2 h-2 w-2/3 rounded bg-elevated" /></div></div>) : playlists.length ? playlists.map((playlist) => (
          <Link key={playlist.id} href={`/playlist/${encodeURIComponent(playlist.id)}`} aria-current={path === `/playlist/${playlist.id}` ? "page" : undefined} className={`flex items-center gap-3 rounded-[16px] p-2 transition-colors hover:bg-elevated ${path === `/playlist/${playlist.id}` ? "bg-elevated" : ""}`}>
            <Cover id={playlist.id} coverUrl={playlist.coverUrl} className="!rounded-[14px] size-11 shrink-0" />
            <span className="min-w-0"><span className="block truncate text-sm">{playlist.name}</span><span className="block truncate text-xs text-muted">Playlist · {playlist.owner}</span></span>
          </Link>
        )) : <p className="px-2 py-3 text-xs text-muted">No playlists yet.</p>}
      </div>
    </aside>
  );
}
