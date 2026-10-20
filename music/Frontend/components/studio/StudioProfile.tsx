"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, Check, ExternalLink, Music2 } from "lucide-react";

export default function StudioProfile() {
  const [name, setName] = useState("Artist name");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [saved, setSaved] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const save = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaved(true); };
  const choosePhoto = (file?: File) => { if (!file || !file.type.startsWith("image/")) return; setPhoto(URL.createObjectURL(file)); setSaved(false); };
  return <form onSubmit={save} className="studio-content"><section className="studio-card studio-form-card max-w-2xl"><div className="studio-panel-heading"><div><p className="m-0 text-[9px] uppercase tracking-[.16em] text-muted">YOUR ARTIST IDENTITY</p><h2 className="mt-2 font-display text-xl font-semibold">Artist profile</h2></div><Music2 className="text-studio" size={20}/></div><p className="m-0 text-xs leading-6 text-muted">Set up the profile your listeners see when they discover your releases.</p>{saved && <p role="status" className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-200"><Check size={15}/>Profile saved in this preview.</p>}<div className="flex items-center gap-4 border-y border-line py-5"><span className="studio-account-avatar relative size-16 overflow-hidden text-xl">{photo ? <Image className="object-cover" fill sizes="64px" unoptimized src={photo} alt="Artist profile preview"/> : name.slice(0,1).toUpperCase()}</span><span className="grid gap-1"><strong className="text-sm">{name || "Artist name"}</strong><span className="text-xs text-muted">Tunease artist</span></span><input ref={input} className="sr-only" type="file" accept="image/*" aria-label="Choose profile photo" onChange={(event) => choosePhoto(event.currentTarget.files?.[0])}/><button type="button" className="studio-button studio-button-flat ml-auto" onClick={() => input.current?.click()}><Camera size={14}/>Change photo</button></div><label className="studio-field">Artist name<input required maxLength={80} value={name} onChange={(event) => {setName(event.target.value);setSaved(false);}}/></label><label className="studio-field">Bio<textarea rows={4} maxLength={500} value={bio} onChange={(event) => {setBio(event.target.value);setSaved(false);}} placeholder="Tell listeners about your music"/></label><div className="flex flex-wrap items-center justify-between gap-3"><Link className="studio-button studio-button-flat" href="/"><ExternalLink size={14}/>Preview listener app</Link><button className="studio-button studio-button-brand" type="submit">Save profile</button></div></section></form>;
}
