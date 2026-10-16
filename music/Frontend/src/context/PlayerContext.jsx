import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { musicApi } from '../services/musicApi';

const PlayerContext = createContext(undefined);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const socketRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isExpandedPlayer, setIsExpandedPlayer] = useState(false);

  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [likedTrackIds, setLikedTrackIds] = useState(new Set());
  const [playlists, setPlaylists] = useState([]);
  const [uploadedTracks, setUploadedTracks] = useState([]);

  const [activeTab, setActiveTab] = useState('home');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial music library, playlists, and user session from live backend
  const refreshLibrary = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch user auth session
      const currentUser = await musicApi.getMe();
      if (currentUser) {
        setUser(currentUser);
      }

      // 2. Fetch tracks and playlists from backend
      const [tracks, userPlaylists] = await Promise.all([
        musicApi.getAllMusic(),
        musicApi.getPlaylists()
      ]);

      if (tracks && tracks.length > 0) {
        setQueue(tracks);
        setCurrentTrack(prev => prev || tracks[0]);
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
      console.warn('Backend data load note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLibrary();
  }, []);

  // Audio HTML Element setup & listeners
  useEffect(() => {
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
      handleTrackEnded();
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
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      setCurrentTime(0);

      if (isPlaying) {
        audioRef.current.play().catch(err => {
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
      audioRef.current.play().catch(err => {
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

  const handleTrackEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextTrack();
    }
  };

  const playTrack = (track, newQueue) => {
    if (!track) return;
    if (newQueue) {
      setQueue(newQueue);
    }
    if (currentTrack) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 15)]);
    }
    setCurrentTrack(track);
    setIsPlaying(true);

    // Emit live play event if socket is connected
    if (socketRef.current) {
      socketRef.current.emit("play", { musicId: track.id || track._id });
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack && queue.length > 0) {
      playTrack(queue[0]);
      return;
    }
    setIsPlaying(prev => !prev);
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (val) => {
    setVolumeState(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    let nextIndex = 0;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id || t._id === currentTrack.id);

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else {
      nextIndex = 0; // Loop around to first song
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
      setHistory(h => h.slice(1));
      setCurrentTrack(prev);
      setIsPlaying(true);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id || t._id === currentTrack.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    playTrack(queue[prevIndex]);
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);
  const toggleRepeat = () => setIsRepeat(prev => !prev);

  const toggleLikeTrack = (trackId) => {
    setLikedTrackIds(prev => {
      const updated = new Set(prev);
      if (updated.has(trackId)) {
        updated.delete(trackId);
      } else {
        updated.add(trackId);
      }
      return updated;
    });
  };

  const addTrackToQueue = (track) => {
    setQueue(prev => [...prev, track]);
  };

  const addNewTrack = (track) => {
    setUploadedTracks(prev => [track, ...prev]);
    setQueue(prev => [track, ...prev]);
    playTrack(track);
  };

  const deleteUploadedTrack = async (trackId) => {
    setUploadedTracks(prev => prev.filter(t => t.id !== trackId && t._id !== trackId));
    setQueue(prev => prev.filter(t => t.id !== trackId && t._id !== trackId));
    if (currentTrack && (currentTrack.id === trackId || currentTrack._id === trackId)) {
      setIsPlaying(false);
      setCurrentTrack(null);
    }
    await musicApi.deleteUploadedTrack(trackId);
  };

  const addNewPlaylist = async (playlist) => {
    setPlaylists(prev => [playlist, ...prev]);
    const res = await musicApi.createPlaylist({
      playListName: playlist.name || playlist.playListName,
      songs: playlist.songs ? playlist.songs.map(s => s.id || s._id) : [],
      isPublic: playlist.isPublic || false,
    });
    if (res.success && res.playlist) {
      setPlaylists(prev => [res.playlist, ...prev.filter(p => p.id !== playlist.id && p._id !== playlist.id)]);
      if (selectedPlaylist && (selectedPlaylist.id === playlist.id || selectedPlaylist._id === playlist.id)) {
        setSelectedPlaylist(res.playlist);
      }
    }
  };

  const deletePlaylist = async (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId && p._id !== playlistId));
    await musicApi.deletePlaylist(playlistId);
    if (selectedPlaylist && (selectedPlaylist.id === playlistId || selectedPlaylist._id === playlistId)) {
      setSelectedPlaylist(null);
      setActiveTab('library');
    }
  };

  const removeSongFromPlaylist = async (playlistId, musicId) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId || p._id === playlistId) {
        const updatedSongs = p.songs.filter(s => s.id !== musicId && s._id !== musicId);
        return { ...p, songs: updatedSongs };
      }
      return p;
    }));
    if (selectedPlaylist && (selectedPlaylist.id === playlistId || selectedPlaylist._id === playlistId)) {
      setSelectedPlaylist(prev => ({
        ...prev,
        songs: prev.songs.filter(s => s.id !== musicId && s._id !== musicId)
      }));
    }
    await musicApi.deleteMusicFromPlaylist(playlistId, musicId);
  };

  const loginUser = async (email, password) => {
    const res = await musicApi.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      await refreshLibrary();
    }
    return res;
  };

  const registerUser = async (payload) => {
    const res = await musicApi.register(payload);
    if (res.success && res.user) {
      setUser(res.user);
      await refreshLibrary();
    }
    return res;
  };

  const updateUserProfile = async (payload) => {
    const res = await musicApi.updateProfile(payload);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logoutUser = async () => {
    await musicApi.logout();
    setUser(null);
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
        activeTab,
        selectedArtist,
        selectedPlaylist,
        isUploadModalOpen,
        isCreatePlaylistModalOpen,
        isAuthModalOpen,
        searchQuery,
        uploadedTracks,
        user,
        isLoading,
        socketRef,

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
        setActiveTab,
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
        loginUser,
        registerUser,
        updateUserProfile,
        logoutUser,
        refreshLibrary
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;
