import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Sparkles, Music2, Share2, Disc, Shield, Users, Radio } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * FeatureCarouselSection Component
 * Detailed platform feature suite with interactive tabs, deep architecture breakdown, and interactive cards
 */
export const FeatureCarouselSection = ({ onOpenWaitlist }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const card0Ref = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1,
        },
      });

      if (card0Ref.current && card1Ref.current && card2Ref.current) {
        tl.fromTo(card0Ref.current, { y: 100, rotate: -15 }, { y: 0, rotate: -6 }, 0)
          .fromTo(card1Ref.current, { y: 130, rotate: -10 }, { y: 0, rotate: -2 }, 0)
          .fromTo(card2Ref.current, { y: 150, rotate: 10 }, { y: 0, rotate: 4 }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      id: 0,
      title: 'Community &\nArtist Rooms',
      bgColor: 'bg-white',
      textColor: 'text-black',
      tag: '01 / ENGAGEMENT',
      icon: Users,
      short: 'Direct relationship with your favorite musicians',
      description: 'Build direct relationships with artists in real-time chat rooms, live drop sessions, and exclusive subscriber channels without algorithmic gatekeeping.',
      specs: [
        'Live synced listening lounges with artist presence',
        'Private fan club tier with exclusive badges',
        'Direct Q&A voice notes from verified musicians',
      ],
    },
    {
      id: 1,
      title: 'Lossless 24-Bit\nHi-Res Engine',
      bgColor: 'bg-[#F5B52F]',
      textColor: 'text-black',
      tag: '02 / ACOUSTICS',
      icon: Disc,
      short: 'Studio bit-perfect master audio playback',
      description: 'Stream in pristine 24-bit/96kHz and 192kHz FLAC with zero dynamic range loss. Experience instruments exactly as they left the mixing desk.',
      specs: [
        'Bit-perfect bitstream passthrough to external DACs',
        '360° Dolby Atmos and binaural spatial head tracking',
        'Adaptive buffer engine for zero-stutter playback',
      ],
    },
    {
      id: 2,
      title: 'Stems &\nVault Access',
      bgColor: 'bg-[#4C8FEF]',
      textColor: 'text-white',
      tag: '03 / CREATIVE VAULT',
      icon: Music2,
      short: 'Remix, isolate instruments, and unlock demos',
      description: 'Be the first to experience original music, early demo cuts, and isolated instrument stems (drums, bass, vocals) ready for remixing.',
      specs: [
        'Multi-track stems downloader for producers & DJs',
        'Unreleased B-sides and acoustic live recordings',
        'Instant tip-to-unlock exclusive merchandise drops',
      ],
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full bg-[#080808] py-24 px-4 sm:px-8 rounded-[36px] overflow-hidden my-12"
    >
      {/* Background Soft Blue/Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#4C8FEF]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4C8FEF] font-bold px-3.5 py-1.5 rounded-full bg-[#4C8FEF]/10 border border-[#4C8FEF]/20">
            PLATFORM CAPABILITIES
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built for Pure Music Discovery
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Explore features designed from the ground up for artists who make music and listeners who live for it.
          </p>
        </div>

        {/* INTERACTIVE CARDS GRID / SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isSelected = activeIndex === idx;

            return (
              <div
                key={feat.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative rounded-[32px] p-6 sm:p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[460px] border shadow-2xl ${
                  feat.bgColor
                } ${feat.textColor} ${
                  isSelected
                    ? 'scale-[1.03] ring-4 ring-[#FF5A00]/40 z-20'
                    : 'opacity-90 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                {/* TOP HEADER */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold tracking-widest uppercase opacity-75">
                      {feat.tag}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight whitespace-pre-line"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                    {feat.description}
                  </p>
                </div>

                {/* DETAILED SPECS SHEET */}
                <div className="pt-6 border-t border-black/10 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    Feature Inclusions
                  </span>
                  {feat.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0 opacity-70" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* BOTTOM ACTION */}
                <div className="pt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWaitlist();
                    }}
                    className="w-full py-3 rounded-2xl bg-black text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg"
                  >
                    <span>Request Feature Beta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
