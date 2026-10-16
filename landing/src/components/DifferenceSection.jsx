import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { Check, X, Shield, Zap, Sparkles, AudioWaveform as Waveform, Radio } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * DifferenceSection Component
 * Comprehensive comparative breakdown between Tunease and legacy DSP streaming giants
 */
export const DifferenceSection = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const leftCollageRef = useRef(null);
  const rightNetworkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      if (leftCollageRef.current) {
        gsap.fromTo(
          leftCollageRef.current,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      if (rightNetworkRef.current) {
        gsap.fromTo(
          rightNetworkRef.current,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const comparisonRows = [
    {
      feature: 'Creator Royalty Share',
      tunease: '98% Direct to Artist',
      legacy: 'Only ~30% (after label & cuts)',
      highlight: true,
    },
    {
      feature: 'Audio Quality Bitrate',
      tunease: '24-Bit / 96kHz Studio FLAC',
      legacy: '320 kbps Lossy Compression',
      highlight: true,
    },
    {
      feature: 'Fan Demographics & Email Access',
      tunease: '100% Exportable Fan CRM',
      legacy: '0% Platform-Locked Data',
      highlight: false,
    },
    {
      feature: 'Native Direct Artist Tipping',
      tunease: 'Instant 0% Platform Fee',
      legacy: 'Third-party redirects or none',
      highlight: false,
    },
    {
      feature: 'Live Collaborative Listening Rooms',
      tunease: 'Synchronized with Artist Chat',
      legacy: 'Restricted or Discontinued',
      highlight: false,
    },
    {
      feature: 'Multi-Track Stems Vault',
      tunease: 'Native Stems & Remix Licensing',
      legacy: 'Unsupported',
      highlight: true,
    },
  ];

  return (
    <section
      id="difference"
      ref={sectionRef}
      className="relative w-full bg-[#080808] py-24 px-4 sm:px-8 rounded-[36px] my-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* CENTERED HEADLINE & PARAGRAPH */}
        <div ref={headlineRef} className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5A00]/15 border border-[#FF5A00]/25 text-[#FF5A00] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Competitive Matrix</span>
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            What Makes Us Different
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-neutral-400 font-normal leading-relaxed max-w-xl mx-auto">
            Music shouldn't be governed by extractive algorithms. See how Tunease redefines the creator-fan equation.
          </p>
        </div>

        {/* ==================================================
            COMPARISON MATRIX TABLE
            ================================================== */}
        <div className="bg-[#121214]/90 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-12 bg-white/[0.04] p-4 sm:p-6 border-b border-white/10 text-xs uppercase font-mono font-bold tracking-wider text-neutral-400">
            <div className="col-span-5 sm:col-span-6">Platform Capability</div>
            <div className="col-span-4 sm:col-span-3 text-[#FF7A00] font-black flex items-center gap-1.5">
              <span>TUNEASE</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-ping" />
            </div>
            <div className="col-span-3 sm:col-span-3 text-neutral-500">Legacy DSPs (Spotify)</div>
          </div>

          <div className="divide-y divide-white/5">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 p-4 sm:p-6 items-center text-xs sm:text-sm transition-colors hover:bg-white/[0.02] ${
                  row.highlight ? 'bg-white/[0.015]' : ''
                }`}
              >
                <div className="col-span-5 sm:col-span-6 font-semibold text-neutral-200">
                  {row.feature}
                </div>
                
                {/* Tunease Column */}
                <div className="col-span-4 sm:col-span-3 font-bold text-white flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#FF5A00]/20 flex items-center justify-center text-[#FF5A00] flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-100">{row.tunease}</span>
                </div>

                {/* Legacy Column */}
                <div className="col-span-3 sm:col-span-3 text-neutral-400 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 flex-shrink-0">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-400">{row.legacy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM METRICS COUNTER BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">100%</span>
            <p className="text-xs text-neutral-400 mt-1 font-semibold">Lossless Audio Rate</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <span className="text-3xl sm:text-4xl font-black text-[#FF7A00] font-mono">98%</span>
            <p className="text-xs text-neutral-400 mt-1 font-semibold">Artist Direct Payout</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">&lt; 15ms</span>
            <p className="text-xs text-neutral-400 mt-1 font-semibold">Global Stream Latency</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">0</span>
            <p className="text-xs text-neutral-400 mt-1 font-semibold">Intrusive Audio Ads</p>
          </div>
        </div>

      </div>
    </section>
  );
};
