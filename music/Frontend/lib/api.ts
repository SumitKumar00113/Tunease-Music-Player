import { playlists as mockPlaylists, tracks as mockTracks } from "@/lib/mock";
import type { Playlist, SearchResults, Track } from "@/lib/types";

const apiBase = (process.env.NEXT_PUBLIC_MUSIC_API_URL || "http://localhost:3002").replace(/\/$/, "");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function mapTrack(value: unknown, index: number): Track | null {
  if (!isRecord(value)) return null;
  const id = readString(value._id, readString(value.id));
  if (!id) return null;
  return {
    id,
    title: readString(value.title, "Untitled track"),
    artist: readString(value.artistName, readString(value.artist, "Tunease artist")),
    album: readString(value.albumName, typeof value.album === "string" ? value.album : "Single"),
    url: readString(value.musicUrl, readString(value.audioUrl)),
    coverUrl: readString(value.coverImageUrl, readString(value.coverUrl)),
    duration: readNumber(value.duration, mockTracks[index % mockTracks.length]?.duration ?? 180),
  };
}

function mapPlaylist(value: unknown, index: number): Playlist | null {
  if (!isRecord(value)) return null;
  const id = readString(value._id, readString(value.id));
  if (!id) return null;
  const rawTracks = Array.isArray(value.songs) ? value.songs : Array.isArray(value.tracks) ? value.tracks : [];
  const playlistTracks = rawTracks.map(mapTrack).filter((track): track is Track => track !== null);
  return {
    id,
    name: readString(value.playListName, readString(value.name, "Untitled playlist")),
    owner: readString(value.artistName, readString(value.owner, "Tunease")),
    coverUrl: readString(value.coverUrl, playlistTracks[0]?.coverUrl ?? mockPlaylists[index % mockPlaylists.length]?.coverUrl ?? ""),
    tracks: playlistTracks,
  };
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(`${apiBase}${path}`, { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(`Music API returned ${response.status}`);
  return response.json() as Promise<unknown>;
}

async function fetchTracks(): Promise<Track[]> {
  try {
    const payload = await fetchJson("/api/music/all");
    const raw = isRecord(payload) && Array.isArray(payload.music) ? payload.music : [];
    return raw.map(mapTrack).filter((track): track is Track => track !== null);
  } catch {
    return mockTracks;
  }
}

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const payload = await fetchJson("/api/music/get-playlist");
    const raw = isRecord(payload) && Array.isArray(payload.playlists) ? payload.playlists : [];
    return raw.map(mapPlaylist).filter((playlist): playlist is Playlist => playlist !== null);
  } catch {
    return mockPlaylists;
  }
}

export async function getPlaylist(id: string): Promise<Playlist | null> {
  try {
    const payload = await fetchJson(`/api/music/playlist/${encodeURIComponent(id)}`);
    const playlist = isRecord(payload) ? mapPlaylist(payload.playlist, 0) : null;
    if (playlist) return playlist;
  } catch {
    // Use the starter catalogue when the backend is unavailable or needs another app's auth session.
  }
  return mockPlaylists.find((playlist) => playlist.id === id) ?? null;
}

export async function searchTracks(query: string): Promise<SearchResults> {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return { tracks: [], playlists: [] };
  const [allTracks, allPlaylists] = await Promise.all([fetchTracks(), getPlaylists()]);
  return {
    tracks: allTracks.filter((track) => `${track.title} ${track.artist} ${track.album}`.toLocaleLowerCase().includes(normalized)),
    playlists: allPlaylists.filter((playlist) => `${playlist.name} ${playlist.owner}`.toLocaleLowerCase().includes(normalized)),
  };
}

export async function createPlaylist(name: string): Promise<Playlist> {
  const tracks = await fetchTracks();
  const firstTrack = tracks[0];
  if (!firstTrack) throw new Error("A track is needed to create a playlist on the music service.");
  const response = await fetch(`${apiBase}/api/music/create-playlist/${encodeURIComponent(firstTrack.id)}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playListName: name }),
  });
  if (!response.ok) throw new Error(response.status === 401 ? "Your music session is not available. Sign in through Tunease Auth, then try again." : `Playlist creation failed (${response.status}).`);
  const payload: unknown = await response.json();
  const playlist = isRecord(payload) ? mapPlaylist(payload.playlist, 0) : null;
  if (!playlist) throw new Error("The music service returned an unexpected playlist response.");
  return playlist;
}
