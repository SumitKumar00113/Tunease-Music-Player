import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Sparkles, Heart, Zap, Shield, Music, Headphones } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ValueCardsSection Component
 * High-impact comparative value propositions for Creators vs Fans with interactive perk drawers
 */
export const ValueCardsSection = ({ onOpenWaitlist }) => {
  const sectionRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  const [creatorExpanded, setCreatorExpanded] = useState(false);
  const [fanExpanded, setFanExpanded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      if (leftCardRef.current) {
        gsap.fromTo(
          leftCardRef.current,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      if (rightCardRef.current) {
        gsap.fromTo(
          rightCardRef.current,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
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

  const creatorPerks = [
    'Keep 98% of royalties with instant blockchain/bank settlement',
    'Direct-to-fan subscription passes & unreleased stems vault',
    'Real-time listener analytics without label or aggregator middleman',
    'Integrated merchandise shop with 0% platform transaction cut',
  ];

  const fanPerks = [
    'Pure 24-bit/96kHz lossless FLAC streaming without audio ads',
    'Real-time listening parties with synchronized chat & artist voice notes',
    'Custom playlist collaboration and automated smart mix transitions',
    'Support favorite artists directly with 1-click micro tips',
  ];

  return (
    <section ref={sectionRef} className="relative w-full bg-[#080808] py-24 px-4 sm:px-8 rounded-[36px] my-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#FF5A00] font-bold px-3.5 py-1.5 rounded-full bg-[#FF5A00]/10 border border-[#FF5A00]/20">
            VALUE PROPOSITIONS
          </span>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            A Fair Ecosystem for Everyone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* LEFT CARD: Value for Creators */}
          <div
            ref={leftCardRef}
            className="relative rounded-[32px] overflow-hidden shadow-2xl group border border-white/10 transition-all duration-500 bg-neutral-900"
          >
            <div className="relative h-[340px] sm:h-[400px] overflow-hidden cursor-pointer" onClick={() => setCreatorExpanded(!creatorExpanded)}>
              <img
                src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop"
                alt="Concert stage blue lighting"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter brightness-75 contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-halftone-pattern opacity-15 pointer-events-none" />

              {/* Top Circular Plus Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatorExpanded(!creatorExpanded);
                }}
                className="absolute top-6 left-6 w-11 h-11 rounded-full border border-white/30 backdrop-blur-md bg-black/50 flex items-center justify-center text-white group-hover:bg-[#FF5A00] group-hover:border-[#FF5A00] transition-all cursor-pointer"
                title="Expand Creator Perks"
              >
                <Plus className={`w-5 h-5 transition-transform duration-300 ${creatorExpanded ? 'rotate-45' : ''}`} />
              </button>

              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-[#FF7A00] font-bold">
                98% Royalties
              </div>

              {/* Bottom Headline */}
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <span className="text-xs uppercase tracking-widest text-blue-300 font-bold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#FF7A00]" />
                  FOR INDEPENDENT & SIGNED ARTISTS
                </span>
                <h3
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Value for Creators
                </h3>
              </div>
            </div>

            {/* EXPANDABLE DETAILS DRAWER */}
            <div className="p-6 sm:p-8 bg-[#0C0B0A] border-t border-white/10 space-y-4">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold block">
                Creator Toolkit Features
              </span>
              <div className="space-y-2.5">
                {creatorPerks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-200">
                    <div className="w-4 h-4 rounded-full bg-[#FF5A00]/20 flex items-center justify-center text-[#FF5A00] mt-0.5 flex-shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenWaitlist}
                  className="w-full py-3 rounded-2xl bg-[#FF5A00] hover:bg-[#FF6A00] text-white text-xs font-bold transition-all shadow-lg shadow-[#FF5A00]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join as Creator</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Free for Fans */}
          <div
            ref={rightCardRef}
            className="relative rounded-[32px] overflow-hidden shadow-2xl group border border-white/10 transition-all duration-500 bg-neutral-900"
          >
            <div className="relative h-[340px] sm:h-[400px] overflow-hidden cursor-pointer" onClick={() => setFanExpanded(!fanExpanded)}>
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop"
                alt="Concert stage crowd event"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter brightness-75 contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-halftone-pattern opacity-15 pointer-events-none" />

              {/* Top Circular Plus Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFanExpanded(!fanExpanded);
                }}
                className="absolute top-6 left-6 w-11 h-11 rounded-full border border-white/30 backdrop-blur-md bg-black/50 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all cursor-pointer"
                title="Expand Fan Perks"
              >
                <Plus className={`w-5 h-5 transition-transform duration-300 ${fanExpanded ? 'rotate-45' : ''}`} />
              </button>

              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-emerald-400 font-bold">
                100% Free Tier
              </div>

              {/* Bottom Headline */}
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                  FOR PASSIONATE MUSIC LOVERS
                </span>
                <h3
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Free for Fans
                </h3>
              </div>
            </div>

            {/* EXPANDABLE DETAILS DRAWER */}
            <div className="p-6 sm:p-8 bg-[#0C0B0A] border-t border-white/10 space-y-4">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold block">
                Fan Experience Inclusions
              </span>
              <div className="space-y-2.5">
                {fanPerks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-200">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 flex-shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenWaitlist}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Start Listening Free</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
