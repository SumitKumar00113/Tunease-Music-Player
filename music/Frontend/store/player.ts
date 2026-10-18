import { create } from "zustand";
import type { Track } from "@/lib/types";

export type RepeatMode = "off" | "all" | "one";

type PlayerState = {
  queue: Track[];
  index: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setProgress: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  hydrateVolume: () => void;
};

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  index: -1,
  isPlaying: false,
  progress: 0,
  volume: 0.7,
  shuffle: false,
  repeat: "off",

  play: (track, queue) => {
    const source = queue?.length ? queue : get().queue;
    const nextQueue = source.some((item) => item.id === track.id) ? source : [track, ...source];
    set({ queue: nextQueue, index: nextQueue.findIndex((item) => item.id === track.id), isPlaying: true, progress: 0 });
  },

  toggle: () => {
    if (get().index >= 0) set((state) => ({ isPlaying: !state.isPlaying }));
  },

  next: () => {
    const { index, queue, shuffle, repeat } = get();
    if (index < 0 || queue.length === 0) return;
    if (repeat === "one") {
      set({ progress: 0, isPlaying: true });
      return;
    }
    if (shuffle && queue.length > 1) {
      const choices = queue.map((_, itemIndex) => itemIndex).filter((itemIndex) => itemIndex !== index);
      const nextIndex = choices[Math.floor(Math.random() * choices.length)];
      set({ index: nextIndex, progress: 0, isPlaying: true });
    } else if (index < queue.length - 1) {
      set({ index: index + 1, progress: 0, isPlaying: true });
    } else if (repeat === "all") {
      set({ index: 0, progress: 0, isPlaying: true });
    } else {
      set({ isPlaying: false, progress: 0 });
    }
  },

  prev: () => {
    const { index, queue, progress, repeat } = get();
    if (progress > 3) {
      set({ progress: 0 });
    } else if (index > 0) {
      set({ index: index - 1, progress: 0, isPlaying: true });
    } else if (repeat === "all" && queue.length > 0) {
      set({ index: queue.length - 1, progress: 0, isPlaying: true });
    } else {
      set({ progress: 0 });
    }
  },

  seek: (seconds) => set({ progress: Math.max(0, seconds) }),
  setProgress: (seconds) => set({ progress: Math.max(0, seconds) }),
  setVolume: (volume) => {
    const nextVolume = Math.min(1, Math.max(0, volume));
    set({ volume: nextVolume });
    if (typeof window !== "undefined") window.localStorage.setItem("tunease-volume", String(nextVolume));
  },
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  cycleRepeat: () => set((state) => ({ repeat: state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off" })),
  hydrateVolume: () => {
    if (typeof window === "undefined") return;
    const saved = Number(window.localStorage.getItem("tunease-volume"));
    if (Number.isFinite(saved) && window.localStorage.getItem("tunease-volume") !== null) set({ volume: Math.min(1, Math.max(0, saved)) });
  },
}));
