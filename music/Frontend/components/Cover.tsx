"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const blurPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='black'/%3E%3C/svg%3E";

export default function Cover({ id, coverUrl, className = "", layoutId, priority = false }: { id: string; coverUrl?: string; className?: string; layoutId?: string; priority?: boolean }) {
  return (
    <motion.div layoutId={layoutId} className={`relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-lime/80 via-elevated to-bg ${className}`} aria-hidden="true">
      {coverUrl ? <Image src={coverUrl} alt="" width={640} height={640} unoptimized sizes="(max-width: 768px) 45vw, (max-width: 1280px) 20vw, 220px" placeholder="blur" blurDataURL={blurPlaceholder} priority={priority} className="absolute inset-0 size-full object-cover" /> : (
        <span className="absolute inset-0 grid place-items-center font-display text-3xl font-semibold text-foreground/80">{id.slice(0, 1).toUpperCase()}</span>
      )}
    </motion.div>
  );
}
