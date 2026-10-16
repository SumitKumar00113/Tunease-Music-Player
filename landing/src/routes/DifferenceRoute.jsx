import React from 'react';
import { DifferenceSection } from '../components/DifferenceSection';
import { SocialProofSection } from '../components/SocialProofSection';
import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * DifferenceRoute Component
 * Comparative analysis between Tunease and legacy DSPs
 */
export function DifferenceRoute({ onOpenWaitlist }) {
  return (
    <div className="pt-8 space-y-8 animate-in fade-in duration-300">
      <div className="px-6 sm:px-10 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>
        <span className="text-xs uppercase font-mono tracking-widest text-[#FF5A00] font-bold">
          Competitive Advantage
        </span>
      </div>

      <DifferenceSection />
      <SocialProofSection />
      <Footer onOpenWaitlist={onOpenWaitlist} />
    </div>
  );
}
