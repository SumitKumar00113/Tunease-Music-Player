"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Search, UserRound } from "lucide-react";

export default function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 px-4 md:px-7">
      <div className="hidden items-center gap-2 sm:flex">
        <button aria-label="Go back" onClick={() => router.back()} className="grid size-9 place-items-center rounded-full bg-elevated text-muted transition hover:text-foreground"><ArrowLeft size={18} /></button>
        <button aria-label="Go forward" onClick={() => router.forward()} className="grid size-9 place-items-center rounded-full bg-elevated text-muted transition hover:text-foreground"><ArrowRight size={18} /></button>
      </div>
      <form role="search" onSubmit={submit} className="flex h-10 min-w-0 max-w-xl flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4 transition focus-within:border-accent">
        <Search size={18} className="shrink-0 text-muted" />
        <label htmlFor="global-search" className="sr-only">Search songs, artists, playlists</label>
        <input id="global-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search songs, artists, playlists" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted" />
        <button type="submit" className="sr-only">Search</button>
      </form>
      <button aria-label="Tunease profile" title="Tunease music player" className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-elevated text-muted transition hover:text-foreground"><UserRound size={17} /></button>
    </header>
  );
}
