export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  url: string;
  coverUrl: string;
  duration: number;
};

export type Playlist = {
  id: string;
  name: string;
  owner: string;
  coverUrl: string;
  tracks: Track[];
};

export type SearchResults = { tracks: Track[]; playlists: Playlist[] };
