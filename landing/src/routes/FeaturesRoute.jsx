import React from 'react';
import { FeatureCarouselSection } from '../components/FeatureCarouselSection';
import { ValueCardsSection } from '../components/ValueCardsSection';
import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * FeaturesRoute Component
 * Complete feature breakdown and technical capability overview
 */
export function FeaturesRoute({ onOpenWaitlist }) {
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
          Platform Architecture
        </span>
      </div>

      <FeatureCarouselSection onOpenWaitlist={onOpenWaitlist} />
      <ValueCardsSection onOpenWaitlist={onOpenWaitlist} />
      <Footer onOpenWaitlist={onOpenWaitlist} />
    </div>
  );
}
