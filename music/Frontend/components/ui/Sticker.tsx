"use client";

import { useEffect, useState, type CSSProperties, type HTMLAttributes } from "react";

type StickerProps = HTMLAttributes<HTMLSpanElement> & {
  rotation?: number;
};

export default function Sticker({ rotation, className = "", style, children, ...props }: StickerProps) {
  const [randomRotation, setRandomRotation] = useState(0);

  useEffect(() => {
    if (rotation === undefined) {
      const frame = window.requestAnimationFrame(() => setRandomRotation(Math.random() * 12 - 6));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [rotation]);

  const tilt = Math.max(-6, Math.min(6, rotation ?? randomRotation));

  return (
    <span
      className={`inline-flex w-fit rotate-[var(--sticker-tilt)] items-center rounded-full bg-text px-4 py-2 text-xs font-extrabold text-bg shadow-lg shadow-black/20 transition-transform duration-200 hover:rotate-0 ${className}`}
      style={{ ...style, "--sticker-tilt": `${tilt}deg` } as CSSProperties}
      {...props}
    >
      {children}
    </span>
  );
}
