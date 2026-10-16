/**
 * Route metadata and configuration for Tunease Music Player Frontend
 */
export const MUSIC_ROUTES = {
  DISCOVER: {
    path: '/',
    alias: '/discover',
    name: 'Discover',
    tab: 'discover',
    description: 'Hero spotlight, trending hits, recommended tracks, and top creators',
  },
  EXPLORE: {
    path: '/explore',
    name: 'Explore',
    tab: 'explore',
    description: 'Browse music categories, genre tags, and charts',
  },
  LIBRARY: {
    path: '/library',
    name: 'Your Library',
    tab: 'library',
    description: 'Your created playlists and saved musical collections',
  },
  LIKED: {
    path: '/liked',
    name: 'Liked Tracks',
    tab: 'liked',
    description: 'Curated collection of all tracks you have loved',
  },
  PLAYLIST: {
    path: '/playlist/:id',
    name: 'Playlist Details',
    tab: 'playlist',
    description: 'Specific playlist details, tracks, and duration',
  },
  ARTIST: {
    path: '/artist/:id',
    name: 'Artist Profile',
    tab: 'artist',
    description: 'Artist profile and published releases',
  },
  DASHBOARD: {
    path: '/dashboard',
    name: 'Creator Dashboard',
    tab: 'dashboard',
    description: 'Upload portal and track manager for certified creators',
  },
  USER_DASHBOARD:{
path:"/user_dashboard",
name:'User Dashboard',
tap:"user dashboard"
  }
};

export const ROUTES_LIST = Object.values(MUSIC_ROUTES);
