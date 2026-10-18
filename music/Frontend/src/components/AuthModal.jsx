import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  Loader2, 
  Headphones, 
  Music2 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginUser, 
    registerUser, 
    updateUserProfile, 
    user, 
    logoutUser 
  } = usePlayer();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [role, setRole] = useState('artist'); // 'user' | 'artist'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState(
    typeof user?.fullName === 'string' 
      ? user?.fullName.split(' ')[0] 
      : (user?.fullName?.firstName || '')
  );
  const [editLastName, setEditLastName] = useState(
    typeof user?.fullName === 'string' 
      ? user?.fullName.split(' ').slice(1).join(' ') 
      : (user?.fullName?.lastName || '')
  );
  const [editMobileNo, setEditMobileNo] = useState(user?.mobileNo ? String(user?.mobileNo) : '');
  const [editProfilePhoto, setEditProfilePhoto] = useState(user?.profilePhoto || '');
  const [editRole, setEditRole] = useState(user?.role || 'artist');

  const startProfileEdit = () => {
    setEditFirstName(
      typeof user?.fullName === 'string' 
        ? user?.fullName.split(' ')[0] 
        : (user?.fullName?.firstName || '')
    );
    setEditLastName(
      typeof user?.fullName === 'string' 
        ? user?.fullName.split(' ').slice(1).join(' ') 
        : (user?.fullName?.lastName || '')
    );
    setEditMobileNo(user?.mobileNo ? String(user?.mobileNo) : '');
    setEditProfilePhoto(user?.profilePhoto || '');
    setEditRole(user?.role || 'artist');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        mobileNo: editMobileNo.trim() ? editMobileNo.trim() : null,
        profilePhoto: editProfilePhoto.trim() || undefined,
        role: editRole,
      };

      const res = await updateUserProfile(payload);
      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => {
          setIsEditingProfile(false);
          setSuccessMsg('');
        }, 800);
      } else {
        setErrorMsg(res.message || 'Profile update failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email, password);
        if (res.success) {
          setSuccessMsg('Logged in successfully!');
          setTimeout(() => {
            setIsAuthModalOpen(false);
          }, 800);
        } else {
          setErrorMsg(res.message || 'Invalid credentials');
        }
      } else {
        const payload = {
          email,
          password,
          mobileNo: mobileNo || undefined,
          fullName: {
            firstName: firstName || 'Tunease',
            lastName: lastName || 'User'
          },
          role
        };
        const res = await registerUser(payload);
        if (res.success) {
          setSuccessMsg('Account registered successfully!');
          setTimeout(() => {
            setIsAuthModalOpen(false);
          }, 800);
        } else {
          setErrorMsg(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0C0C0E] rounded-3xl p-6 sm:p-8 border border-[#29292D] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#29292D] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#60cfd8]/20 border border-[#60cfd8]/40 flex items-center justify-center shadow-lg shadow-[#60cfd8]/20">
              <Sparkles className="w-5 h-5 text-[#60cfd8]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#F5F5F5] font-['Space_Grotesk']">
                {user ? 'Account Settings' : mode === 'login' ? 'Sign In to Tunease' : 'Create Tunease Account'}
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                {user ? 'Manage your audio studio profile' : 'Connect to live Tunease Auth & Studio'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-full bg-[#141416] text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#26262B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IF USER ALREADY LOGGED IN */}
        {user ? (
          isEditingProfile ? (
            /* EDIT PROFILE FORM */
            <form onSubmit={handleSaveProfile} className="space-y-4 py-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#60cfd8] uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Profile Info</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5]"
                >
                  Cancel
                </button>
              </div>

              {/* NAME FIELDS */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A1A1AA]">First Name</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full bg-[#141416] text-[#F5F5F5] text-xs p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A1A1AA]">Last Name</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full bg-[#141416] text-[#F5F5F5] text-xs p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                  />
                </div>
              </div>

              {/* MOBILE NO */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A1A1AA]">Mobile Phone</label>
                <input
                  type="tel"
                  value={editMobileNo}
                  onChange={(e) => setEditMobileNo(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-[#141416] text-[#F5F5F5] text-xs p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                />
              </div>

              {/* AVATAR PHOTO URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A1A1AA]">Avatar Image URL</label>
                <input
                  type="url"
                  value={editProfilePhoto}
                  onChange={(e) => setEditProfilePhoto(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#141416] text-[#F5F5F5] text-xs p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                />
              </div>

              {/* ROLE SELECTION */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A1A1AA]">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditRole('user')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      editRole === 'user'
                        ? 'bg-[#60cfd8]/20 border-[#60cfd8] text-white'
                        : 'bg-[#141416] border-[#29292D] text-[#A1A1AA] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5 text-[#60cfd8]" />
                    <span>Listener</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditRole('artist')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      editRole === 'artist'
                        ? 'bg-[#60cfd8]/20 border-[#60cfd8] text-white'
                        : 'bg-[#141416] border-[#29292D] text-[#A1A1AA] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <Music2 className="w-3.5 h-3.5 text-[#60cfd8]" />
                    <span>Creator / Artist</span>
                  </button>
                </div>
              </div>

              {/* SAVE / CANCEL */}
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#60cfd8] hover:bg-[#4ebcc7] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#60cfd8]/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#141416] text-[#A1A1AA] hover:text-[#F5F5F5] border border-[#29292D] text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* ACCOUNT VIEW CARD */
            <div className="space-y-4 text-center py-2">
              <div className="relative inline-block mx-auto">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#60cfd8] shadow-lg shadow-[#60cfd8]/25 mx-auto"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#141416] border-2 border-[#60cfd8] text-[#60cfd8] flex items-center justify-center text-xl font-bold mx-auto shadow-lg shadow-[#60cfd8]/20">
                    {user.fullName?.firstName ? user.fullName.firstName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#60cfd8] rounded-full border-2 border-[#0C0C0E] flex items-center justify-center text-black text-[9px] font-bold">
                  ✓
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#F5F5F5]">
                  {typeof user.fullName === 'string'
                    ? user.fullName
                    : `${user.fullName?.firstName || ''} ${user.fullName?.lastName || ''}`.trim() || user.email}
                </h4>
                <p className="text-xs text-[#32aeb9] font-semibold uppercase tracking-wider">
                  {user.role === 'artist' ? 'Creator / Artist' : (user.role || 'Listener')}
                </p>
                <p className="text-xs text-[#A1A1AA]">{user.email}</p>
                {user.mobileNo && (
                  <p className="text-[11px] text-[#A1A1AA]/80 mt-0.5">Mobile: {user.mobileNo}</p>
                )}
              </div>

              {/* ACTIONS: EDIT PROFILE & SIGN OUT */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={startProfileEdit}
                  className="w-full py-2.5 rounded-xl bg-[#141416] hover:bg-[#26262B] text-[#F5F5F5] font-bold text-xs border border-[#29292D] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#60cfd8]" />
                  <span>Edit Profile Details</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={logoutUser}
                    className="w-full py-2.5 rounded-xl bg-[#141416] hover:bg-red-500/20 text-red-400 border border-[#29292D] font-bold text-xs transition-colors"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-[#60cfd8] hover:bg-[#4ebcc7] text-black font-bold text-xs shadow-md shadow-[#60cfd8]/25"
                  >
                    Continue to App
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            {/* TAB SELECTOR */}
            <div className="grid grid-cols-2 gap-2 bg-[#141416] p-1 rounded-2xl border border-[#29292D]">
              <button
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-[#60cfd8] text-black shadow-lg shadow-[#60cfd8]/20'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-[#60cfd8] text-black shadow-lg shadow-[#60cfd8]/20'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </button>
            </div>

            {/* ERROR / SUCCESS NOTICES */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-[#60cfd8]/15 border border-[#60cfd8]/30 text-[#32aeb9] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#60cfd8]" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[#A1A1AA] font-bold">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-[#141416] text-[#F5F5F5] p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#A1A1AA] font-bold">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full bg-[#141416] text-[#F5F5F5] p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A1A1AA] font-bold">Account Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#141416] text-[#F5F5F5] p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                    >
                      <option value="artist">Artist & Creator (can upload & manage music)</option>
                      <option value="user">Listener (can play & create playlists)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A1A1AA] font-bold">Mobile Number (Optional)</label>
                    <input
                      type="text"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full bg-[#141416] text-[#F5F5F5] p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@tunease.com"
                  className="w-full bg-[#141416] text-[#F5F5F5] p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-bold">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141416] text-[#F5F5F5] p-2.5 rounded-xl border border-[#29292D] focus:border-[#60cfd8] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-[#60cfd8] hover:bg-[#4ebcc7] text-black font-extrabold text-sm shadow-xl shadow-[#60cfd8]/30 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {isLoading
                  ? 'Connecting to Backend...'
                  : mode === 'login'
                  ? 'Sign In'
                  : 'Create Studio Account'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
