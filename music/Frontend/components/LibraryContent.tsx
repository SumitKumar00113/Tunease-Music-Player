"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import PlaylistCard from "./PlaylistCard";
import SectionSkeleton from "./SectionSkeleton";
import { createPlaylist, getPlaylists } from "@/lib/api";
import type { Playlist } from "@/lib/types";

const LibraryPlaylistSheet = dynamic(() => import("./LibraryPlaylistSheet"), { ssr: false, loading: () => <div aria-hidden="true" className="fixed inset-0 z-40 bg-bg/70" /> });

export default function LibraryContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const closeForm = useCallback(() => setShowForm(false), []);

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
      <header className="flex items-end justify-between gap-4"><div><p className="mb-1 text-sm text-muted">Your collection</p><h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">Your Library</h1></div><button onClick={() => setShowForm(true)} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-bg transition hover:brightness-110 active:scale-[.98]"><Plus size={17} />Create playlist</button></header>
      {error && !showForm && <p role="alert" className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">{error}</p>}
      {loading ? <SectionSkeleton count={6} /> : playlists.length === 0 ? <div className="rounded-2xl border border-line bg-surface px-6 py-12 text-center"><h2 className="font-display text-2xl font-extrabold tracking-tight">Your library is ready</h2><p className="mt-2 text-sm text-muted">Create a playlist to start collecting music.</p></div> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{playlists.map((playlist, index) => <PlaylistCard key={playlist.id} playlist={playlist} staggerIndex={index} priority={index === 0} />)}</div>}
      {showForm && <LibraryPlaylistSheet name={name} setName={setName} saving={saving} error={error} onClose={closeForm} onSubmit={submit} />}
    </div>
  );
}
