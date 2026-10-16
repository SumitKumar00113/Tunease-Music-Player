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
      <div className="flex items-end gap-6 bg-gradient-to-b from-[#1ED760]/20 via-[#12251A] to-transparent p-6 sm:p-8 rounded-3xl border border-[#24392B]">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-[#1ED760] to-[#8BE9A7] flex items-center justify-center shadow-2xl shadow-[#1ED760]/20 shrink-0">
          <Heart className="w-14 h-14 text-[#07110C] fill-[#07110C]" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#1ED760]">Playlist</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#F5F7F5] mt-1 font-['Space_Grotesk']">Liked Songs</h1>
          <p className="text-sm text-[#A0B0A5] mt-2 font-medium">
            {likedTracks.length} {likedTracks.length === 1 ? 'track' : 'tracks'} saved to your library
          </p>
        </div>
      </div>

      {likedTracks.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#12251A]/40 rounded-3xl border border-[#24392B]">
          <Music className="w-12 h-12 text-[#24392B] mx-auto" />
          <h3 className="text-lg font-bold text-[#F5F7F5]">No liked songs yet</h3>
          <p className="text-sm text-[#A0B0A5] max-w-sm mx-auto">
            Tap the heart icon on any track to save it here for instant playback.
          </p>
          <button
            onClick={() => {
              setActiveTab('discover');
              navigate('/');
            }}
            className="px-5 py-2.5 rounded-full bg-[#1ED760] hover:bg-[#1fdf65] text-[#07110C] text-xs font-bold shadow-md shadow-[#1ED760]/20 hover:scale-105 transition-all cursor-pointer"
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

