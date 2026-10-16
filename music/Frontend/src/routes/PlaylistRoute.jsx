import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { PlaylistView } from '../components/PlaylistView';

export function PlaylistRoute() {
  const { id } = useParams();
  const { playlists, selectedPlaylist, setSelectedPlaylist } = usePlayer();

  useEffect(() => {
    if (id && playlists && playlists.length > 0) {
      const found = playlists.find((p) => (p._id || p.id) === id);
      if (found) {
        setSelectedPlaylist(found);
      }
    }
  }, [id, playlists]);

  return (
    <div className="animate-in fade-in duration-300">
      <PlaylistView />
    </div>
  );
}
