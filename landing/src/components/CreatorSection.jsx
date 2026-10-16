import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Award, TrendingUp, DollarSign, Calculator, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CreatorSection Component
 * Detailed Creator Studio with live stream revenue calculator and direct fan monetization breakdown
 */
export const CreatorSection = () => {
  const sectionRef = useRef(null);
  const backCardRef = useRef(null);
  const middleCardRef = useRef(null);
  const frontCardRef = useRef(null);

  const [monthlyStreams, setMonthlyStreams] = useState(50000);
  const [activeTier, setActiveTier] = useState('verified');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: 1,
        },
      });

      if (backCardRef.current && middleCardRef.current && frontCardRef.current) {
        tl.to(backCardRef.current, { x: 32, y: -18, rotate: 7 }, 0)
          .to(middleCardRef.current, { x: 20, y: -10, rotate: -5 }, 0)
          .to(frontCardRef.current, { x: 0, y: 0, rotate: 0 }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Tunease direct payout calculation: $0.024/stream + tips vs Legacy: $0.0033/stream
  const tuneaseEarnings = Math.round(monthlyStreams * 0.024);
  const legacyEarnings = Math.round(monthlyStreams * 0.0033);
  const differenceMultiplier = (tuneaseEarnings / (legacyEarnings || 1)).toFixed(1);

  const topFans = [
    {
      name: 'Elena Rostova',
      handle: '@elena_beats',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      tier: 'Top 1% Supporter',
      spent: '$240 in Tips',
    },
    {
      name: 'Marcus Vance',
      handle: '@marcus_v',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      tier: 'VIP Collector',
      spent: 'All Vinyl Drops',
    },
    {
      name: 'Sophia Chen',
      handle: '@sophiac',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      tier: 'Early Listener',
      spent: 'Day-One Backer',
    },
  ];

  return (
    <section
      id="creators"
      ref={sectionRef}
      className="relative w-full min-h-[90vh] rounded-[36px] overflow-hidden my-12 bg-black py-20 px-6 sm:px-12 flex flex-col justify-center"
    >
      {/* Background Image with Layered Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop"
          alt="Concert crowd stage background"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover filter brightness-60 contrast-125 scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.96) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-halftone-pattern opacity-15 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-16">
        
        {/* UPPER ROW: INTRO & 3D FAN STACK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT SIDE CONTENT */}
          <div className="lg:col-span-6 space-y-6 pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5A00]/20 border border-[#FF5A00]/30 text-[#FF5A00] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              FOR THE INDIE & MAINSTREAM CREATORS
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-extrabold leading-tight tracking-tight">
              Keep 98% of your royalties. Own your fans directly.
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Traditional DSPs take up to 70% of revenue and hide fan contact data. Tunease changes the game with direct subscriptions, instant tip rails, and zero algorithmic censorship.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md">
                <span className="text-[10px] uppercase font-mono text-[#FF7A00] font-bold">Payout Share</span>
                <p className="text-2xl font-black text-white mt-1">98%</p>
                <span className="text-[10px] text-neutral-400">Direct to wallet</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md">
                <span className="text-[10px] uppercase font-mono text-[#FF7A00] font-bold">Settlement</span>
                <p className="text-2xl font-black text-white mt-1">Instant</p>
                <span className="text-[10px] text-neutral-400">No 90-day delay</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-mono text-[#FF7A00] font-bold">Fan CRM</span>
                <p className="text-2xl font-black text-white mt-1">100%</p>
                <span className="text-[10px] text-neutral-400">Full email access</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: 3D FAN COLLAGE STACK */}
          <div className="lg:col-span-6 relative flex justify-center items-center min-h-[360px]">
            {/* BACK CARD */}
            <div
              ref={backCardRef}
              className="absolute w-[300px] sm:w-[360px] h-[210px] rounded-3xl bg-neutral-900/90 border border-white/15 p-5 shadow-2xl backdrop-blur-xl"
              style={{ transform: 'rotate(5deg) translateY(-10px)' }}
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-white/10">
                <span>Recent Vinyl Preorder Drop</span>
                <span className="text-emerald-400 font-bold">Sold Out (500/500)</span>
              </div>
              <p className="text-white text-sm font-bold mt-3">Midnight Echoes (Limited Clear 180g)</p>
              <p className="text-xs text-neutral-400 mt-1">Revenue: $17,500 netted in 4 minutes</p>
            </div>

            {/* MIDDLE CARD */}
            <div
              ref={middleCardRef}
              className="absolute w-[310px] sm:w-[370px] h-[220px] rounded-3xl bg-[#141417]/95 border border-[#FF5A00]/30 p-5 shadow-2xl backdrop-blur-xl"
              style={{ transform: 'rotate(-4deg) translateY(5px)' }}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF7A00] mb-2">
                <Award className="w-4 h-4" />
                <span>Superfan Leaderboard</span>
              </div>
              <div className="space-y-2">
                {topFans.map((fan, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <img src={fan.avatar} alt={fan.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold text-white">{fan.name}</span>
                    </div>
                    <span className="text-[11px] text-[#FFA020] font-mono">{fan.spent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FRONT CARD */}
            <div
              ref={frontCardRef}
              className="relative z-20 w-[320px] sm:w-[380px] rounded-3xl bg-[#0F0F12] border border-white/20 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Creator Analytics</span>
                </div>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-neutral-300">Live 24h</span>
              </div>

              <div>
                <span className="text-xs text-neutral-400">Total Monthly Royalty Balance</span>
                <p className="text-3xl font-black text-white tracking-tight mt-0.5">$14,290.40</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+34.2% vs previous month</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
                <span>Direct Fan Tipping</span>
                <span className="font-bold text-white">$4,810.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER ROW: INTERACTIVE CREATOR EARNINGS CALCULATOR */}
        <div className="bg-[#121214]/90 border border-white/15 rounded-[32px] p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF7A00]">
                <Calculator className="w-4 h-4" />
                <span>Interactive Royalty Estimator</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                How much more would you earn on Tunease?
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400">Estimated Streams / Month</span>
              <p className="text-2xl font-black text-[#FFA020] font-mono">
                {monthlyStreams.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={monthlyStreams}
              onChange={(e) => setMonthlyStreams(parseInt(e.target.value, 10))}
              className="w-full accent-[#FF5A00] bg-neutral-800 h-2.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-500">
              <span>10K streams</span>
              <span>250K streams</span>
              <span>500K streams</span>
            </div>
          </div>

          {/* Comparison Matrix Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Traditional Platforms */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-xs font-semibold text-neutral-400">Legacy Streaming (Spotify / Apple)</span>
              <p className="text-3xl font-black text-neutral-300 mt-2 font-mono">
                ${legacyEarnings.toLocaleString()}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Avg $0.0033 per stream after record label & platform cuts</p>
            </div>

            {/* Tunease Platform */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FF5A00]/20 to-[#FF7A00]/10 border border-[#FF5A00]/40 relative overflow-hidden">
              <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Tunease Creator Payout
              </span>
              <p className="text-3xl font-black text-white mt-2 font-mono">
                ${tuneaseEarnings.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#FFA020] font-semibold mt-1">
                You make {differenceMultiplier}x more revenue with direct fan support & lossless streaming
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
