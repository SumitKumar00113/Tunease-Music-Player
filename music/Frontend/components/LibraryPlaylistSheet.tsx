"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { X } from "lucide-react";

export default function LibraryPlaylistSheet({ name, setName, saving, error, onClose, onSubmit }: {
  name: string; setName: (value: string) => void; saving: boolean; error: string;
  onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("input, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])')];
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [onClose]);
  return <div role="presentation" className="fixed inset-0 z-40 grid items-end bg-bg/80 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="create-playlist-heading" className="w-full rounded-t-[28px] border border-line bg-surface p-6 shadow-2xl sm:mx-auto sm:max-w-md sm:rounded-[28px]">
      <div className="flex items-start justify-between"><div><h2 id="create-playlist-heading" className="font-display text-2xl font-extrabold tracking-tight">Create playlist</h2><p className="mt-1 text-sm text-muted">Give your new collection a name.</p></div><button aria-label="Close" onClick={onClose} className="grid size-9 place-items-center rounded-full text-muted hover:bg-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"><X size={18} /></button></div>
      <form onSubmit={onSubmit} className="mt-5 space-y-4"><label htmlFor="playlist-name" className="block text-sm font-medium">Playlist name</label><input id="playlist-name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="h-11 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus-visible:border-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime" placeholder="Weekend mix" />{error && <p role="alert" className="text-sm text-muted">{error}</p>}<button data-rate-limited-action disabled={saving || !name.trim()} className="h-11 w-full rounded-full bg-lime text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Creating…" : "Create playlist"}</button></form>
    </section>
  </div>;
}
