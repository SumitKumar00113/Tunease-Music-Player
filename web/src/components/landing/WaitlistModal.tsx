'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Music, Users, Copy, CheckCheck } from 'lucide-react';
import { Logo } from '../common/Logo';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'creator' | 'fan'>('creator');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Electronic', 'Indie']);
  const [submitted, setSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const availableGenres = ['Electronic', 'Hip-Hop', 'Indie', 'Ambient / 8D', 'Jazz', 'R&B / Soul', 'Rock / Metal'];

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
      setName('');
    }, 300);
  };

  const copyReferralCode = () => {
    setCopiedCode(true);
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('TUNEASE-VIP-2026');
    }
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#0E0E10] border border-white/15 rounded-[36px] p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF5A00]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#D96A32]/15 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={resetAndClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Logo />
                    <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] font-semibold border border-[#FF5A00]/30 font-mono">
                      VIP Beta 2026
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                    Claim your early access to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A00] to-[#FFA000]">Tunease</span>
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                    Join verified indie artists and listeners shaping the lossless audio and creator economy platform.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Select Your Persona
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setRole('creator')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        role === 'creator'
                          ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Music className="w-3.5 h-3.5" />
                      Music Creator
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('fan')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        role === 'fan'
                          ? 'bg-white text-black shadow-lg shadow-white/10'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Music Fan
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Full Name or Artist Pseudonym
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Thorne"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@tunease.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FF5A00] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Favorite Sound Landscapes
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableGenres.map((g) => {
                      const isPicked = selectedGenres.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGenre(g)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            isPicked
                              ? 'bg-white/15 text-white border-[#FF5A00]/50 font-bold'
                              : 'bg-white/5 text-neutral-400 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] text-white font-extrabold text-sm shadow-xl shadow-[#FF5A00]/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reserve VIP Access Ticket</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white">
                    You're on the list, {name || 'Creator'}!
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                    We've saved your spot for VIP Beta Batch #4. Invitations roll out every Monday.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs text-neutral-400">
                    <span>Priority Queue Position</span>
                    <span className="font-mono text-emerald-400 font-bold">#2,849 of 25,000</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10">
                    <span className="text-xs font-mono text-white tracking-widest">TUNEASE-VIP-2026</span>
                    <button
                      onClick={copyReferralCode}
                      className="px-3 py-1 rounded-lg bg-[#FF5A00] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#FF7A00] cursor-pointer"
                    >
                      {copiedCode ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={resetAndClose}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
