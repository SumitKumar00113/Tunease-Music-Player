"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Cover from "./Cover";
import useLoopActive from "@/components/ui/useLoopActive";

export default function VinylVisual({ id, coverUrl, isPlaying }: { id: string; coverUrl?: string; isPlaying: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useLoopActive(ref);
  const controls = useAnimationControls();
  useEffect(() => {
    if (isPlaying && active) void controls.start({ rotate: 360, transition: { duration: 9, ease: "linear", repeat: Infinity } });
    else controls.stop();
    return () => controls.stop();
  }, [active, controls, isPlaying]);
  return <div className="relative mx-auto grid aspect-square w-full max-w-[280px] place-items-center overflow-hidden rounded-[28px] bg-bg">
    <div aria-hidden="true" className="vinyl-glow absolute inset-[12%] rounded-full" />
    <motion.div ref={ref} aria-hidden="true" animate={controls} className="vinyl-disc relative z-10 aspect-square w-[84%] rounded-full border border-line shadow-2xl shadow-black/60">
      <Cover id={id} coverUrl={coverUrl} className="absolute left-1/2 top-1/2 size-[35%] -translate-x-1/2 -translate-y-1/2 !rounded-full border-2 border-elevated shadow-lg" />
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-text shadow-sm" />
    </motion.div>
  </div>;
}
