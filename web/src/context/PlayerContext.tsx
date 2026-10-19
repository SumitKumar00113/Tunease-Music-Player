'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Track, Playlist, User } from '../types';
import { musicApi } from '../services/musicApi';
import { authApi } from '../services/authApi';

export interface PlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isExpandedPlayer: boolean;
  queue: Track[];
  history: Track[];
  likedTrackIds: Set<string>;
  playlists: Playlist[];
  uploadedTracks: Track[];
  selectedArtist: string | null;
  selectedPlaylist: Playlist | null;
  isUploadModalOpen: boolean;
  isCreatePlaylistModalOpen: boolean;
  isAuthModalOpen: boolean;
  searchQuery: string;
  user: User | null;
  isLoading: boolean;

  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLikeTrack: (trackId: string) => void;
  setIsExpandedPlayer: (expanded: boolean) => void;
  setSelectedArtist: (artist: string | null) => void;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  setIsCreatePlaylistModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  addTrackToQueue: (track: Track) => void;
  addNewTrack: (track: Track) => void;
  deleteUploadedTrack: (trackId: string) => Promise<void>;
  addNewPlaylist: (playlistName: string, initialTrackId?: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, musicId: string) => Promise<void>;
  refreshLibrary: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isExpandedPlayer, setIsExpandedPlayer] = useState<boolean>(false);

  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);

  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Socket.io connection for realtime sync
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://tunease-music-service-latest.onrender.com';
    try {
      const socket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to Tunease Realtime Socket');
      });

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.warn('Socket connection note:', err);
    }
  }, []);

  const refreshLibrary = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authApi.getMe();
      if (currentUser) {
        setUser(currentUser);
      }

      const [tracks, userPlaylists] = await Promise.all([
        musicApi.getAllMusic(),
        musicApi.getPlaylists(),
      ]);

      if (tracks && tracks.length > 0) {
        setQueue(tracks);
        setCurrentTrack((prev) => prev || tracks[0]);
        setDuration(tracks[0].duration || 180);
        setUploadedTracks(tracks);
      } else {
        setQueue([]);
        setUploadedTracks([]);
      }

      if (userPlaylists && userPlaylists.length > 0) {
        setPlaylists(userPlaylists);
      } else {
        setPlaylists([]);
      }
    } catch (err) {
      console.warn('Backend library load note:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLibrary();
  }, [refreshLibrary]);

  // Audio HTML Element setup & listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack?.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      setCurrentTime(0);

      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Auto-play playback interrupted:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  // Handle Play / Pause state sync
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback request error:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume & Mute Sync
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (!track) return;
    if (newQueue) {
      setQueue(newQueue);
    }
    if (currentTrack) {
      setHistory((prev) => [currentTrack, ...prev.slice(0, 15)]);
    }
    setCurrentTrack(track);
    setIsPlaying(true);

    if (socketRef.current) {
      socketRef.current.emit('play', { musicId: track.id || track._id });
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack && queue.length > 0) {
      playTrack(queue[0]);
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    let nextIndex = 0;
    const currentIndex = queue.findIndex(
      (t) => t.id === currentTrack.id || t._id === currentTrack.id
    );

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else {
      nextIndex = 0;
    }

    playTrack(queue[nextIndex]);
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (history.length > 0) {
      const prev = history[0];
      setHistory((h) => h.slice(1));
      setCurrentTrack(prev);
      setIsPlaying(true);
      return;
    }

    const currentIndex = queue.findIndex(
      (t) => t.id === currentTrack.id || t._id === currentTrack.id
    );
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    playTrack(queue[prevIndex]);
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  const toggleLikeTrack = (trackId: string) => {
    setLikedTrackIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(trackId)) {
        updated.delete(trackId);
      } else {
        updated.add(trackId);
      }
      return updated;
    });
  };

  const addTrackToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  const addNewTrack = (track: Track) => {
    setUploadedTracks((prev) => [track, ...prev]);
    setQueue((prev) => [track, ...prev]);
    playTrack(track);
  };

  const deleteUploadedTrack = async (trackId: string) => {
    setUploadedTracks((prev) => prev.filter((t) => t.id !== trackId && t._id !== trackId));
    setQueue((prev) => prev.filter((t) => t.id !== trackId && t._id !== trackId));
    if (currentTrack && (currentTrack.id === trackId || currentTrack._id === trackId)) {
      setIsPlaying(false);
      setCurrentTrack(null);
    }
    await musicApi.deleteUploadedTrack(trackId);
  };

  const addNewPlaylist = async (playlistName: string, initialTrackId?: string) => {
    const res = await musicApi.createPlaylist(initialTrackId || 'default', playlistName);
    if (res.success && res.playlist) {
      setPlaylists((prev) => [res.playlist!, ...prev]);
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId && p._id !== playlistId));
    await musicApi.deletePlaylist(playlistId);
    if (selectedPlaylist && (selectedPlaylist.id === playlistId || selectedPlaylist._id === playlistId)) {
      setSelectedPlaylist(null);
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, musicId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId || p._id === playlistId) {
          return {
            ...p,
            musics: p.musics.filter((s) => s.id !== musicId && s._id !== musicId),
          };
        }
        return p;
      })
    );
    if (selectedPlaylist && (selectedPlaylist.id === playlistId || selectedPlaylist._id === playlistId)) {
      setSelectedPlaylist((prev) =>
        prev
          ? {
              ...prev,
              musics: prev.musics.filter((s) => s.id !== musicId && s._id !== musicId),
            }
          : null
      );
    }
    await musicApi.deleteMusicFromPlaylist(playlistId, musicId);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        isRepeat,
        isExpandedPlayer,
        queue,
        history,
        likedTrackIds,
        playlists,
        uploadedTracks,
        selectedArtist,
        selectedPlaylist,
        isUploadModalOpen,
        isCreatePlaylistModalOpen,
        isAuthModalOpen,
        searchQuery,
        user,
        isLoading,

        playTrack,
        togglePlayPause,
        seekTo,
        setVolume,
        toggleMute,
        nextTrack,
        prevTrack,
        toggleShuffle,
        toggleRepeat,
        toggleLikeTrack,
        setIsExpandedPlayer,
        setSelectedArtist,
        setSelectedPlaylist,
        setIsUploadModalOpen,
        setIsCreatePlaylistModalOpen,
        setIsAuthModalOpen,
        setSearchQuery,
        addTrackToQueue,
        addNewTrack,
        deleteUploadedTrack,
        addNewPlaylist,
        deletePlaylist,
        removeSongFromPlaylist,
        refreshLibrary,
        setUser,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextValue => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;
