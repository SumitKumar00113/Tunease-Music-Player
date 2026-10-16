import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Music, Zap, Play, Pause, Volume2, ShieldCheck, Radio, Flame } from 'lucide-react';
import { MUSIC_APP_URL } from '../config/env';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroSection Component
 * Immersive 3D Parallax composition with soundwave visualizer, interactive audio preview, and creator stats
 */
export const HeroSection = ({ onOpenWaitlist }) => {
  const [heartCount, setHeartCount] = useState(1482);
  const [liked, setLiked] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeAudioPreset, setActiveAudioPreset] = useState('8D Spatial Studio');

  const containerRef = useRef(null);
  const compositionRef = useRef(null);
  const cardOuter1Ref = useRef(null);
  const cardOuter2Ref = useRef(null);
  const cardMid1Ref = useRef(null);
  const cardMid2Ref = useRef(null);
  const cardCenterRef = useRef(null);
  const cardBottom1Ref = useRef(null);
  const cardBottom2Ref = useRef(null);

  const headingRef = useRef(null);
  const subtextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // 1. GSAP ENTRANCE TIMELINE
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const outerCards = [
        cardOuter1Ref.current,
        cardOuter2Ref.current,
        cardMid1Ref.current,
        cardMid2Ref.current,
        cardBottom1Ref.current,
        cardBottom2Ref.current,
      ].filter(Boolean);

      tl.fromTo(
        outerCards,
        { opacity: 0, scale: 0.75, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, stagger: 0.09 },
        0.2
      );

      // Center card enters slightly after surrounding cards
      if (cardCenterRef.current) {
        tl.fromTo(
          cardCenterRef.current,
          { opacity: 0, scale: 0.8, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2 },
          0.6
        );
      }

      // Headline and Subtext enter
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1 },
          0.7
        );
      }

      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.95
        );
      }

      // 2. HERO SCROLL PARALLAX SCRUB
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      if (compositionRef.current && headingRef.current && subtextRef.current) {
        parallaxTl.to(cardOuter1Ref.current, { y: -120, rotate: -16 }, 0)
          .to(cardOuter2Ref.current, { y: -110, rotate: 16 }, 0)
          .to(cardMid1Ref.current, { y: -80, rotate: -9 }, 0)
          .to(cardMid2Ref.current, { y: -75, rotate: 10 }, 0)
          .to(cardCenterRef.current, { y: -45 }, 0)
          .to(headingRef.current, { y: -35 }, 0)
          .to(subtextRef.current, { y: -20, opacity: 0.5 }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleHeart = () => {
    if (!liked) {
      setHeartCount((prev) => prev + 1);
      setLiked(true);
    } else {
      setHeartCount((prev) => prev - 1);
      setLiked(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-[96vh] flex flex-col items-center justify-between pt-24 pb-16 px-4 overflow-hidden select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#FF5A00]/12 rounded-full blur-[160px] pointer-events-none" />

      {/* TOP FLOATING TICKER PILL */}
      <div className="relative z-20 mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-lg">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A00] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7A00]" />
        </span>
        <span className="text-[11px] font-semibold text-neutral-200">
          Tunease V2.5 Next-Gen Audio Protocol Live
        </span>
        <span className="text-[10px] font-mono font-bold text-[#FFA020] bg-[#FF5A00]/20 px-2 py-0.5 rounded-full border border-[#FF5A00]/30">
          98% Payout
        </span>
      </div>

      {/* ==================================================
          3D FLOATING HERO COMPOSITION (DEPTH LAYERS)
          ================================================== */}
      <div
        ref={compositionRef}
        className="relative w-full max-w-6xl h-[380px] sm:h-[430px] md:h-[490px] my-2 flex items-center justify-center pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FAR CARD 1: TOP LEFT (scale: 0.85, translateZ: -100px, -12deg) */}
        <motion.div
          ref={cardOuter1Ref}
          animate={{ y: [-4, 4, -4], rotate: [-12, -10, -12] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-2 sm:left-6 lg:left-10 top-4 w-28 sm:w-36 md:w-44 h-36 sm:h-48 md:h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/15 glass-card pointer-events-auto cursor-pointer z-10"
          style={{ transform: 'scale(0.85) translateZ(-100px) rotate(-12deg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop"
            alt="Neon stage glow"
            loading="eager"
            className="w-full h-full object-cover filter brightness-105 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 text-[10px] text-white/90 font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-[#FF5A00]" />
            <span>Neon Stage</span>
          </div>
        </motion.div>

        {/* MIDDLE CARD 1: TOP CENTER-LEFT (scale: 0.92, translateZ: -40px, -7deg) */}
        <motion.div
          ref={cardMid1Ref}
          animate={{ y: [4, -4, 4], rotate: [-7, -5, -7] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[18%] sm:left-[23%] lg:left-[26%] top-2 w-34 sm:w-44 md:w-52 h-40 sm:h-52 md:h-60 rounded-3xl overflow-hidden shadow-2xl border border-white/15 pointer-events-auto cursor-pointer z-20"
          style={{ transform: 'scale(0.92) translateZ(-40px) rotate(-7deg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
            alt="Music creators studio session"
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-white">Jam Room</span>
          </div>
        </motion.div>

        {/* CENTER PORTRAIT CARD: FOREGROUND ANCHOR (Lavender #DCCBE5 Card) */}
        <motion.div
          ref={cardCenterRef}
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-30 w-52 sm:w-64 md:w-72 h-64 sm:h-76 md:h-84 rounded-[32px] bg-[#DCCBE5] p-3 shadow-2xl border border-white/50 flex flex-col justify-between pointer-events-auto"
          style={{ transform: 'scale(1) translateZ(0px)' }}
        >
          <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-neutral-900 group">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
              alt="Female music creator"
              loading="eager"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />

            {/* Notification 1: Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl max-w-[150px] shadow-lg"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />
                <span className="text-[10px] font-bold text-white tracking-wide">LoraJason</span>
              </div>
              <p className="text-[11px] text-neutral-200 leading-tight font-medium">You're the inspiration!</p>
            </motion.div>

            {/* Notification 2: Middle Right */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="absolute top-24 right-2 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-2 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold text-[#FF8A00]">FLAC</span>
                <p className="text-[11px] font-medium text-white">Lossless Master Stream</p>
              </div>
            </motion.div>

            {/* Notification 3 / Interactive Heart Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-xl"
            >
              <button
                onClick={toggleHeart}
                className={`p-1.5 rounded-full transition-transform active:scale-125 cursor-pointer ${
                  liked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-white hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-xs font-bold text-white pr-1">{heartCount}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* MIDDLE CARD 2: TOP RIGHT (scale: 0.92, translateZ: -40px, +8deg) */}
        <motion.div
          ref={cardMid2Ref}
          animate={{ y: [5, -5, 5], rotate: [8, 6, 8] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[18%] sm:right-[23%] lg:right-[26%] top-4 w-34 sm:w-44 md:w-52 h-40 sm:h-52 md:h-60 rounded-3xl overflow-hidden shadow-2xl border border-white/15 pointer-events-auto cursor-pointer z-20"
          style={{ transform: 'scale(0.92) translateZ(-40px) rotate(8deg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop"
            alt="Producer in studio"
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
            <Music className="w-2.5 h-2.5 text-[#FF8A00]" />
            <span>Producer Suite</span>
          </div>
        </motion.div>

        {/* FAR CARD 2: FAR RIGHT (scale: 0.85, translateZ: -100px, +12deg) */}
        <motion.div
          ref={cardOuter2Ref}
          animate={{ y: [-5, 5, -5], rotate: [12, 14, 12] }}
          transition={{ duration: 6.0, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-2 sm:right-6 lg:right-10 top-6 w-28 sm:w-36 md:w-44 h-36 sm:h-48 md:h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/15 glass-card pointer-events-auto cursor-pointer z-10"
          style={{ transform: 'scale(0.85) translateZ(-100px) rotate(12deg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop"
            alt="Warm concert lights"
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 text-[10px] text-amber-300 font-medium px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-amber-500/20">
            Festival Night
          </div>
        </motion.div>

        {/* BOTTOM CORNER CARDS */}
        <motion.div
          ref={cardBottom1Ref}
          animate={{ y: [3, -3, 3], rotate: [-10, -12, -10] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden lg:block absolute left-8 -bottom-4 w-36 h-36 rounded-3xl overflow-hidden border border-white/15 shadow-2xl z-15 pointer-events-auto cursor-pointer opacity-80"
          style={{ transform: 'scale(0.88) rotate(-10deg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=500&auto=format&fit=crop"
            alt="Crowd music experience"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          ref={cardBottom2Ref}
          animate={{ y: [-4, 4, -4], rotate: [10, 12, 10] }}
          transition={{ duration: 7.0, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden lg:block absolute right-8 -bottom-4 w-36 h-36 rounded-3xl overflow-hidden border border-white/15 shadow-2xl z-15 pointer-events-auto cursor-pointer opacity-80"
          style={{ transform: 'scale(0.88) rotate(10deg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=500&auto=format&fit=crop"
            alt="Vinyl DJ session"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* ==================================================
          MAIN HERO HEADLINE & TEXT CONTENT
          ================================================== */}
      <div className="text-center max-w-4xl mx-auto z-20 mt-4 space-y-6">
        <h1
          ref={headingRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[115px] font-black text-[#F5F5F5] tracking-tighter leading-[0.88] select-text"
          style={{
            fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.055em',
          }}
        >
          Music's<br />
          Social Media
        </h1>

        <div ref={subtextRef} className="space-y-6">
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-normal max-w-xl mx-auto leading-relaxed">
            Creators deserve better. Fans deserve more. Tunease is the all-in-one lossless streaming & social ecosystem built for both.
          </p>

          {/* INTERACTIVE SOUNDWAVE PREVIEW PILL */}
          <div className="inline-flex items-center gap-3 p-2 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-xl">
            <button
              onClick={() => setIsPlayingDemo(!isPlayingDemo)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isPlayingDemo
                  ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/50'
                  : 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20'
              }`}
              title="Preview Spatial Audio Demo"
            >
              {isPlayingDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
            </button>

            {/* Realtime equalizer waveform bars */}
            <div className="flex items-end gap-1 h-6 px-1">
              {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 50, 100].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlayingDemo ? 'bg-gradient-to-t from-[#FF5A00] to-[#FFA000]' : 'bg-neutral-600'
                  }`}
                  style={{
                    height: isPlayingDemo ? `${Math.max(15, (height * (Math.sin(i + (Date.now() / 300)) + 1.2)) / 2)}%` : '20%',
                  }}
                />
              ))}
            </div>

            <div className="text-left pr-2">
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-3 h-3 text-[#FF7A00]" />
                <span>{activeAudioPreset}</span>
              </div>
              <span className="text-[9px] text-neutral-400 font-mono">
                {isPlayingDemo ? 'Streaming at 1,411 kbps' : 'Click Play to Test Engine'}
              </span>
            </div>
          </div>

          {/* CTA ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={MUSIC_APP_URL}
              className="w-[230px] h-[52px] rounded-full bg-gradient-to-r from-[#FF5A00] via-[#FF7A00] to-[#FF8A00] text-white font-extrabold text-sm shadow-xl shadow-[#FF5A00]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Launch Tunease App</span>
            </a>

            <button
              onClick={onOpenWaitlist}
              className="w-[200px] h-[52px] rounded-full border border-neutral-600 bg-transparent text-white font-medium text-sm hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Join VIP Waitlist</span>
              <Sparkles className="w-4 h-4 text-[#FF5A00] group-hover:text-black transition-colors" />
            </button>
          </div>

          {/* QUICK CREDENTIALS TICKER */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-[11px] text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Artist Royalties
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#FF7A00]" />
              Zero Platform Fee Cuts
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Lossless 24-Bit FLAC Engine
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
