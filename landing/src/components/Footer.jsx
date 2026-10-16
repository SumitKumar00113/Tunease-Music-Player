import React, { useState } from 'react';
import { Logo } from './Logo';
import { ArrowUp, Radio, Send, CheckCircle2, ShieldCheck, Disc3 } from 'lucide-react';
import { MUSIC_APP_URL, AUTH_APP_URL } from '../config/env';

/**
 * Footer Component
 * Detailed platform footer with live network status indicator, newsletter subscription, and audio spec badges
 */
export const Footer = ({ onOpenWaitlist }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 2000);
    }
  };

  return (
    <footer id="contact" className="relative w-full bg-[#050505] text-neutral-400 pt-24 pb-14 px-6 sm:px-12 rounded-b-[36px] overflow-hidden">
      {/* Subtle Orange Ambient Glow */}
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#D96A32]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#FF5A00]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-halftone-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        
        {/* TOP ROW: LOGO, NEWSLETTER, & LINK COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-5 space-y-5">
            <Logo variant="light" className="scale-125 origin-left" />
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed pt-2">
              The premier social media and lossless audio streaming ecosystem designed specifically for indie creators and passionate music fans.
            </p>

            {/* LIVE SYSTEM STATUS PILL */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-neutral-300 font-mono">
                All Systems Operational • 99.99% FLAC CDN
              </span>
            </div>

            {/* NEWSLETTER */}
            <div className="pt-2">
              <span className="text-xs uppercase font-bold text-neutral-300 block mb-2 tracking-wider">
                Weekly Audio Drops & Stems Dispatch
              </span>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex max-w-md items-center gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF5A00]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#FF5A00] hover:bg-[#FF7A00] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FF5A00]/30"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full max-w-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You're subscribed to the Tunease Dispatch!</span>
                </div>
              )}
            </div>
          </div>

          {/* LINK COLUMNS */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-medium">
            
            {/* COMPANY */}
            <div className="space-y-3.5">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Platform</h4>
              <ul className="space-y-2.5">
                <li><a href="#about" className="hover:text-white transition-colors">Manifesto</a></li>
                <li><a href="#experience" className="hover:text-white transition-colors">Spatial DSP Engine</a></li>
                <li><a href="#difference" className="hover:text-white transition-colors">Royalty Matrix</a></li>
                <li><a href="#creators" className="hover:text-white transition-colors">Creator Studio</a></li>
              </ul>
            </div>

            {/* ECOSYSTEM */}
            <div className="space-y-3.5">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Ecosystem</h4>
              <ul className="space-y-2.5">
                <li><a href={MUSIC_APP_URL} className="text-[#FF5A00] hover:text-white font-bold transition-colors">Launch Player</a></li>
                <li><a href={AUTH_APP_URL} className="hover:text-white transition-colors">Auth Portal</a></li>
                <li><button onClick={onOpenWaitlist} className="hover:text-white transition-colors cursor-pointer text-left">VIP Early Access</button></li>
                <li><a href="#features" className="hover:text-white transition-colors">Stems Vault</a></li>
              </ul>
            </div>

            {/* AUDIO STANDARDS */}
            <div className="space-y-3.5">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Acoustics</h4>
              <ul className="space-y-2.5 text-neutral-400">
                <li className="flex items-center gap-1.5"><Disc3 className="w-3 h-3 text-[#FF7A00]" /> 24-bit/96kHz FLAC</li>
                <li className="flex items-center gap-1.5"><Disc3 className="w-3 h-3 text-[#FF7A00]" /> 3D Dolby Atmos</li>
                <li className="flex items-center gap-1.5"><Disc3 className="w-3 h-3 text-[#FF7A00]" /> Binaural Spatial</li>
                <li className="flex items-center gap-1.5"><Disc3 className="w-3 h-3 text-[#FF7A00]" /> Zero Compression</li>
              </ul>
            </div>

            {/* SOCIALS */}
            <div className="space-y-3.5">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Community</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-white transition-colors">Discord Lounge</a></li>
                <li><a href="#" className="hover:text-white transition-colors">X / Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram Sound</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube Studio</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM ROW: COPYRIGHT, SPEC BADGES, & BACK TO TOP */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-neutral-500">
            <span>© {new Date().getFullYear()} Tunease Inc. All rights reserved.</span>
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">DMCA Notice</a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-500">
              Built for pure music discovery
            </span>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
