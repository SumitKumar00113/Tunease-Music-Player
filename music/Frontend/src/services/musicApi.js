/**
 * Tunease Music API Integration Layer
 * 
 * Connected to live backend microservices:
 * - Auth Backend: https://tunease-auth-service-latest.onrender.com/api/auth
 * - Music Backend: https://tunease-music-service-latest.onrender.com/api/music
 */

import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_MUSIC_API_URL || 'https://tunease-music-service-latest.onrender.com';
export const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'https://tunease-auth-service-latest.onrender.com/api/auth';
export const USE_BACKEND_API = true; // Enabled live backend integration

export function getAuthHeaders() {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function mapBackendMusicToTrack(item) {
  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    title: item.title || 'Untitled Track',
    artistName: item.artistName || 'Tunease Artist',
    artistId: item.artistId || '',
    album: item.albumName || (typeof item.album === 'string' ? item.album : 'Single'),
    featuredArtists: item.featuredArtists || '',
    genre: item.genre || 'Electronic',
    description: item.description || '',
    coverUrl: item.coverImageUrl || item.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80',
    audioUrl: item.musicUrl || item.audioUrl || '',
    duration: Number(item.duration) || 180,
    releaseDate: item.releaseDate ? new Date(item.releaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    playCount: item.playCount || 0,
    isExplicit: item.isExplicit || false,
    isPublished: item.isPublished !== undefined ? item.isPublished : true,
    isLiked: false,
  };
}

export function mapBackendPlaylist(item) {
  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.playListName || item.name || 'My Playlist',
    playListName: item.playListName || item.name || 'My Playlist',
    description: item.description || 'Custom Tunease Playlist',
    artistName: item.artistName || 'You',
    coverUrl: item.coverUrl || (item.songs?.[0]?.coverImageUrl) || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    songs: Array.isArray(item.songs) ? item.songs.map(mapBackendMusicToTrack) : [],
    isPublic: item.isPublic || false,
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export const musicApi = {
  // ==================== AUTH SERVICE ====================

  async getMe() {
    try {
      const handoffToken = new URLSearchParams(window.location.hash.slice(1)).get('access_token');
      if (handoffToken) {
        localStorage.setItem('accessToken', handoffToken);
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
      const response = await fetch(`${AUTH_BASE_URL}/me`, {
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.user || null;
      }
      return null;
    } catch (err) {
      console.warn('Auth backend unreachable:', err);
      return null;
    }
  },

  async login(email, password) {
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data?.user) {
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login error',
      };
    }
  },

  async register(payload) {
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/register`,
        payload,
        { withCredentials: true }
      );
      if (response.data?.user) {
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data?.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Registration error',
      };
    }
  },

  async updateProfile(payload) {
    try {
      const response = await axios.put(`${AUTH_BASE_URL}/profile`, payload, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Profile update failed',
      };
    }
  },

  async logout() {
    try {
      await fetch(`${AUTH_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
    }
  },

  // ==================== MUSIC TRACKS ====================

  /**
   * Upload music track with audio file & cover image (Matches POST /api/music/upload-music)
   */
  async uploadMusic(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/music/upload-music`, formData, {
        withCredentials: true,
        headers: {
          ...getAuthHeaders(),
        },
      });
      const data = response.data;
      const uploadedMusic = data.music;

      if (!uploadedMusic) {
        return {
          success: false,
          message: data.message || data.error || 'Music upload failed',
        };
      }

      return {
        success: true,
        message: data.message || 'Upload successful',
        track: mapBackendMusicToTrack(uploadedMusic),
      };
    } catch (err) {
      console.error('Backend upload error:', err);
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message || err.response?.data?.error || 'Failed to connect to music backend server',
        };
      }
      return {
        success: false,
        message: 'Failed to connect to music backend server',
      };
    }
  },

  /**
   * Fetch all published music tracks (Matches GET /api/music/all)
   */
  async getAllMusic() {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/music/all`, {
          credentials: 'include',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          const backendTracks = (data.music || []).map(mapBackendMusicToTrack);
          return backendTracks;
        }
      } catch (err) {
        console.warn('Backend server unreachable or no music in DB yet:', err);
      }
    }

    return [];
  },

  async searchSpotifyTracks(query = 'popular music') {
    const params = new URLSearchParams({ q: query || 'popular music' });
    const response = await fetch(`${API_BASE_URL}/api/music/spotify/search?${params}`, {
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Could not load Spotify tracks.');
    return data.tracks || [];
  },

  /**
   * Fetch tracks for a specific artist (Matches GET /api/music/artist-music/:id)
   */
  async getArtistMusic(artistId) {
    if (USE_BACKEND_API && artistId) {
      const response = await fetch(`${API_BASE_URL}/api/music/artist-music/${encodeURIComponent(artistId)}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Artist releases request failed');
      const data = await response.json();
      return (data.music || []).map((item) => ({
        ...mapBackendMusicToTrack(item),
        coverUrl: item.coverImageUrl || item.coverUrl || '',
        isPublished: item.isPublished === true,
      }));
    }

    return [];
  },

  /**
   * Delete uploaded music track (Matches DELETE /api/music/:id)
   */
  async deleteUploadedTrack(trackId) {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/music/${trackId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: getAuthHeaders(),
        });
        return response.ok;
      } catch (err) {
        console.error('Error deleting track:', err);
        return false;
      }
    }
    return true;
  },

  // ==================== PLAYLISTS ====================

  /**
   * Create a new playlist or add track to playlist (Matches POST /api/music/create-playlist/:id)
   */
  async createPlaylist(playlistData) {
    if (USE_BACKEND_API) {
      try {
        const musicId = playlistData.songs?.[0] || 'default';
        const response = await fetch(`${API_BASE_URL}/api/music/create-playlist/${musicId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ playListName: playlistData.playListName }),
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok && data.playlist) {
          return { success: true, playlist: mapBackendPlaylist(data.playlist) };
        } else {
          return { success: false, message: data.message || 'Could not create playlist' };
        }
      } catch (err) {
        console.error('Error creating playlist:', err);
        return { success: false, message: 'Music server unreachable' };
      }
    }

    return { success: false, message: 'Backend integration required' };
  },

  /**
   * Get user playlists (Matches GET /api/music/get-playlist)
   */
  async getPlaylists() {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/music/get-playlist`, {
          credentials: 'include',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          const playlists = (data.playlists || []).map(mapBackendPlaylist);
          return playlists;
        }
      } catch (err) {
        console.warn('Error fetching playlists from backend:', err);
      }
    }

    return [];
  },

  /**
   * Delete playlist (Matches DELETE /api/music/playlist/:id)
   */
  async deletePlaylist(playlistId) {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/music/playlist/${playlistId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: getAuthHeaders(),
        });
        return response.ok;
      } catch (err) {
        console.error('Error deleting playlist:', err);
        return false;
      }
    }
    return true;
  },

  /**
   * Delete track from playlist (Matches DELETE /api/music/playlist/:playlistId/music/:musicId)
   */
  async deleteMusicFromPlaylist(playlistId, musicId) {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/music/playlist/${playlistId}/music/${musicId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: getAuthHeaders(),
        });
        return response.ok;
      } catch (err) {
        console.error('Error deleting music from playlist:', err);
        return false;
      }
    }
    return true;
  },

  /**
   * Get playlist songs (Matches GET /api/music/playlist/:playlistId/music)
   */
  async getMusicFromPlaylist(playlistId) {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/music/playlist/${playlistId}/music`, {
          credentials: 'include',
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          return data.playlist ? mapBackendPlaylist(data.playlist) : null;
        }
      } catch (err) {
        console.error('Error getting music from playlist:', err);
      }
    }
    return null;
  }
};
