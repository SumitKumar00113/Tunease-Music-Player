'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone, User, UserPlus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AUTH_BASE_URL } from '../../services/authApi';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  redirectTo = '/discover',
}) => {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'artist'>('artist');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const payload = {
        email,
        mobileNo: mobileNo || undefined,
        fullName: {
          firstName,
          lastName,
        },
        password,
        role,
      };

      const res = await register(payload);
      if (!res.success) {
        throw new Error(res.message || 'Registration failed');
      }

      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }, 700);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `${AUTH_BASE_URL}/google`;
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          Create Tunease Account
        </h2>
        <p className="text-neutral-400 text-xs">
          Join thousands of music creators & listeners worldwide
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1 ml-1">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                required
                placeholder="Maya"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1 ml-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Lin"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 ml-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="email"
              required
              placeholder="maya@tunease.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 ml-1">
            Mobile Number (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="tel"
              placeholder="+1 555 019 2831"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 ml-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 ml-1">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setRole('artist')}
              className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                role === 'artist'
                  ? 'bg-[#FF5A00] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Music Artist
            </button>
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                role === 'user'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Music Listener
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-[#FF5A00] via-[#FF6A00] to-[#FF8A00] text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-[#FF5A00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative px-3 bg-[#0C0C0E] text-[11px] text-neutral-500 font-medium uppercase tracking-wider">
          Or register with
        </span>
      </div>

      <button
        type="button"
        onClick={handleGoogleAuth}
        className="w-full bg-white/8 hover:bg-white/12 border border-white/15 text-white font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs cursor-pointer shadow-md"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
          />
        </svg>
        <span>Sign Up with Google</span>
      </button>

      <p className="mt-5 text-center text-xs text-neutral-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[#FF5A00] font-semibold hover:underline cursor-pointer"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
};
