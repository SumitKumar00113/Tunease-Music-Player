import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, LogIn, LogOut, User as UserIcon, Zap, Sparkles, Radio, ExternalLink } from 'lucide-react';
import { MUSIC_APP_URL, AUTH_APP_URL } from '../config/env';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar Component
 * Dynamic glassmorphic floating pill with audio indicator, user session manager, and route sync
 */
export const Navbar = ({
  onOpenWaitlist,
  onOpenAuth,
  onLogout,
  user,
  activeSection = 'dark',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLightSection = activeSection === 'light';
  const userDisplayName = user
    ? user.fullName?.firstName || user.email?.split('@')[0] || 'User'
    : '';

  const navLinks = [
    { label: 'For Creators', path: '/creators', anchor: '#creators', badge: 'Studio' },
    { label: 'Spatial Audio', path: '/experience', anchor: '#experience', badge: '3D' },
    { label: 'Features', path: '/features', anchor: '#features' },
    { label: 'Why Tunease', path: '/difference', anchor: '#difference' },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center items-center px-4 pointer-events-none transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto transition-all duration-500 ease-out flex items-center justify-between px-3.5 sm:px-6 py-2 rounded-full ${
          isLightSection
            ? 'bg-neutral-900/90 border border-neutral-700/80 text-white shadow-2xl backdrop-blur-2xl'
            : scrolled
            ? 'bg-[#121214]/92 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl'
            : 'bg-[#121214]/80 border border-white/[0.14] shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl'
        } max-w-[920px] w-full min-h-[56px]`}
        style={{
          boxShadow: isLightSection
            ? '0 16px 40px rgba(0,0,0,0.3)'
            : '0 20px 48px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.15)',
        }}
      >
        {/* LEFT: Tunease Logo & Audio Pill */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group focus:outline-none">
            <Logo variant="light" className="scale-95 group-hover:opacity-95 transition-opacity" />
          </Link>

          {/* Mini Live Audio Status indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] text-neutral-300">
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-1.5 bg-[#FF5A00] animate-pulse" />
              <span className="w-0.5 h-3 bg-[#FF7A00] animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-2 bg-[#FFA000] animate-pulse" style={{ animationDelay: '300ms' }} />
            </span>
            <span className="font-mono text-[9px] text-[#FF9020]">24b/96k FLAC</span>
          </div>
        </div>

        {/* CENTER: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-medium text-neutral-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-white/15 font-semibold shadow-inner'
                    : 'hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF5A00]/25 text-[#FF7A00] border border-[#FF5A00]/30 font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT: User Auth & Action Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/[0.08] border border-white/15 rounded-full px-2.5 py-1 text-xs text-white">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={userDisplayName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#FF7900] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {userDisplayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline font-semibold">{userDisplayName}</span>
              </div>

              <a
                href={MUSIC_APP_URL}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all border border-white/15 flex items-center gap-1.5"
                title="Open Music Player"
              >
                <Zap className="w-3 h-3 text-[#FF5A00]" />
                <span className="hidden sm:inline">Launch Player</span>
              </a>

              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 flex items-center justify-center transition-all cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              <button
                onClick={onOpenWaitlist}
                className="relative group overflow-hidden bg-gradient-to-r from-[#FF5A00] to-[#FF7A00] text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,90,0,0.5)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '6s' }} />
                <span>Join VIP Beta</span>
              </button>
            </div>
          )}

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors ml-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 bg-[#121214]/98 border border-white/20 rounded-[28px] p-6 shadow-2xl backdrop-blur-3xl z-50 pointer-events-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase">Navigation</span>
            <span className="text-[10px] text-neutral-400">FLAC 24-Bit Engine Active</span>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 text-neutral-200 hover:text-white font-medium text-sm transition-colors"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF5A00]">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={MUSIC_APP_URL}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/25"
            >
              <Zap className="w-4 h-4" />
              Launch Tunease Player
            </a>

            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-2xl border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/10"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FF7A00]" />
                Sign In to Account
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-2xl border border-rose-500/30 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out ({userDisplayName})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
