import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Headphones, Sliders, Volume2, Activity, Disc3, Radio, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ExperienceSection Component
 * High-definition Spatial Audio simulation engine with EQ frequency sliders and 360° sound stage
 */
export const ExperienceSection = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);

  const [activePreset, setActivePreset] = useState('spatial');
  const [bassGain, setBassGain] = useState(8.5);
  const [vocalPresence, setVocalPresence] = useState(6.0);
  const [trebleAir, setTrebleAir] = useState(9.2);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 0.2,
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

  const presets = [
    {
      id: 'spatial',
      label: '360° Spatial Audio',
      desc: 'Dynamic head-tracking sound placement with ultra-wide stereo panorama',
      icon: Headphones,
      bass: 8.5,
      vocal: 6.0,
      treble: 9.2,
    },
    {
      id: 'studio',
      label: 'FLAC Studio Master',
      desc: 'Bit-perfect transparent frequency response for purist studio monitoring',
      icon: Activity,
      bass: 5.0,
      vocal: 5.0,
      treble: 5.0,
    },
    {
      id: 'arena',
      label: 'Live Arena Concert',
      desc: 'Stadium acoustic impulse modeling with deep reverberation and sub-bass',
      icon: Radio,
      bass: 10.0,
      vocal: 7.5,
      treble: 8.0,
    },
    {
      id: 'vinyl',
      label: 'Warm Analog Tape',
      desc: 'Tube warmth, analog 2nd-order harmonic saturation, and vintage roll-off',
      icon: Disc3,
      bass: 7.0,
      vocal: 8.0,
      treble: 4.5,
    },
  ];

  const handleSelectPreset = (p) => {
    setActivePreset(p.id);
    setBassGain(p.bass);
    setVocalPresence(p.vocal);
    setTrebleAir(p.treble);
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full min-h-[90vh] bg-[#FAFAFA] text-black py-24 sm:py-32 px-6 rounded-[36px] my-10 transition-colors duration-700 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Editorial subtle light glow and texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/70 via-white to-neutral-200/60 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF5A00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full space-y-12 text-center">
        {/* HEADLINE */}
        <div ref={headlineRef} className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.06] border border-black/10 text-xs font-bold uppercase tracking-wider text-neutral-800">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Proprietary Spatial DSP Engine</span>
          </div>

          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-black tracking-tighter leading-[1.02]"
            style={{
              fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.04em',
            }}
          >
            <span className="text-[#111111] block">Experience Music</span>
            <span className="text-[#666666] block font-extrabold">Beyond the Screen</span>
          </h2>
        </div>

        <p
          ref={descriptionRef}
          className="text-sm sm:text-base md:text-lg text-neutral-600 font-normal max-w-2xl mx-auto leading-relaxed"
        >
          Tunease combines 24-bit/96kHz lossless streaming with 3D binaural modeling. Adjust acoustic profiles, engage spatial head tracking, and feel live audio like you're in the front row.
        </p>

        {/* ==================================================
            INTERACTIVE AUDIO WORKSTATION BENCH
            ================================================== */}
        <div className="bg-white border border-black/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.08)] rounded-[32px] p-6 sm:p-8 text-left space-y-8">
          
          {/* TOP PRESET SELECTOR TABS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl shadow-black/15 scale-[1.02]'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#FF7A00]' : 'text-neutral-500'}`} />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-ping" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{preset.label}</h4>
                    <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {preset.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* REALTIME SOUND WAVE VISUALIZER & EQUALIZER CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4 border-t border-neutral-100">
            
            {/* LEFT: 3D SPATIAL STAGE ORBIT */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-neutral-900 text-white rounded-2xl relative overflow-hidden min-h-[220px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A00]/15 via-transparent to-purple-500/10 pointer-events-none" />
              
              {/* Rotating Orbit Rings */}
              <div className="relative w-36 h-36 rounded-full border border-white/20 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full border border-dashed border-[#FF7A00]/50 ${
                    isRotating ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '14s' }}
                />
                
                {/* Center Listener Head */}
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg font-black text-xs">
                  YOU
                </div>

                {/* Orbiting Sound Source 1 */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FF5A00] flex items-center justify-center shadow-md animate-pulse"
                  title="Front Left Studio Monitor"
                >
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Orbiting Sound Source 2 */}
                <div
                  className="absolute -bottom-2 right-4 w-5 h-5 rounded-full bg-[#FFA000] flex items-center justify-center shadow-md"
                  title="Subwoofer"
                >
                  <span className="text-[8px] font-bold text-black">SUB</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="font-mono text-neutral-400 text-[11px]">360° Binaural Orbit</span>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-white font-medium"
                >
                  {isRotating ? 'Pause Orbit' : 'Resume Orbit'}
                </button>
              </div>
            </div>

            {/* RIGHT: LIVE EQ FREQUENCY SLIDERS */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-neutral-800" />
                  Frequency Gain Architecture
                </span>
                <span className="text-[11px] font-mono font-bold text-[#FF5A00]">
                  Latency: 1.8ms | FLAC 24-bit
                </span>
              </div>

              {/* Slider 1: Bass / Sub (60Hz) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-700">
                  <span>Sub & Low Punch (60Hz)</span>
                  <span className="font-mono text-neutral-900">+{bassGain.toFixed(1)} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={bassGain}
                  onChange={(e) => setBassGain(parseFloat(e.target.value))}
                  className="w-full accent-[#FF5A00] bg-neutral-200 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Vocals & Mid Clarity (3kHz) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-700">
                  <span>Vocal Presence (3 kHz)</span>
                  <span className="font-mono text-neutral-900">+{vocalPresence.toFixed(1)} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={vocalPresence}
                  onChange={(e) => setVocalPresence(parseFloat(e.target.value))}
                  className="w-full accent-[#FF5A00] bg-neutral-200 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: High Air & Spatial Sparkle (16kHz) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-700">
                  <span>Air & Spatial Sparkle (16 kHz)</span>
                  <span className="font-mono text-neutral-900">+{trebleAir.toFixed(1)} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={trebleAir}
                  onChange={(e) => setTrebleAir(parseFloat(e.target.value))}
                  className="w-full accent-[#FF5A00] bg-neutral-200 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Divider */}
        <div className="pt-4 flex justify-center items-center gap-3 text-xs tracking-widest uppercase text-neutral-400 font-bold">
          <span className="w-12 h-[1px] bg-neutral-300" />
          <span>Real World Connections • Lossless 24-Bit Sound</span>
          <span className="w-12 h-[1px] bg-neutral-300" />
        </div>
      </div>
    </section>
  );
};
