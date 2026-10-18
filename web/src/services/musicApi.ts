import { Track, Playlist, SpotifyTrack } from '../types';
import { getAuthHeaders } from './authApi';

export const MUSIC_BASE_URL =
  process.env.NEXT_PUBLIC_MUSIC_API_URL || 'http://localhost:3002/api/music';

interface BackendMusicItem {
  _id?: string;
  id?: string;
  title?: string;
  artistName?: string;
  artist?: string;
  artistId?: string;
  album?: string;
  genre?: string;
  duration?: number | string;
  audioUrl?: string;
  musicUrl?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  coverUrl?: string;
  storageProvider?: 'imagekit' | 's3';
  s3Key?: string;
  imageKitFileId?: string;
  createdAt?: string;
  updatedAt?: string;
  isLiked?: boolean;
}

interface BackendPlaylistItem {
  _id?: string;
  id?: string;
  name?: string;
  playListName?: string;
  description?: string;
  coverImage?: string;
  coverUrl?: string;
  userId?: string;
  musics?: BackendMusicItem[];
  songs?: BackendMusicItem[];
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function mapBackendMusicToTrack(item: BackendMusicItem): Track {
  return {
    id: item._id || item.id || '',
    _id: item._id || item.id || '',
    title: item.title || 'Untitled Track',
    artist: item.artistName || item.artist || 'Tunease Artist',
    artistName: item.artistName || item.artist || 'Tunease Artist',
    artistId: item.artistId || '',
    album: item.album || 'Single',
    genre: item.genre || 'Music',
    duration: typeof item.duration === 'number' ? item.duration : Number(item.duration) || 180,
    audioUrl: item.audioUrl || item.musicUrl || '',
    imageUrl:
      item.imageUrl ||
      item.coverImageUrl ||
      item.coverUrl ||
      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80',
    storageProvider: item.storageProvider,
    s3Key: item.s3Key,
    imageKitFileId: item.imageKitFileId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isLiked: Boolean(item.isLiked),
  };
}

export function mapBackendPlaylist(item: BackendPlaylistItem): Playlist {
  const rawList = Array.isArray(item.musics) ? item.musics : Array.isArray(item.songs) ? item.songs : [];
  return {
    id: item._id || item.id || '',
    _id: item._id || item.id || '',
    name: item.name || item.playListName || 'My Playlist',
    description: item.description || '',
    coverImage:
      item.coverImage ||
      item.coverUrl ||
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    userId: item.userId || '',
    musics: rawList.map(mapBackendMusicToTrack),
    isPublic: item.isPublic ?? true,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const musicApi = {
  async getAllMusic(): Promise<Track[]> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/all`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      const list: BackendMusicItem[] = Array.isArray(data.music) ? data.music : [];
      return list.map(mapBackendMusicToTrack);
    } catch (err) {
      console.warn('Failed to fetch music tracks:', err);
      return [];
    }
  },

  async getArtistMusic(artistId: string): Promise<Track[]> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/artist-music/${encodeURIComponent(artistId)}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      const list: BackendMusicItem[] = Array.isArray(data.music) ? data.music : [];
      return list.map(mapBackendMusicToTrack);
    } catch (err) {
      console.warn('Failed to fetch artist tracks:', err);
      return [];
    }
  },

  async uploadMusic(formData: FormData): Promise<{
    success: boolean;
    message?: string;
    track?: Track;
  }> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/upload-music`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.music) {
        return {
          success: false,
          message: data.message || 'Upload failed',
        };
      }
      return {
        success: true,
        message: data.message || 'Track uploaded successfully!',
        track: mapBackendMusicToTrack(data.music),
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Upload connection failed',
      };
    }
  },

  async deleteUploadedTrack(trackId: string): Promise<boolean> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/${trackId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.error('Delete track error:', err);
      return false;
    }
  },

  async getPlaylists(): Promise<Playlist[]> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/get-playlist`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      const list: BackendPlaylistItem[] = Array.isArray(data.playlists) ? data.playlists : [];
      return list.map(mapBackendPlaylist);
    } catch (err) {
      console.warn('Failed to fetch playlists:', err);
      return [];
    }
  },

  async getPlaylistById(playlistId: string): Promise<Playlist | null> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/playlist/${playlistId}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.playlist ? mapBackendPlaylist(data.playlist) : null;
    } catch (err) {
      console.error('Error getting playlist by ID:', err);
      return null;
    }
  },

  async createPlaylist(trackId: string, playListName: string): Promise<{ success: boolean; playlist?: Playlist; message?: string }> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/create-playlist/${trackId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ playListName }),
      });
      const data = await res.json();
      if (!res.ok || !data.playlist) {
        return { success: false, message: data.message || 'Could not create playlist' };
      }
      return { success: true, playlist: mapBackendPlaylist(data.playlist) };
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Server unreachable' };
    }
  },

  async deletePlaylist(playlistId: string): Promise<boolean> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/playlist/${playlistId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.error('Error deleting playlist:', err);
      return false;
    }
  },

  async deleteMusicFromPlaylist(playlistId: string, musicId: string): Promise<boolean> {
    try {
      const res = await fetch(`${MUSIC_BASE_URL}/playlist/${playlistId}/music/${musicId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.error('Error deleting music from playlist:', err);
      return false;
    }
  },

  async searchSpotifyTracks(query: string = 'popular music'): Promise<SpotifyTrack[]> {
    try {
      const params = new URLSearchParams({ q: query || 'popular music' });
      const res = await fetch(`${MUSIC_BASE_URL}/spotify/search?${params}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.tracks) ? data.tracks : [];
    } catch (err) {
      console.warn('Spotify search failed:', err);
      return [];
    }
  },
};
