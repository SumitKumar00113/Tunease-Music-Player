"use client";

import { useMemo, useState } from "react";
import { ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { studioTracks, type StudioTrackStatus } from "@/lib/mock";
import StudioCover from "./StudioCover";
import StatusBadge from "./StatusBadge";

type Filter = "All" | StudioTrackStatus;
const pageSize = 8;

export default function StudioTracks() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = useMemo(() => studioTracks.filter((track) => (filter === "All" || track.status === filter) && `${track.title} ${track.album}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === "Most played" ? b.plays - a.plays : sort === "Title" ? a.title.localeCompare(b.title) : b.released.localeCompare(a.released)), [filter, query, sort]);
  const pageTracks = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const selectPage = () => setSelected((current) => pageTracks.every((track) => current.includes(track.id)) ? current.filter((id) => !pageTracks.some((track) => track.id === id)) : [...new Set([...current, ...pageTracks.map((track) => track.id)])]);
  const updateFilter = (value: Filter) => { setFilter(value); setPage(0); setSelected([]); };

  return <div className="studio-content">
    <div className="studio-toolbar"><div className="studio-tabs" role="group" aria-label="Filter tracks">{(["All", "Live", "Draft", "Processing"] as const).map((tab) => <button type="button" key={tab} aria-pressed={filter === tab} onClick={() => updateFilter(tab)}>{tab}</button>)}</div><div className="flex items-center gap-2"><label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 text-muted"><Search size={15}/><span className="sr-only">Search your tracks</span><input className="studio-search border-0 bg-transparent px-0 outline-none" value={query} onChange={(event) => {setQuery(event.target.value);setPage(0);}} placeholder="Search your tracks"/></label><label className="relative flex items-center"><span className="sr-only">Sort tracks</span><select className="studio-select appearance-none pr-8" value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>Most played</option><option>Title</option></select><ChevronDown size={13} className="pointer-events-none absolute right-3 text-muted"/></label></div></div>
    {selected.length > 0 && <div className="flex items-center gap-2 text-xs text-muted" role="status">{selected.length} selected <button type="button" className="text-accent-soft" onClick={() => setSelected([])}>Clear selection</button></div>}
    <div className="studio-table-wrap"><table className="studio-table min-w-[820px]"><thead><tr><th><input aria-label="Select all tracks on this page" type="checkbox" checked={pageTracks.length > 0 && pageTracks.every((track) => selected.includes(track.id))} onChange={selectPage}/></th><th>TRACK</th><th>STATUS</th><th>PLAYS</th><th>LIKES</th><th>RELEASED</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{pageTracks.map((track) => <tr key={track.id}><td><input aria-label={`Select ${track.title}`} type="checkbox" checked={selected.includes(track.id)} onChange={() => toggle(track.id)}/></td><td><div className="studio-row-track"><StudioCover label={track.title} imageUrl={track.coverUrl}/><span className="studio-track-copy"><strong>{track.title}</strong><small>{track.album}</small></span></div></td><td><StatusBadge status={track.status}/></td><td>{track.plays.toLocaleString()}</td><td>{track.likes.toLocaleString()}</td><td>{new Date(`${track.released}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td><td><details className="relative"><summary aria-label={`Actions for ${track.title}`} className="grid size-8 list-none place-items-center rounded-full text-muted hover:bg-elevated hover:text-foreground [&::-webkit-details-marker]:hidden"><MoreHorizontal size={17}/></summary><div className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-line bg-elevated p-1 shadow-xl"><button className="w-full rounded px-2 py-1.5 text-left text-xs text-muted hover:bg-surface hover:text-foreground" type="button" onClick={(event) => {event.currentTarget.closest("details")?.removeAttribute("open");}}>Edit track</button><button className="w-full rounded px-2 py-1.5 text-left text-xs text-muted hover:bg-surface hover:text-foreground" type="button" onClick={(event) => {event.currentTarget.closest("details")?.removeAttribute("open");}}>View release</button></div></details></td></tr>)}</tbody></table>{pageTracks.length === 0 && <p className="p-12 text-center text-sm text-muted">No tracks match this filter.</p>}</div>
    <div className="studio-pagination"><span>Showing {filtered.length ? page * pageSize + 1 : 0} to {Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length} tracks</span><div className="flex gap-2"><button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</button><button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>Next</button></div></div>
  </div>;
}
