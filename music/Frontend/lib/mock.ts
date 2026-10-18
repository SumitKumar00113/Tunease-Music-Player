import type { Playlist, Track } from "./types";

// Replace with calls to music/Backend (port 3002) later.
const song = (n: number) =>
  `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const tracks: Track[] = Array.from({ length: 8 }, (_, i) => ({
  id: `t${i + 1}`,
  title: `Track ${i + 1}`,
  artist: `Artist ${(i % 4) + 1}`,
  album: `Album ${(i % 3) + 1}`,
  url: song(i + 1),
  coverUrl: "",
  duration: 200 + i * 17,
}));

export const playlists: Playlist[] = [
  { id: "chill", name: "Chill Vibes", owner: "Tunease", coverUrl: "", tracks },
  { id: "focus", name: "Deep Focus", owner: "Tunease", coverUrl: "", tracks: [...tracks].reverse() },
  { id: "liked", name: "Liked Songs", owner: "You", coverUrl: "", tracks: tracks.slice(0, 5) },
  { id: "gym", name: "Gym Energy", owner: "Tunease", coverUrl: "", tracks: tracks.slice(2) },
];

export type StudioTrackStatus = "Live" | "Processing" | "Draft" | "Scheduled";

export type StudioTrack = {
  id: string;
  title: string;
  album: string;
  status: StudioTrackStatus;
  plays: number;
  likes: number;
  released: string;
  coverUrl: string;
};

export const studioStats = [
  { label: "Total plays", value: "24,891", change: "+12.8% vs previous period" },
  { label: "Monthly listeners", value: "8,204", change: "+8.2% vs previous period" },
  { label: "Followers", value: "1,462", change: "+5.4% vs previous period" },
  { label: "Playlist adds", value: "683", change: "+14.1% vs previous period" },
];

export const studioActivity = {
  plays: [18, 28, 24, 41, 35, 52, 46, 66, 58, 74, 71, 89],
  listeners: [14, 21, 19, 32, 29, 43, 39, 54, 49, 61, 66, 77],
};

export const studioTracks: StudioTrack[] = [
  { id: "st-01", title: "Afterglow", album: "Night Drive", status: "Live", plays: 8240, likes: 614, released: "2025-09-18", coverUrl: "" },
  { id: "st-02", title: "Soft Focus", album: "Night Drive", status: "Live", plays: 5921, likes: 408, released: "2025-09-18", coverUrl: "" },
  { id: "st-03", title: "Stay a Little", album: "Stay a Little", status: "Live", plays: 4108, likes: 327, released: "2025-07-02", coverUrl: "" },
  { id: "st-04", title: "Parallel Lines", album: "Parallel Lines", status: "Processing", plays: 0, likes: 0, released: "2026-10-15", coverUrl: "" },
  { id: "st-05", title: "Small Hours", album: "Small Hours", status: "Draft", plays: 0, likes: 0, released: "2026-10-12", coverUrl: "" },
  { id: "st-06", title: "Golden", album: "Golden", status: "Scheduled", plays: 0, likes: 0, released: "2026-11-02", coverUrl: "" },
  { id: "st-07", title: "Open Water", album: "Night Drive", status: "Live", plays: 3561, likes: 294, released: "2025-09-18", coverUrl: "" },
  { id: "st-08", title: "Still Blue", album: "Still Blue", status: "Live", plays: 3061, likes: 218, released: "2025-05-22", coverUrl: "" },
  { id: "st-09", title: "Slow Motion", album: "Slow Motion", status: "Draft", plays: 0, likes: 0, released: "2026-09-28", coverUrl: "" },
  { id: "st-10", title: "Better Days", album: "Better Days", status: "Live", plays: 0, likes: 0, released: "2025-02-10", coverUrl: "" },
];
