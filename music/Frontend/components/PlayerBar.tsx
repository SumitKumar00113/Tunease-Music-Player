"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ListMusic, MonitorSpeaker, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import Cover from "./Cover";
import { usePlayer } from "@/store/player";

const fmt = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const musicApi = (process.env.NEXT_PUBLIC_MUSIC_API_URL || "https://tunease-music-service-latest.onrender.com").replace(/\/$/, "");

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const queue = usePlayer((state) => state.queue);
  const index = usePlayer((state) => state.index);
  const track = queue[index];
  const trackId = track?.id;
  const trackUrl = track?.url;
  const isPlaying = usePlayer((state) => state.isPlaying);
  const progress = usePlayer((state) => state.progress);
  const volume = usePlayer((state) => state.volume);
  const shuffle = usePlayer((state) => state.shuffle);
  const repeat = usePlayer((state) => state.repeat);
  const toggle = usePlayer((state) => state.toggle);
  const next = usePlayer((state) => state.next);
  const prev = usePlayer((state) => state.prev);
  const seek = usePlayer((state) => state.seek);
  const setProgress = usePlayer((state) => state.setProgress);
  const setVolume = usePlayer((state) => state.setVolume);
  const toggleShuffle = usePlayer((state) => state.toggleShuffle);
  const cycleRepeat = usePlayer((state) => state.cycleRepeat);
  const [likedTrackId, setLikedTrackId] = useState<string | null>(null);
  const liked = Boolean(track && likedTrackId === track.id);

  useEffect(() => {
    usePlayer.getState().hydrateVolume();
    const socket = io(musicApi, { withCredentials: true, autoConnect: false, reconnection: false });
    socket.on("connect", () => {
      const current = usePlayer.getState().queue[usePlayer.getState().index];
      if (current) socket.emit("play", { musicId: current.id });
    });
    socket.on("connect_error", () => socket.disconnect());
    socketRef.current = socket;
    return () => { socket.disconnect(); socketRef.current = null; };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackId || !trackUrl) return;
    audio.src = trackUrl;
    audio.load();
    seek(0);
    if (isPlaying) audio.play().catch(() => usePlayer.setState({ isPlaying: false }));
    const socket = socketRef.current;
    if (socket && !socket.connected) socket.connect();
    else socket?.emit("play", { musicId: trackId });
  }, [trackId, trackUrl, isPlaying, seek]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (isPlaying && track?.url) audio.play().catch(() => usePlayer.setState({ isPlaying: false }));
    else audio.pause();
  }, [isPlaying, track?.id, track?.url, volume]);

  useEffect(() => {
    const nextTrack = queue[index + 1];
    if (!nextTrack?.url || typeof window === "undefined") return;
    const prefetch = () => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = nextTrack.url;
    };
    const idle = window.requestIdleCallback?.(prefetch, { timeout: 2500 });
    const timer = idle === undefined ? window.setTimeout(prefetch, 800) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [queue, index]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.code !== "Space" || target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))) return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const duration = track?.duration ?? 0;
  const handleEnded = () => {
    if (repeat === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => usePlayer.setState({ isPlaying: false }));
    }
    next();
  };
  const handleSeek = (value: number) => {
    seek(value);
    if (audioRef.current) audioRef.current.currentTime = value;
  };
  const seekStyle = { "--range-value": `${duration ? Math.min(100, progress / duration * 100) : 0}%` } as CSSProperties;
  const volumeStyle = { "--range-value": `${volume * 100}%` } as CSSProperties;

  return (
    <footer className="z-20 grid min-h-[66px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-line bg-surface px-3 py-2 md:min-h-[88px] md:grid-cols-[minmax(0,1fr)_minmax(260px,2fr)_minmax(0,1fr)] md:gap-4 md:px-5">
      <audio ref={audioRef} preload="metadata" onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)} onEnded={handleEnded} />
      <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
        <AnimatePresence mode="wait" initial={false}>
          {track ? <motion.div key={track.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="flex min-w-0 items-center gap-2.5 md:gap-3">
            <Cover id={track.id} coverUrl={track.coverUrl} priority className="size-11 shrink-0 md:size-14" />
            <div className="min-w-0"><div className="truncate text-sm font-medium">{track.title}</div><div className="truncate text-xs text-muted">{track.artist}</div></div>
            <button aria-label={liked ? "Remove from library" : "Add to library"} aria-pressed={liked} onClick={() => setLikedTrackId((current) => current === track.id ? null : track.id)} className={`ml-1 hidden shrink-0 transition hover:text-accent-soft sm:block ${liked ? "text-accent-soft" : "text-muted"}`}><Heart size={17} fill={liked ? "currentColor" : "none"} /></button>
          </motion.div> : <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-muted">Choose a song to start listening</motion.span>}
        </AnimatePresence>
      </div>

      <div className="flex min-w-0 flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 md:gap-5">
          <button aria-label={`Shuffle ${shuffle ? "on" : "off"}`} aria-pressed={shuffle} onClick={toggleShuffle} className={`hidden transition hover:text-foreground md:block ${shuffle ? "text-accent-soft" : "text-muted"}`}><Shuffle size={17} /></button>
          <button aria-label="Previous track" onClick={prev} className="text-muted transition hover:text-foreground"><SkipBack size={19} fill="currentColor" /></button>
          <motion.button whileTap={{ scale: 0.92 }} aria-label={isPlaying ? "Pause" : "Play"} onClick={toggle} disabled={!track} className="grid size-9 place-items-center rounded-full bg-brand text-bg transition hover:brightness-110 disabled:opacity-40 md:size-10">
            <AnimatePresence mode="wait" initial={false}>{isPlaying ? <motion.span key="pause" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .8 }}><Pause size={17} fill="currentColor" /></motion.span> : <motion.span key="play" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .8 }}><Play size={17} fill="currentColor" className="translate-x-px" /></motion.span>}</AnimatePresence>
          </motion.button>
          <button aria-label="Next track" onClick={next} className="text-muted transition hover:text-foreground"><SkipForward size={19} fill="currentColor" /></button>
          <button aria-label={`Repeat ${repeat}`} aria-pressed={repeat !== "off"} onClick={cycleRepeat} className={`hidden transition hover:text-foreground md:block ${repeat !== "off" ? "text-accent-soft" : "text-muted"}`}>{repeat === "one" ? <Repeat1 size={17} /> : <Repeat size={17} />}</button>
        </div>
        <div className="hidden w-full max-w-xl items-center gap-2 text-[11px] text-muted md:flex">
          <span className="w-9 text-right tabular-nums">{fmt(progress)}</span>
          <input style={seekStyle} type="range" aria-label="Seek track" min={0} max={duration || 1} value={Math.min(progress, duration || 0)} onChange={(event) => handleSeek(Number(event.target.value))} className="seek-range h-1 flex-1 cursor-pointer" />
          <span className="w-9 tabular-nums">{fmt(duration)}</span>
        </div>
      </div>

      <div className="hidden items-center justify-end gap-3 text-muted md:flex">
        <button aria-label="Open playback queue" className="grid size-8 place-items-center rounded-full transition hover:bg-elevated hover:text-foreground"><ListMusic size={16}/></button>
        <button aria-label="Select playback device" className="grid size-8 place-items-center rounded-full transition hover:bg-elevated hover:text-foreground"><MonitorSpeaker size={16}/></button>
        {volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
        <input style={volumeStyle} type="range" aria-label="Volume" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="volume-range h-1 w-24 cursor-pointer" />
      </div>
      {track && <input style={seekStyle} type="range" aria-label="Seek track" min={0} max={duration || 1} value={Math.min(progress, duration || 0)} onChange={(event) => handleSeek(Number(event.target.value))} className="seek-range col-span-2 h-1 w-full cursor-pointer md:hidden" />}
    </footer>
  );
}
