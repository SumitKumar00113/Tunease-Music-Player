"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RouteTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative min-h-full">
      {!reduceMotion && <motion.div
        key={`route-wipe-${pathname}`}
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-[-60vw] z-[100] w-[60vw] skew-x-[-10deg] bg-lime"
        initial={{ x: "-115%" }}
        animate={{ x: "285%" }}
        transition={{ duration: 0.35, ease: [0.72, 0, 0.24, 1] }}
      />}
      <motion.div key={`route-content-${pathname}`} initial={{ opacity: 0.82 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0.18 : 0.2, delay: reduceMotion ? 0 : 0.2 }}>
        {children}
      </motion.div>
    </div>
  );
}
