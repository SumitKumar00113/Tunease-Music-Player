import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { ArtistView } from '../components/ArtistView';

export function ArtistRoute() {
  const { id } = useParams();
  const { queue, setSelectedArtist } = usePlayer();

  useEffect(() => {
    const matchingTracks = queue.filter((track) => String(track.artistId) === id);
    if (!matchingTracks.length) return;
    setSelectedArtist({
      id,
      name: matchingTracks[0].artistName,
    });
  }, [id, queue, setSelectedArtist]);

  return <ArtistView artistId={id} />;
}
