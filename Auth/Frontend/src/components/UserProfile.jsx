import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  LogOut, 
  ExternalLink, 
  Sparkles, 
  Edit3, 
  Check, 
  X, 
  Camera, 
  Loader2, 
  Music2, 
  Headphones, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const UserProfile = ({ user, authToken, onLogout, onUpdateUser }) => {
  const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:3000';
  const musicUrl = `${(import.meta.env.VITE_MUSIC_APP_URL || 'https://tunease-music-service-latest.onrender.com').replace(/\/$/, '')}/user_dashboard${authToken ? `#access_token=${encodeURIComponent(authToken)}` : ''}`;
  const apiBaseUrl = import.meta.env.VITE_AUTH_API_URL || 'https://tunease-auth-service-latest.onrender.com/api/auth';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit form states
  const [firstName, setFirstName] = useState(
    typeof user.fullName === 'string' 
      ? user.fullName.split(' ')[0] 
      : (user.fullName?.firstName || '')
  );
  const [lastName, setLastName] = useState(
    typeof user.fullName === 'string' 
      ? user.fullName.split(' ').slice(1).join(' ') 
      : (user.fullName?.lastName || '')
  );
  const [mobileNo, setMobileNo] = useState(user.mobileNo ? String(user.mobileNo) : '');
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || '');
  const [role, setRole] = useState(user.role || 'user');

  const displayFirstName = user.fullName?.firstName || (typeof user.fullName === 'string' ? user.fullName : '') || user.email?.split('@')[0] || 'Tunease User';
  const displayLastName = user.fullName?.lastName || '';
  const fullName = `${displayFirstName} ${displayLastName}`.trim();

  const handleStartEdit = () => {
    setFirstName(typeof user.fullName === 'string' ? user.fullName.split(' ')[0] : (user.fullName?.firstName || ''));
    setLastName(typeof user.fullName === 'string' ? user.fullName.split(' ').slice(1).join(' ') : (user.fullName?.lastName || ''));
    setMobileNo(user.mobileNo ? String(user.mobileNo) : '');
    setProfilePhoto(user.profilePhoto || '');
    setRole(user.role || 'user');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNo: mobileNo.trim() ? mobileNo.trim() : null,
        profilePhoto: profilePhoto.trim() || undefined,
        role: role
      };

      const res = await fetch(`${apiBaseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setSuccessMsg('Profile updated successfully!');
        if (onUpdateUser) {
          onUpdateUser(data.user);
        }
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMsg(null);
        }, 900);
      } else {
        setErrorMsg(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      {/* User Avatar */}
      <div className="relative inline-block mb-3 group">
        {(isEditing ? profilePhoto : user.profilePhoto) ? (
          <img
            src={isEditing ? profilePhoto : user.profilePhoto}
            alt={fullName}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#FF5A00] shadow-xl shadow-[#FF5A00]/20 mx-auto"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF5A00] via-[#FF7A00] to-[#FF9A00] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#FF5A00]/20 mx-auto border-2 border-white/20">
            {displayFirstName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#0C0C0E] flex items-center justify-center text-white text-[10px]">
          ✓
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-1">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {fullName}
        </h2>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            title="Edit Profile"
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF5A00]" />
          </button>
        )}
      </div>

      <p className="text-neutral-400 text-xs mb-5 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A00]" />
        <span>Verified Tunease Account</span>
      </p>

      {/* FEEDBACK ALERTS */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 text-left">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* EDIT PROFILE FORM */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-6 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF5A00] flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Account Information</span>
            </h3>

            {/* NAME INPUTS */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
            </div>

            {/* MOBILE INPUT */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Mobile Phone</label>
              <input
                type="tel"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
              />
            </div>

            {/* AVATAR PHOTO URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Avatar Image URL</label>
              <input
                type="url"
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
              />
            </div>

            {/* ROLE SELECTOR */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'user'
                      ? 'bg-[#FF5A00]/20 border-[#FF5A00] text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Listener</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'artist'
                      ? 'bg-[#FF5A00]/20 border-[#FF5A00] text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Music2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Creator / Artist</span>
                </button>
              </div>
            </div>
          </div>

          {/* EDIT BUTTONS */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] text-white font-bold py-2.5 rounded-xl shadow-lg shadow-[#FF5A00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              className="px-4 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      ) : (
        /* VIEW MODE DETAILS LIST */
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 mb-6 text-left text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-neutral-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-500" />
              Email
            </span>
            <span className="text-white font-medium">{user.email || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-neutral-400 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-500" />
              Mobile
            </span>
            <span className="text-white font-medium">{user.mobileNo || 'Not set'}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-neutral-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              Role
            </span>
            <span className="capitalize px-2 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] font-bold text-[10px]">
              {user.role === 'artist' ? 'Creator / Artist' : (user.role || 'Listener')}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
              Auth Method
            </span>
            <span className="text-neutral-300 font-medium capitalize">
              {user.authProvider || (user.googleId ? 'Google OAuth' : 'Email/Password')}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isEditing && (
        <div className="space-y-3">
          <button
            onClick={handleStartEdit}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Update Profile Details</span>
          </button>

          <a
            href={musicUrl}
            className="w-full bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] text-white font-bold py-3 rounded-2xl shadow-lg shadow-[#FF5A00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <span>Launch Tunease Music Player</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={landingUrl}
            className="w-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold py-2.5 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <span>Return to Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onLogout}
            className="w-full bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 border border-white/10 font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
