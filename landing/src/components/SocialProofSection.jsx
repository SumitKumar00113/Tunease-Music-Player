import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Repeat, Share2, Verified, Sparkles, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SocialProofSection Component
 * Verified creator testimonials, press accolades, and interactive engagement cards
 */
export const SocialProofSection = () => {
  const [likes, setLikes] = useState([342, 891, 1204]);
  const [likedState, setLikedState] = useState([false, false, false]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.14,
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

  const toggleLike = (index) => {
    const newLikes = [...likes];
    const newLikedState = [...likedState];
    if (newLikedState[index]) {
      newLikes[index] -= 1;
      newLikedState[index] = false;
    } else {
      newLikes[index] += 1;
      newLikedState[index] = true;
    }
    setLikes(newLikes);
    setLikedState(newLikedState);
  };

  const handleShare = (index) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const posts = [
    {
      author: 'Maya Lin',
      handle: '@mayalin_music',
      role: 'Indie Pop Singer / Producer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      content: 'Tunease just dropped my secret studio session directly to my top 100 fans. The engagement rates are insane compared to traditional social apps! 🎶🔥',
      hashtags: '#TuneaseMusic #CreatorEconomy #IndieArtist',
      comments: 48,
      reposts: 112,
    },
    {
      author: 'Kaelen Thorne',
      handle: '@kaelen_sound',
      role: 'Modular Synth Composer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      content: 'Met 40 of my day-one listeners at the exclusive listening lounge last night. Real connections mean everything in 2026. Thank you @Tunease ✨',
      hashtags: '#RealLifeConnections #MusicFans #Tunease',
      comments: 94,
      reposts: 230,
    },
    {
      author: 'Aria Beats',
      handle: '@ariabeats_prod',
      role: 'Grammy-Nominated Mixing Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      content: 'Finally an app that treats artists as creators, not content algorithms. The fan demographics dashboard alone changed how I plan my tour!',
      hashtags: '#FutureOfMusic #TuneaseBeta',
      comments: 136,
      reposts: 410,
    },
  ];

  const pressQuotes = [
    {
      source: 'Billboard',
      quote: 'Tunease might just be the first platform to crack the direct artist-to-fan monetization puzzle without alienating listeners.',
    },
    {
      source: 'TechCrunch',
      quote: 'Audiophile grade 24-bit FLAC paired with real-time fan rooms sets a new high watermark for modern streaming.',
    },
    {
      source: 'Resident Advisor',
      quote: 'An essential leap forward for grassroots electronic musicians looking to break free of Spotify monopoly payouts.',
    },
  ];

  return (
    <section ref={sectionRef} className="relative w-full bg-[#080808] py-24 px-4 sm:px-8 rounded-[36px] my-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A00] px-3.5 py-1.5 rounded-full bg-[#FF5A00]/10 border border-[#FF5A00]/20">
            COMMUNITY BUZZ
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Loved by Artists. Powered by Fans.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto">
            See what verified music creators are saying about their new home on Tunease.
          </p>
        </div>

        {/* FEED CARDS */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-[#111113] border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-5 transition-all duration-300 hover:border-white/25 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-11 h-11 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{post.author}</span>
                        <Verified className="w-3.5 h-3.5 text-[#FF5A00] fill-[#FF5A00]/20" />
                      </div>
                      <span className="text-xs text-neutral-400 block">{post.handle}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                {/* Content */}
                <p className="text-neutral-200 text-sm leading-relaxed font-normal">
                  {post.content}
                </p>

                <p className="text-xs font-medium text-[#FF7A00]/90">
                  {post.hashtags}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <button
                  onClick={() => toggleLike(idx)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    likedState[idx] ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedState[idx] ? 'fill-current' : ''}`} />
                  <span>{likes[idx]}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Repeat className="w-4 h-4" />
                  <span>{post.reposts}</span>
                </div>

                <button
                  onClick={() => handleShare(idx)}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Share post link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              {copiedIndex === idx && (
                <div className="text-[10px] font-mono text-emerald-400 text-center animate-in fade-in">
                  Link copied to clipboard!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* PRESS QUOTES ROW */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pressQuotes.map((item, qIdx) => (
            <div key={qIdx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF7A00] font-mono">
                {item.source}
              </span>
              <p className="text-xs text-neutral-300 italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
