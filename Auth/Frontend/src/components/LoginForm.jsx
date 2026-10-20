import React, { useEffect, useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const LoginForm = ({
  onSuccess,
  onSwitchToRegister,
  apiBaseUrl,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') !== 'google_auth_failed') return;

    setError('Google sign-in was cancelled or could not be completed. Please try again.');
    params.delete('error');
    const remainingQuery = params.toString();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${remainingQuery ? `?${remainingQuery}` : ''}${window.location.hash}`
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const payload = { password };
      if (emailOrPhone.includes('@')) {
        payload.email = emailOrPhone;
      } else if (/^\d+$/.test(emailOrPhone)) {
        payload.mobileNo = emailOrPhone;
      } else {
        payload.email = emailOrPhone;
      }

      const res = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error?.[0]?.msg || 'Login failed');
      }

      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onSuccess(data.user, data.accessToken);
      }, 800);
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const returnTo = new URLSearchParams(window.location.search).get('returnTo');
    const googleUrl = new URL(`${apiBaseUrl}/google`);
    if (returnTo) googleUrl.searchParams.set('returnTo', returnTo);
    window.location.href = googleUrl.toString();
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          Welcome back to Tunease
        </h2>
        <p className="text-neutral-400 text-xs">
          Sign in to access your music dashboard & artist features
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1 ml-1">
            Email Address or Mobile Number
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              required
              placeholder="alex@tunease.com or 9876543210"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 ml-1">
            <label className="text-[11px] font-medium text-neutral-400">
              Password
            </label>
            <a href="#" className="text-[11px] text-[#FF5A00] hover:underline">
              Forgot password?
            </a>
          </div>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-[#FF5A00] via-[#FF6A00] to-[#FF8A00] text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-[#FF5A00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* OAuth & Register Prompt */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative px-3 bg-[#0C0C0E] text-[11px] text-neutral-500 font-medium uppercase tracking-wider">
          Or continue with
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
        <span>Sign In with Google</span>
      </button>

      <p className="mt-6 text-center text-xs text-neutral-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-[#FF5A00] font-semibold hover:underline cursor-pointer"
        >
          Create account now
        </button>
      </p>
    </div>
  );
};
