import React, { useEffect, useState } from 'react';
import { ArrowLeft, Disc3, Music2, Play, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { TrackList } from './TrackList';
import { musicApi } from '../services/musicApi';

export const ArtistView = ({ artistId }) => {
  const navigate = useNavigate();
  const { selectedArtist, setSelectedArtist, playTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError('');
    musicApi.getArtistMusic(artistId)
      .then((artistTracks) => {
        if (!cancelled) setTracks(artistTracks.filter((track) => track.isPublished));
      })
      .catch(() => {
        if (!cancelled) setError('We couldn’t load this artist’s releases. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [artistId, retryCount]);

  const artistTracks = tracks;
  const artistName = artistTracks[0]?.artistName || (selectedArtist?.id === artistId ? selectedArtist.name : '');
  const genres = [...new Set(artistTracks.map((track) => track.genre).filter(Boolean))];
  const artwork = artistTracks.find((track) => track.coverUrl)?.coverUrl;

  useEffect(() => {
    if (!artistName) return;
    setSelectedArtist((current) => current?.id === artistId && current.name === artistName
      ? current
      : { id: artistId, name: artistName });
  }, [artistId, artistName, setSelectedArtist]);

  return (
    <main className="artist-page animate-in fade-in duration-300">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="artist-back"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back
      </button>

      <section className="artist-hero" aria-labelledby="artist-title">
        {artwork && <img className="artist-hero-art" src={artwork} alt="" aria-hidden="true" />}
        <div className="artist-hero-shade" />
        <div className="artist-hero-content">
          <div className="artist-artwork-wrap">
            {artwork ? (
              <img className="artist-artwork" src={artwork} alt={`${artistName || 'Artist'} release artwork`} />
            ) : (
              <div className="artist-artwork-empty" aria-hidden="true"><Music2 size={40} /></div>
            )}
          </div>
          <div className="artist-copy">
            <p className="artist-eyebrow">Artist</p>
            <h1 id="artist-title">{artistName || (isLoading ? 'Loading artist' : 'Artist')}</h1>
            {genres.length > 0 && (
              <div className="artist-genres" aria-label="Genres">
                {genres.map((genre) => <span key={genre}>{genre}</span>)}
              </div>
            )}
            {artistTracks.length > 0 && (
              <p className="artist-release-count">{artistTracks.length} {artistTracks.length === 1 ? 'release' : 'releases'}</p>
            )}
            <button
              type="button"
              onClick={() => artistTracks.length && playTrack(artistTracks[0], artistTracks)}
              disabled={!artistTracks.length}
              className="artist-play-button"
            >
              <Play size={17} fill="currentColor" strokeWidth={0} />
              Play
            </button>
          </div>
        </div>
      </section>

      <section className="artist-releases" aria-labelledby="artist-releases-title">
        <div className="artist-section-heading">
          <div>
            <p className="artist-eyebrow">Discography</p>
            <h2 id="artist-releases-title">Releases</h2>
          </div>
          <Disc3 aria-hidden="true" size={21} />
        </div>
        {isLoading ? (
          <div className="artist-state" role="status">Loading releases…</div>
        ) : error ? (
          <div className="artist-state artist-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)} aria-label="Retry loading releases"><RotateCw size={16} /></button>
          </div>
        ) : artistTracks.length ? (
          <TrackList tracks={artistTracks} artistPage />
        ) : (
          <div className="artist-state">No published releases are available for this artist yet.</div>
        )}
      </section>
    </main>
  );
};

export default ArtistView;
