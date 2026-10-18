'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LogOut,
  Edit3,
  Check,
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';

export const UserProfile: React.FC = () => {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  const initialFirstName =
    typeof user?.fullName === 'object'
      ? user.fullName.firstName || ''
      : typeof user?.fullName === 'string'
      ? user.fullName.split(' ')[0]
      : '';
  const initialLastName =
    typeof user?.fullName === 'object'
      ? user.fullName.lastName || ''
      : typeof user?.fullName === 'string'
      ? user.fullName.split(' ').slice(1).join(' ')
      : '';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [mobileNo, setMobileNo] = useState(user?.mobileNo || '');
  const [role, setRole] = useState(user?.role || 'user');

  if (!user) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-neutral-400 text-sm">You are not signed in.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 rounded-full bg-[#FF5A00] text-white text-xs font-bold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const displayName =
    (typeof user.fullName === 'object'
      ? `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim()
      : user.fullName) ||
    user.email?.split('@')[0] ||
    'Tunease User';

  const handleStartEdit = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setMobileNo(user.mobileNo || '');
    setRole(user.role || 'user');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNo: mobileNo.trim() ? mobileNo.trim() : null,
        role,
      };

      const res = await authApi.updateProfile(payload);
      if (!res.success || !res.user) {
        throw new Error(res.message || 'Failed to update profile');
      }

      updateUser(res.user);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMsg(null);
      }, 900);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEmailOtp = async () => {
    setOtpLoading(true);
    setOtpMessage(null);
    try {
      const res = await authApi.requestEmailOTP();
      if (res.success) {
        setOtpMessage('Verification code sent to your email.');
        setShowOtpModal(true);
      } else {
        setErrorMsg(res.message || 'Failed to send verification code.');
      }
    } catch {
      setErrorMsg('Could not request email OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setOtpLoading(true);
    try {
      const res = await authApi.verifyEmailOtp(otpCode);
      if (res.success) {
        setSuccessMsg('Email verified successfully!');
        if (res.user) updateUser(res.user);
        setShowOtpModal(false);
        setOtpCode('');
      } else {
        setOtpMessage(res.message || 'Invalid code.');
      }
    } catch {
      setOtpMessage('Failed to verify OTP code.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      {/* User Avatar */}
      <div className="relative inline-block mb-3 group">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#FF5A00] shadow-xl shadow-[#FF5A00]/20 mx-auto"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF5A00] via-[#FF7A00] to-[#FF9A00] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#FF5A00]/20 mx-auto border-2 border-white/20">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#0C0C0E] flex items-center justify-center text-white text-[10px]">
          ✓
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-1">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{displayName}</h2>
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
        <span>Verified Tunease Account ({user.role})</span>
      </p>

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

      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-6 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF5A00] flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Account Information</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Mobile Number</label>
              <input
                type="tel"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="+1 555 019 2831"
                className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'artist')}
                className="w-full bg-[#141416] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:border-[#FF5A00] focus:outline-none"
              >
                <option value="user">Music Listener</option>
                <option value="artist">Music Artist / Creator</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#FF5A00] text-white font-bold text-xs hover:bg-[#FF7A00] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-3 mb-6 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                Email
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{user.email}</span>
                {user.isEmailVerified ? (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={handleRequestEmailOtp}
                    disabled={otpLoading}
                    className="text-[10px] text-[#FF5A00] font-bold bg-[#FF5A00]/15 hover:bg-[#FF5A00]/25 px-2 py-0.5 rounded-full cursor-pointer"
                  >
                    Verify Email
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                Mobile
              </span>
              <span className="text-white font-medium">{user.mobileNo || 'Not added'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="space-y-2.5">
        <Link
          href="/discover"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25 hover:scale-[1.01] transition-transform"
        >
          <Zap className="w-4 h-4" />
          <span>Launch Tunease Music Player</span>
        </Link>

        <button
          onClick={async () => {
            await logout();
            router.push('/');
          }}
          className="w-full py-3 rounded-2xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#121214] border border-white/15 rounded-3xl p-6 max-w-sm w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#FF5A00]" />
                <span>Verify Your Email</span>
              </h3>
              <button
                onClick={() => setShowOtpModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {otpMessage && (
              <p className="text-xs text-neutral-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
                {otpMessage}
              </p>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[#18181B] border border-white/15 text-white text-center font-mono text-lg tracking-widest rounded-xl py-2.5 focus:border-[#FF5A00] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3 rounded-xl bg-[#FF5A00] text-white font-bold text-xs hover:bg-[#FF7A00] transition-colors cursor-pointer disabled:opacity-60"
              >
                {otpLoading ? 'Verifying...' : 'Submit Code'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
