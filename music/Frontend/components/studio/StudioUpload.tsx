"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { CheckCircle2, FileAudio2, ImagePlus, LoaderCircle, Upload, X } from "lucide-react";

type Visibility = "Public" | "Private" | "Scheduled";
type Draft = { title: string; genre: string; album: string; releaseDate: string; featuredArtists: string; description: string; visibility: Visibility };
const draftKey = "tunease-studio-draft";
const blankDraft: Draft = { title: "", genre: "", album: "", releaseDate: "", featuredArtists: "", description: "", visibility: "Public" };

export default function StudioUpload() {
  const [form, setForm] = useState<Draft>(blankDraft);
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [publishing, setPublishing] = useState(false);
  const audioInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const uploadRequest = useRef<XMLHttpRequest | null>(null);
  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(draftKey);
      if (saved) {
        const restored = { ...blankDraft, ...JSON.parse(saved) as Partial<Draft> };
        window.setTimeout(() => setForm(restored), 0);
      }
    } catch { window.localStorage.removeItem(draftKey); }
    return () => { uploadRequest.current?.abort(); };
  }, []);

  const startAudio = (file?: File) => {
    if (!file) return;
    setError(""); setMessage("");
    if (!/\.(mp3|wav)$/i.test(file.name)) { setError("Choose an MP3 or WAV audio file."); return; }
    if (file.size > 50 * 1024 * 1024) { setError("Audio files must be 50 MB or smaller."); return; }
    uploadRequest.current?.abort();
    setAudio(file); setProgress(0);
  };

  const startCover = (file?: File) => {
    if (!file) return;
    setError(""); setMessage("");
    if (!/^image\/(jpeg|png)$/.test(file.type)) { setError("Choose a JPG or PNG image for your cover art."); return; }
    const imageElement = new window.Image(); const preview = URL.createObjectURL(file);
    imageElement.onload = () => {
      URL.revokeObjectURL(preview);
      if (imageElement.naturalWidth < 1000 || imageElement.naturalHeight < 1000) { setError("Cover art must be at least 1000 × 1000 pixels."); return; }
      setCover(file); setCoverPreview(URL.createObjectURL(file));
    };
    imageElement.onerror = () => { URL.revokeObjectURL(preview); setError("This image could not be opened."); };
    imageElement.src = preview;
  };

  const saveDraft = () => {
    window.localStorage.setItem(draftKey, JSON.stringify(form));
    setError(""); setMessage("Draft saved on this device.");
  };

  const publish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setMessage("");
    if (!audio || !cover || progress < 100) { setError("Add an audio file and cover art, then wait for the upload to finish."); return; }
    if (form.visibility === "Scheduled" && !form.releaseDate) { setError("Choose a release date for a scheduled track."); return; }
    setPublishing(true);
    const payload = new FormData();
    payload.append("music", audio);
    payload.append("coverImage", cover);
    payload.append("title", form.title.trim());
    payload.append("genre", form.genre);
    payload.append("albumName", form.album.trim());
    payload.append("featuredArtists", form.featuredArtists.trim());
    payload.append("description", form.description.trim());
    payload.append("releaseDate", form.releaseDate || new Date().toISOString());
    payload.append("visibility", form.visibility);
    payload.append("duration", "180");
    const token = window.localStorage.getItem("accessToken") || window.localStorage.getItem("token");
    const apiUrl = (process.env.NEXT_PUBLIC_MUSIC_API_URL || "https://tunease-music-service-latest.onrender.com").replace(/\/$/, "");
    await new Promise<void>((resolve) => {
      const request = new XMLHttpRequest();
      uploadRequest.current = request;
      request.open("POST", `${apiUrl}/api/music/upload-music`);
      request.withCredentials = true;
      if (token) request.setRequestHeader("Authorization", `Bearer ${token}`);
      request.upload.onprogress = (uploadEvent) => {
        if (uploadEvent.lengthComputable) setProgress(Math.round((uploadEvent.loaded / uploadEvent.total) * 100));
      };
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          window.localStorage.removeItem(draftKey);
          setMessage(form.visibility === "Public" ? `“${form.title}” was published.` : `“${form.title}” was saved as ${form.visibility.toLowerCase()}.`);
          setAudio(null); setCover(null); setCoverPreview("");
          if (audioInput.current) audioInput.current.value = "";
          if (coverInput.current) coverInput.current.value = "";
        } else {
          try { const result = JSON.parse(request.responseText) as { message?: string }; setError(result.message || `Upload failed (${request.status}).`); }
          catch { setError(`Upload failed (${request.status}).`); }
        }
        uploadRequest.current = null; resolve();
      };
      request.onerror = () => { setError("Could not reach the music service. Check your connection and try again."); uploadRequest.current = null; resolve(); };
      request.onabort = () => { uploadRequest.current = null; resolve(); };
      request.send(payload);
    });
    setPublishing(false);
  };

  const cancelAudio = () => {
    uploadRequest.current?.abort();
    setAudio(null); setProgress(0); setPublishing(false);
    if (audioInput.current) audioInput.current.value = "";
  };

  return <form className="studio-content" onSubmit={publish}>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="m-0 text-xs text-muted">Create a release for your listeners.</p></div><div className="flex gap-2"><button type="button" className="studio-button studio-button-flat" onClick={saveDraft}>Save draft</button><button data-rate-limited-action type="submit" className="studio-button studio-button-brand" disabled={publishing}>{publishing && <LoaderCircle className="animate-spin" size={14}/>}Publish</button></div></div>
    {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-200">{error}</p>}{message && <p role="status" className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-200"><CheckCircle2 size={15}/>{message}</p>}
    <div className="studio-form-layout"><div className="studio-upload-panel">
      <section className="studio-card studio-panel"><div className="studio-panel-heading"><h2>Audio file</h2><span className="text-[9px] text-muted">REQUIRED</span></div><input className="sr-only" ref={audioInput} type="file" accept=".mp3,.wav,audio/mpeg,audio/wav" onChange={(event) => startAudio(event.currentTarget.files?.[0])}/><button type="button" className="studio-dropzone mt-3 w-full px-5" onClick={() => audioInput.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => {event.preventDefault();startAudio(event.dataTransfer.files[0]);}}><FileAudio2 size={29} className="text-accent-soft"/><strong>Drag your audio file here</strong><small>MP3 or WAV, up to 50 MB</small><span className="studio-button studio-button-flat">Choose file</span></button>{audio && <div className="studio-progress mt-3"><div className="flex items-center gap-3"><FileAudio2 size={19} className="text-accent-soft"/><span className="studio-track-copy"><strong>{audio.name}</strong><small>{(audio.size / 1024 / 1024).toFixed(1)} MB · {progress === 100 ? "Upload complete" : publishing ? `Uploading ${progress}%` : "Ready to upload"}</small></span><button type="button" aria-label="Cancel audio upload" onClick={cancelAudio} className="rounded-full p-1.5 text-muted hover:bg-elevated hover:text-foreground"><X size={15}/></button></div><div className="studio-progress-track"><span style={{ width: `${progress}%` }}/></div></div>}</section>
      <section className="studio-card studio-panel"><div className="studio-panel-heading"><h2>Cover art</h2><span className="text-[9px] text-muted">REQUIRED</span></div><div className="studio-cover-upload mt-3"><input className="sr-only" ref={coverInput} type="file" accept="image/jpeg,image/png" onChange={(event) => startCover(event.currentTarget.files?.[0])}/><button type="button" className="studio-cover-drop" onClick={() => coverInput.current?.click()} aria-label="Choose cover art">{coverPreview ? <Image src={coverPreview} alt="Cover art preview" fill sizes="130px" unoptimized className="object-cover"/> : <span className="grid justify-items-center gap-2"><ImagePlus size={25}/><span className="text-[8px]">Choose image</span></span>}</button><div className="grid gap-2"><strong className="text-[10px]">{cover?.name || "Upload your artwork"}</strong><span className="text-[9px] leading-5 text-muted">Square JPG or PNG, at least 1000 × 1000 px.</span><button type="button" className="studio-button studio-button-flat w-max" onClick={() => coverInput.current?.click()}>{cover ? "Replace image" : "Upload image"}</button></div></div></section>
    </div>
      <section className="studio-card studio-form-card"><div className="studio-panel-heading"><h2>Track details</h2><span className="text-[9px] text-muted">* REQUIRED</span></div><label className="studio-field">Title *<input required maxLength={120} value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="Track title"/></label><div className="studio-form-grid"><label className="studio-field">Genre *<select required value={form.genre} onChange={(event) => setField("genre", event.target.value)}><option value="">Select genre</option>{["Alternative","Ambient","Classical","Country","Electronic","Hip-hop","Indie","Jazz","Pop","R&B","Rock","Soul"].map((genre) => <option key={genre}>{genre}</option>)}</select></label><label className="studio-field">Album (optional)<input value={form.album} onChange={(event) => setField("album", event.target.value)} placeholder="Album name"/></label><label className="studio-field">Release date<input type="date" value={form.releaseDate} onChange={(event) => setField("releaseDate", event.target.value)}/></label><label className="studio-field">Featured artists<input value={form.featuredArtists} onChange={(event) => setField("featuredArtists", event.target.value)} placeholder="Add artists"/></label></div><label className="studio-field">Description<textarea rows={5} value={form.description} onChange={(event) => setField("description", event.target.value)} placeholder="Tell listeners about this track"/></label><fieldset className="m-0 border-0 p-0"><legend className="mb-2 text-[9px] text-muted">Visibility</legend><div className="studio-radio-cards">{(["Public","Private","Scheduled"] as const).map((value) => <label key={value}><input type="radio" name="visibility" value={value} checked={form.visibility === value} onChange={() => setField("visibility", value)}/>{value}</label>)}</div></fieldset><div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-[9px] text-muted"><span>Uploads are checked by Tunease before publishing.</span><button data-rate-limited-action type="submit" className="studio-button studio-button-brand" disabled={publishing}><Upload size={14}/>{form.visibility === "Public" ? "Publish track" : "Save track"}</button></div></section>
    </div>
  </form>;
}
