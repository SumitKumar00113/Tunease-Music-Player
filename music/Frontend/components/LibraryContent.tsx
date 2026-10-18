"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import PlaylistCard from "./PlaylistCard";
import SectionSkeleton from "./SectionSkeleton";
import { createPlaylist, getPlaylists } from "@/lib/api";
import type { Playlist } from "@/lib/types";

export default function LibraryContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getPlaylists().then((items) => { if (active) setPlaylists(items); }).catch(() => { if (active) setError("Playlists could not be loaded."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const playlist = await createPlaylist(name.trim());
      setPlaylists((current) => [playlist, ...current.filter((item) => item.id !== playlist.id)]);
      setName("");
      setShowForm(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Playlist could not be created.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <header className="flex items-end justify-between gap-4"><div><p className="mb-1 text-sm text-muted">Your collection</p><h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Your Library</h1></div><button onClick={() => setShowForm(true)} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-foreground transition hover:bg-accent-soft"><Plus size={17} />Create playlist</button></header>
      {error && !showForm && <p role="alert" className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">{error}</p>}
      {loading ? <SectionSkeleton count={6} /> : playlists.length === 0 ? <div className="rounded-2xl border border-line bg-surface px-6 py-12 text-center"><h2 className="font-display text-xl font-semibold">Your library is ready</h2><p className="mt-2 text-sm text-muted">Create a playlist to start collecting music.</p></div> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}</div>}
      {showForm && <div role="presentation" className="fixed inset-0 z-40 grid place-items-center bg-bg/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="create-playlist-heading" className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
          <div className="flex items-start justify-between"><div><h2 id="create-playlist-heading" className="font-display text-xl font-semibold">Create playlist</h2><p className="mt-1 text-sm text-muted">Give your new collection a name.</p></div><button aria-label="Close" onClick={() => setShowForm(false)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-elevated hover:text-foreground"><X size={18} /></button></div>
          <form onSubmit={submit} className="mt-5 space-y-4"><label htmlFor="playlist-name" className="block text-sm font-medium">Playlist name</label><input id="playlist-name" autoFocus maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="h-11 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent" placeholder="Weekend mix" />{error && <p role="alert" className="text-sm text-muted">{error}</p>}<button disabled={saving || !name.trim()} className="h-11 w-full rounded-full bg-accent text-sm font-semibold text-foreground transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Creating…" : "Create playlist"}</button></form>
        </section>
      </div>}
    </div>
  );
}
