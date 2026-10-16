import React, { useState } from 'react';
import { X, Upload, Music, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/musicApi';

export const UploadMusicModal = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addNewTrack, user, setIsAuthModalOpen } = usePlayer();

  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState(
    user?.fullName
      ? (typeof user.fullName === 'string'
          ? user.fullName
          : `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim())
      : ''
  );
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Electronic');
  const [description, setDescription] = useState('');
  const [isExplicit, setIsExplicit] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isUploadModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !audioFile || !coverFile) {
      setErrorMessage('A title, audio track, and cover image are required.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const duration = await new Promise((resolve) => {
        const audio = new Audio();
        const objectUrl = URL.createObjectURL(audioFile);
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            resolve(Math.round(audio.duration));
          } else {
            resolve(180);
          }
        };
        audio.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(180);
        };
        audio.src = objectUrl;
      });

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('artistName', (artistName || 'Tunease Artist').trim());
      formData.append('album', (album || 'Single').trim());
      formData.append('genre', genre || 'Pop');
      formData.append('description', description);
      formData.append('isExplicit', String(isExplicit));
      formData.append('duration', String(duration));
      formData.append('music', audioFile);
      formData.append('coverImage', coverFile);

      const res = await musicApi.uploadMusic(formData);
      if (res.success && res.track) {
        setSuccessMessage('Track uploaded & published successfully to Tunease!');
        addNewTrack(res.track);
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setTitle('');
          setAudioFile(null);
          setCoverFile(null);
          setSuccessMessage('');
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Upload failed. Please check artist credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not upload the track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAuthError = errorMessage && (
    errorMessage.toLowerCase().includes('token') ||
    errorMessage.toLowerCase().includes('access denied') ||
    errorMessage.toLowerCase().includes('artist') ||
    errorMessage.toLowerCase().includes('auth')
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-xl bg-[#0D1B13] rounded-3xl p-6 sm:p-8 border border-[#24392B] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-[#24392B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1ED760]/20 border border-[#1ED760]/40 flex items-center justify-center shadow-lg shadow-[#1ED760]/20">
              <Upload className="w-5 h-5 text-[#1ED760]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#F5F7F5] font-['Space_Grotesk']">
                Upload & Release Music
              </h3>
              <p className="text-xs text-[#A0B0A5]">Distribute your track across the Tunease network</p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-2 rounded-full bg-[#12251A] text-[#A0B0A5] hover:text-[#F5F7F5] hover:bg-[#1A3324] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FEEDBACK NOTICES */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-[#1ED760]/15 border border-[#1ED760]/30 text-[#8BE9A7] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#1ED760]" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {isAuthError && (
              <div className="pt-2 border-t border-red-500/20 flex items-center justify-between">
                <span className="text-[11px] text-red-200">Tip: Uploading tracks requires an Artist account.</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1 bg-[#1ED760] hover:bg-[#1fdf64] text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#1ED760]/25"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Sign In as Artist</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          
          {/* TRACK TITLE */}
          <div className="space-y-1">
            <label className="text-[#A0B0A5] font-bold">Track Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyberpunk Overdrive"
              className="w-full bg-[#12251A] text-[#F5F7F5] p-3 rounded-xl border border-[#24392B] focus:border-[#1ED760] focus:outline-none"
            />
          </div>

          {/* ARTIST & ALBUM ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#A0B0A5] font-bold">Artist / Creator Name</label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="e.g. Tunease Studio"
                className="w-full bg-[#12251A] text-[#F5F7F5] p-3 rounded-xl border border-[#24392B] focus:border-[#1ED760] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#A0B0A5] font-bold">Album or EP Name</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="e.g. Synthetic Dreams (Single)"
                className="w-full bg-[#12251A] text-[#F5F7F5] p-3 rounded-xl border border-[#24392B] focus:border-[#1ED760] focus:outline-none"
              />
            </div>
          </div>

          {/* GENRE */}
          <div className="space-y-1">
            <label className="text-[#A0B0A5] font-bold">Primary Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-[#12251A] text-[#F5F7F5] p-3 rounded-xl border border-[#24392B] focus:border-[#1ED760] focus:outline-none"
            >
              <option value="Electronic">Electronic / Synthwave</option>
              <option value="Hip-Hop">Hip-Hop / Urban</option>
              <option value="Pop">Pop / Modern</option>
              <option value="Rock">Alternative / Rock</option>
              <option value="Ambient">Ambient / Chill</option>
              <option value="R&B">R&B / Soul</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-[#A0B0A5] font-bold">Liner Notes / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell listeners the story behind this release..."
              className="w-full bg-[#12251A] text-[#F5F7F5] p-3 rounded-xl border border-[#24392B] focus:border-[#1ED760] focus:outline-none resize-none"
            />
          </div>

          {/* FILE UPLOAD DROPZONES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* AUDIO FILE */}
            <div className="space-y-1">
              <label className="text-[#A0B0A5] font-bold flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#1ED760]" />
                Audio Master File *
              </label>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-[#24392B] hover:border-[#1ED760] bg-[#12251A] cursor-pointer transition-colors text-center">
                <Upload className="w-5 h-5 text-[#A0B0A5] mb-1" />
                <span className="text-[11px] text-[#F5F7F5] truncate max-w-[180px]">
                  {audioFile ? audioFile.name : 'Select MP3, WAV, FLAC'}
                </span>
                <span className="text-[9px] text-[#A0B0A5] mt-0.5">High-res audio up to 50MB</span>
                <input
                  type="file"
                  accept="audio/*"
                  required
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            {/* COVER ART */}
            <div className="space-y-1">
              <label className="text-[#A0B0A5] font-bold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#8BE9A7]" />
                Artwork Cover Image *
              </label>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-[#24392B] hover:border-[#1ED760] bg-[#12251A] cursor-pointer transition-colors text-center">
                <ImageIcon className="w-5 h-5 text-[#A0B0A5] mb-1" />
                <span className="text-[11px] text-[#F5F7F5] truncate max-w-[180px]">
                  {coverFile ? coverFile.name : 'Select PNG, JPG, WebP'}
                </span>
                <span className="text-[9px] text-[#A0B0A5] mt-0.5">Square 1:1 ratio recommended</span>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

          </div>

          {/* EXPLICIT TOGGLE */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="explicitCheck"
              checked={isExplicit}
              onChange={(e) => setIsExplicit(e.target.checked)}
              className="w-4 h-4 accent-[#1ED760] rounded"
            />
            <label htmlFor="explicitCheck" className="text-[#A0B0A5] cursor-pointer hover:text-[#F5F7F5]">
              Mark this release as explicit content
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#1ED760] hover:bg-[#1fdf64] text-black font-extrabold text-sm shadow-xl shadow-[#1ED760]/30 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Uploading to Microservice...' : 'Publish Track to Tunease'}
          </button>

        </form>

      </div>

    </div>
  );
};

export default UploadMusicModal;
