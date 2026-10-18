export interface UserFullName {
  firstName?: string;
  lastName?: string;
}

export interface User {
  _id?: string;
  id?: string;
  fullName: string | UserFullName;
  email: string;
  role: 'user' | 'artist';
  mobileNo?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  avatar?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Track {
  _id: string;
  id?: string;
  title: string;
  artist: string;
  artistId?: string;
  artistName?: string;
  album?: string;
  genre?: string;
  duration?: number;
  audioUrl?: string;
  imageUrl?: string;
  storageProvider?: 'imagekit' | 's3';
  s3Key?: string;
  imageKitFileId?: string;
  createdAt?: string;
  updatedAt?: string;
  isLiked?: boolean;
}

export interface Playlist {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  coverImage?: string;
  userId: string;
  musics: Track[];
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message?: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl?: string;
  durationMs?: number;
  previewUrl?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  isExpanded: boolean;
  likedTracks: Set<string>;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTo: (time: number) => void;
  setVolumeLevel: (level: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (trackId: string) => void;
  addToQueue: (track: Track) => void;
  setIsExpanded: (expanded: boolean) => void;
}
