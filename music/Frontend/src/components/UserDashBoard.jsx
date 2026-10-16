import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, Compass, Disc3, ExternalLink, Flame, Headphones, Heart, Home, Library, Music, Music2, Play,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/musicApi';

const getName = (user) => {
  const fullName = user?.fullName;
  if (typeof fullName === 'string') return fullName.trim();
  return [fullName?.firstName, fullName?.lastName].filter(Boolean).join(' ');
};

const formatTime = (duration) => {
  const seconds = Number(duration);
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

const TrackRows = ({ tracks, queue, currentTrack, isPlaying, playTrack }) => tracks.length ? (
  <div className="ud-track-list">
    {tracks.map((track, index) => {
      const id = track.id || track._id || `${track.title}-${index}`;
      const isActive = currentTrack && (currentTrack.id === id || currentTrack._id === id);
      return (
        <button key={id} className={`ud-track-row${isActive ? ' is-playing' : ''}`} type="button" onClick={() => playTrack(track, queue)}>
          <span className="ud-track-number">{isActive && isPlaying ? '♫' : String(index + 1).padStart(2, '0')}</span>
          <span className="ud-track-cover">{track.coverUrl ? <img src={track.coverUrl} alt="" /> : <Music2 size={16} />}</span>
          <span className="ud-track-meta"><strong>{track.title}</strong><small>{track.artistName}</small></span>
          <span className="ud-track-duration">{formatTime(track.duration)}</span>
          <Play className="ud-row-play" size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        </button>
      );
    })}
  </div>
) : null;

export const UserDashBoard = () => {
  const navigate = useNavigate();
  const {
    user, queue, history, currentTrack, isPlaying, playlists, likedTrackIds, isLoading,
    searchQuery, playTrack, setSelectedArtist, setSelectedPlaylist,
  } = usePlayer();
  const [spotifyTracks, setSpotifyTracks] = useState([]);
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [spotifyError, setSpotifyError] = useState('');

  const displayName = getName(user);
  const firstName = displayName.split(' ')[0] || 'Listener';
  const featuredTrack = currentTrack || queue[0];
  const spotifyQuery = searchQuery.trim() || 'popular music';

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSpotifyLoading(true);
      setSpotifyError('');
      try {
        const tracks = await musicApi.searchSpotifyTracks(spotifyQuery);
        if (!cancelled) setSpotifyTracks(tracks);
      } catch (error) {
        if (!cancelled) {
          setSpotifyTracks([]);
          setSpotifyError(error.message || 'Spotify search is unavailable.');
        }
      } finally {
        if (!cancelled) setSpotifyLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [spotifyQuery]);
  const searchedTracks = searchQuery
    ? queue.filter((track) => [track.title, track.artistName, track.genre]
      .some((value) => value?.toLowerCase().includes(searchQuery.toLowerCase())))
    : null;
  const allArtists = useMemo(() => {
    const artists = new Map();
    queue.forEach((track) => {
      const id = track.artistId;
      if (!id) return;
      const artist = artists.get(id) || { id, name: track.artistName, artwork: track.coverUrl, genres: new Set(), tracks: 0 };
      if (!artist.artwork && track.coverUrl) artist.artwork = track.coverUrl;
      if (track.genre) artist.genres.add(track.genre);
      artist.tracks += 1;
      artists.set(id, artist);
    });
    return [...artists.values()]
      .map((artist) => ({ ...artist, genres: [...artist.genres] }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [queue]);

  const visibleArtists = searchQuery
    ? allArtists.filter((artist) => `${artist.name} ${artist.genres.join(' ')}`.toLowerCase().includes(searchQuery.toLowerCase()))
    : allArtists;
  const trendingTracks = useMemo(() => queue
    .filter((track) => Number(track.playCount) > 0)
    .sort((left, right) => Number(right.playCount) - Number(left.playCount))
    .slice(0, 5), [queue]);

  const openArtist = (artist) => {
    setSelectedArtist({ id: artist.id, name: artist.name });
    navigate(`/artist/${artist.id}`);
  };

  const profileName = displayName || user?.email || 'Music listener';
  const avatarInitial = profileName.charAt(0).toUpperCase();

  return (
    <main className="user-dashboard">
      <nav className="ud-mobile-nav" aria-label="Tunease navigation">
        <button type="button" className="ud-mobile-brand" onClick={() => navigate('/')}><span><Music size={17} /></span> TUNE<span>ASE</span></button>
        <div>
          <button type="button" onClick={() => navigate('/')}><Home size={15} /> Home</button>
          <button type="button" onClick={() => navigate('/explore')}><Compass size={15} /> Explore</button>
          <button type="button" onClick={() => navigate('/library')}><Library size={15} /> Library</button>
        </div>
      </nav>
      <div className="ud-greeting-row">
        <div>
          <p className="ud-overline">Your space</p>
          <h1>Good to see you, {firstName}</h1>
          <p className="ud-subtitle">Pick up where you left off or find something to play.</p>
        </div>
        <div className="ud-profile-chip">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="" />
          ) : (
            <span aria-hidden="true">{avatarInitial}</span>
          )}
          <div>
            <strong>{profileName}</strong>
            {user?.role && <small>{user.role === 'artist' ? 'Artist account' : user.role === 'admin' ? 'Admin account' : 'Listener account'}</small>}
          </div>
        </div>
      </div>

      <div className="ud-layout">
        <div className="ud-main-column">
          <section className="ud-feature" aria-label="Continue listening">
            {featuredTrack?.coverUrl && <img className="ud-feature-bg" src={featuredTrack.coverUrl} alt="" />}
            <div className="ud-feature-overlay" />
            <div className="ud-feature-copy">
              <span className="ud-feature-label"><Headphones size={14} /> {currentTrack ? 'Continue listening' : 'Tunease selection'}</span>
              {featuredTrack ? (
                <>
                  <h2>{featuredTrack.title}</h2>
                  <p>{featuredTrack.artistName}</p>
                  <button className="ud-play-button" type="button" onClick={() => playTrack(featuredTrack, queue)}>
                    <Play size={17} fill="currentColor" strokeWidth={0} />
                    {currentTrack && isPlaying ? 'Play again' : 'Play track'}
                  </button>
                </>
              ) : (
                <>
                  <h2>Your next favorite is waiting.</h2>
                  <p>Explore the music available in Tunease.</p>
                  <button className="ud-play-button" type="button" onClick={() => navigate('/explore')}>
                    Explore music <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
            <div className="ud-feature-art" aria-hidden="true">
              {featuredTrack?.coverUrl ? <img src={featuredTrack.coverUrl} alt="" /> : <Music2 size={54} />}
            </div>
          </section>

          <section className="ud-section" aria-labelledby="ud-spotify-title">
            <div className="ud-section-heading">
              <div>
                <p className="ud-overline">Spotify search · {spotifyQuery}</p>
                <h2 id="ud-spotify-title">Discover songs</h2>
              </div>
              <a className="ud-text-link" href="https://open.spotify.com/" target="_blank" rel="noreferrer">
                Spotify <ExternalLink size={14} />
              </a>
            </div>
            {spotifyLoading ? (
              <div className="ud-empty-inline" role="status">Searching Spotify…</div>
            ) : spotifyError ? (
              <div className="ud-empty-inline ud-spotify-error" role="status">{spotifyError}</div>
            ) : spotifyTracks.length ? (
              <div className="ud-spotify-grid">
                {spotifyTracks.map((track) => (
                  <article className="ud-spotify-card" key={track.id}>
                    <a className="ud-spotify-art" href={track.spotifyUrl} target="_blank" rel="noreferrer" aria-label={`Open ${track.title} on Spotify`}>
                      {track.cover ? <img src={track.cover} alt="" /> : <Music2 size={24} aria-hidden="true" />}
                      <span><ExternalLink size={15} /></span>
                    </a>
                    <div className="ud-spotify-meta">
                      <strong title={track.title}>{track.title}</strong>
                      <small title={track.artist}>{track.artist}</small>
                    </div>
                    <a className="ud-spotify-link" href={track.spotifyUrl} target="_blank" rel="noreferrer">
                      Open in Spotify <ExternalLink size={13} />
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div className="ud-empty-inline"><Music2 size={18} /><span>No Spotify tracks matched this search.</span></div>
            )}
          </section>

          <section className="ud-section" aria-labelledby="ud-trending-title">
            <div className="ud-section-heading">
              <div>
                <p className="ud-overline">Most played in Tunease</p>
                <h2 id="ud-trending-title">Trending now</h2>
              </div>
              <Flame size={19} aria-hidden="true" />
            </div>
            {isLoading && !queue.length ? (
              <div className="ud-empty-inline" role="status">Loading music…</div>
            ) : trendingTracks.length ? (
              <TrackRows tracks={trendingTracks} queue={queue} currentTrack={currentTrack} isPlaying={isPlaying} playTrack={playTrack} />
            ) : (
              <div className="ud-empty-inline"><Flame size={18} /><span>Trending tracks will appear when play counts are available.</span></div>
            )}
          </section>

          <section className="ud-section" aria-labelledby="ud-artists-title">
            <div className="ud-section-heading">
              <div>
                <p className="ud-overline">Browse the catalog</p>
                <h2 id="ud-artists-title">All artists</h2>
              </div>
              <Music2 size={19} aria-hidden="true" />
            </div>
            {isLoading && !queue.length ? (
              <div className="ud-empty-inline" role="status">Loading artists…</div>
            ) : visibleArtists.length ? (
              <div className="ud-artist-grid">
                {visibleArtists.map((artist) => (
                  <button key={artist.id} className="ud-artist-card" type="button" onClick={() => openArtist(artist)}>
                    <span className="ud-artist-image">{artist.artwork ? <img src={artist.artwork} alt="" /> : <Music2 size={24} aria-hidden="true" />}</span>
                    <span className="ud-artist-name">{artist.name}</span>
                    <span className="ud-artist-caption">{artist.tracks} {artist.tracks === 1 ? 'track' : 'tracks'}{artist.genres[0] ? ` · ${artist.genres[0]}` : ''}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="ud-empty-inline"><Music2 size={19} /><span>{searchQuery ? 'No artists match your search.' : 'Artists will appear when music is available.'}</span></div>
            )}
          </section>

          <section className="ud-section ud-recent-section" aria-labelledby="ud-all-music-title">
            <div className="ud-section-heading">
              <div>
                <p className="ud-overline">Published Tunease catalog</p>
                <h2 id="ud-all-music-title">{searchQuery ? 'Search results' : 'All music'}</h2>
              </div>
              <span className="ud-catalog-count">{searchedTracks ? searchedTracks.length : queue.length} tracks</span>
            </div>
            {isLoading && !queue.length ? (
              <div className="ud-empty-inline" role="status">Loading music…</div>
            ) : (searchedTracks || queue).length ? (
              <TrackRows tracks={searchedTracks || queue} queue={queue} currentTrack={currentTrack} isPlaying={isPlaying} playTrack={playTrack} />
            ) : (
              <div className="ud-empty-inline"><Disc3 size={19} /><span>{searchQuery ? 'No music matches your search.' : 'No published music is available yet.'}</span></div>
            )}
          </section>
        </div>

        <aside className="ud-side-column">
          <section className="ud-side-card" aria-labelledby="ud-library-title">
            <div className="ud-side-card-heading">
              <div className="ud-side-icon"><Disc3 size={17} /></div>
              <div><p className="ud-overline">Your collection</p><h2 id="ud-library-title">Your library</h2></div>
            </div>
            <button type="button" className="ud-library-link" onClick={() => navigate('/liked')}>
              <span><Heart size={16} /> Liked songs</span>
              <span className="ud-count">{likedTrackIds.size}</span>
            </button>
            <button type="button" className="ud-library-link" onClick={() => navigate('/library')}>
              <span><Music2 size={16} /> Playlists</span>
              <span className="ud-count">{playlists.length}</span>
            </button>
            {playlists.length > 0 && (
              <div className="ud-playlist-list">
                {playlists.slice(0, 3).map((playlist) => (
                  <button key={playlist.id || playlist._id} type="button" onClick={() => {
                    setSelectedPlaylist(playlist);
                    navigate(`/playlist/${playlist.id || playlist._id}`);
                  }}>
                    {playlist.coverUrl ? <img src={playlist.coverUrl} alt="" /> : <span className="ud-playlist-placeholder"><Music2 size={14} /></span>}
                    <span>{playlist.name || playlist.playListName}</span>
                  </button>
                ))}
              </div>
            )}
            {playlists.length === 0 && <p className="ud-side-note">Your playlists will be ready here when you make one.</p>}
            <button type="button" className="ud-side-footer" onClick={() => navigate('/library')}>
              Open library <ArrowRight size={15} />
            </button>
          </section>

          {history.length > 0 && (
            <section className="ud-side-card" aria-labelledby="ud-history-title">
              <div className="ud-side-card-heading">
                <div className="ud-side-icon"><Headphones size={17} /></div>
                <div><p className="ud-overline">Your session</p><h2 id="ud-history-title">Recently played</h2></div>
              </div>
              <TrackRows tracks={history.slice(0, 3)} queue={queue} currentTrack={currentTrack} isPlaying={isPlaying} playTrack={playTrack} />
            </section>
          )}
        </aside>
      </div>
    </main>
  );
};

export default UserDashBoard;
