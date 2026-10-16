/**
 * Tunease Music Player - Data Models & Types in Modern JavaScript (JSDoc)
 */

/**
 * @typedef {Object} Track
 * @property {string} id
 * @property {string} [_id]
 * @property {string} title
 * @property {string} artistName
 * @property {string} [artistId]
 * @property {string} [album]
 * @property {string} [genre]
 * @property {string} [description]
 * @property {string} coverUrl
 * @property {string} audioUrl
 * @property {number} duration
 * @property {string} [releaseDate]
 * @property {number} playCount
 * @property {boolean} [isExplicit]
 * @property {boolean} [isPublished]
 * @property {boolean} [isLiked]
 * @property {string[]} [lyrics]
 */

/**
 * @typedef {Object} Playlist
 * @property {string} id
 * @property {string} [_id]
 * @property {string} name
 * @property {string} [playListName]
 * @property {string} [description]
 * @property {string} artistName
 * @property {string} [artistId]
 * @property {string} coverUrl
 * @property {Track[]} songs
 * @property {boolean} isPublic
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} Artist
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} [banner]
 * @property {string} bio
 * @property {number} followers
 * @property {number} monthlyListeners
 * @property {boolean} verified
 * @property {Track[]} topTracks
 * @property {Array<{id: string, title: string, coverUrl: string, year: number}>} [albums]
 */

export const ACTIVE_TABS = {
  HOME: 'home',
  EXPLORE: 'explore',
  LIBRARY: 'library',
  PLAYLISTS: 'playlists',
  LIKED: 'liked',
  ARTIST_VIEW: 'artist-view',
  PLAYLIST_VIEW: 'playlist-view',
  UPLOAD: 'upload',
  DASHBOARD: 'dashboard',
};
