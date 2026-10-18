'use client';

import React, { useState } from 'react';
import { WaitlistModal } from '../../../components/landing/WaitlistModal';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Tunease VIP Beta</h1>
        <p className="text-neutral-400 text-sm">
          Join the exclusive early access cohort for lossless audio streaming and creator-first social music.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 rounded-full bg-[#FF5A00] text-white font-bold text-sm shadow-xl shadow-[#FF5A00]/30 hover:bg-[#FF7A00] transition-colors cursor-pointer"
        >
          Open Application Form
        </button>
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>

      <WaitlistModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
