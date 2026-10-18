import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { TrackList } from '../components/TrackList';
import { Heart, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LikedRoute() {
  const { queue, likedTrackIds, setActiveTab } = usePlayer();
  const navigate = useNavigate();

  const likedTracks = queue.filter((t) => likedTrackIds.has(t.id || t._id));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-end gap-6 bg-gradient-to-b from-[#60cfd8]/20 via-[#141416] to-transparent p-6 sm:p-8 rounded-3xl border border-[#29292D]">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-[#60cfd8] to-[#32aeb9] flex items-center justify-center shadow-2xl shadow-[#60cfd8]/20 shrink-0">
          <Heart className="w-14 h-14 text-[#050505] fill-[#050505]" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#60cfd8]">Playlist</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#F5F5F5] mt-1 font-['Space_Grotesk']">Liked Songs</h1>
          <p className="text-sm text-[#A1A1AA] mt-2 font-medium">
            {likedTracks.length} {likedTracks.length === 1 ? 'track' : 'tracks'} saved to your library
          </p>
        </div>
      </div>

      {likedTracks.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#141416]/40 rounded-3xl border border-[#29292D]">
          <Music className="w-12 h-12 text-[#29292D] mx-auto" />
          <h3 className="text-lg font-bold text-[#F5F5F5]">No liked songs yet</h3>
          <p className="text-sm text-[#A1A1AA] max-w-sm mx-auto">
            Tap the heart icon on any track to save it here for instant playback.
          </p>
          <button
            onClick={() => {
              setActiveTab('discover');
              navigate('/');
            }}
            className="px-5 py-2.5 rounded-full bg-[#60cfd8] hover:bg-[#4ebcc7] text-[#050505] text-xs font-bold shadow-md shadow-[#60cfd8]/20 hover:scale-105 transition-all cursor-pointer"
          >
            Explore Music
          </button>
        </div>
      ) : (
        <TrackList tracks={likedTracks} />
      )}
    </div>
  );
}

export default LikedRoute;

