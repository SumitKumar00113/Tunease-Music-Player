"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ColorTile from "@/components/ui/ColorTile";
import useLoopActive from "@/components/ui/useLoopActive";

const genres = [
  { name: "Ambient", color: "var(--color-lav)", cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80" },
  { name: "Electronic", color: "var(--color-lime)", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80" },
  { name: "Indie", color: "var(--color-red)", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80" },
  { name: "Jazz", color: "var(--color-muted)", cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=500&q=80" },
  { name: "Soul", color: "var(--color-sky)", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80" },
];

export default function HomeOrbit() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const active = useLoopActive(orbitRef);
  const controls = useAnimationControls();
  const scroll = useScroll({ target: orbitRef, offset: ["start end", "end start"] });
  const parallax = useTransform(scroll.scrollYProgress, [0, 1], [14, -14]);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (active && !reduceMotion) void controls.start({ rotate: 360, transition: { duration: 82, ease: "linear", repeat: Infinity } });
    else controls.stop();
    return () => controls.stop();
  }, [active, controls, reduceMotion]);

  return <motion.div ref={orbitRef} style={{ y: parallax }} aria-hidden="true" className="pointer-events-none absolute right-[-2rem] top-1/2 z-0 hidden size-[23rem] -translate-y-1/2 opacity-35 lg:block">
    <motion.div animate={controls} className="relative size-full rounded-full border border-line/80">
      <div className="absolute inset-5 rounded-full border border-lav/30" />
      {genres.map((genre, index) => {
        const positions = ["left-1/2 -top-4 -translate-x-1/2", "-right-4 top-[22%]", "-right-3 bottom-[18%]", "left-1/2 -bottom-4 -translate-x-1/2", "-left-4 top-1/2 -translate-y-1/2"];
        return <div key={genre.name} className={`absolute ${positions[index]}`}><ColorTile color={genre.color} coverSrc={genre.cover} className="size-[4.5rem] rounded-[18px] shadow-xl shadow-bg/60" /></div>;
      })}
    </motion.div>
  </motion.div>;
}
