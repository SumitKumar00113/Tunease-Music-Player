"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const blurPlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJiIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI4Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMWMxNjEyIiBmaWx0ZXI9InVybCgjYikiLz48L3N2Zz4=";

export default function Cover({ id, coverUrl, className = "", layoutId, priority = false }: { id: string; coverUrl?: string; className?: string; layoutId?: string; priority?: boolean }) {
  return (
    <motion.div layoutId={layoutId} className={`relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-accent/80 via-elevated to-bg ${className}`} aria-hidden="true">
      {coverUrl ? <Image src={coverUrl} alt="" fill unoptimized sizes="(max-width: 768px) 45vw, (max-width: 1280px) 20vw, 220px" placeholder="blur" blurDataURL={blurPlaceholder} loading={priority ? "eager" : "lazy"} className="object-cover" /> : (
        <span className="absolute inset-0 grid place-items-center font-display text-3xl font-semibold text-foreground/80">{id.slice(0, 1).toUpperCase()}</span>
      )}
    </motion.div>
  );
}
