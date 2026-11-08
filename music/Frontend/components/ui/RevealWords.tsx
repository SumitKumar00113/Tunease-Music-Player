"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function RevealWords({ children, className = "" }: { children: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <span className={className}>{children}</span>;

  return (
    <span className={className}>
      {children.split(/(\s+)/).map((part, index) => part.trim() ? (
        <motion.span key={`${part}-${index}`} className="inline-block" initial={{ y: 5, opacity: 0.82 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, delay: index * 0.07, ease: "easeOut" }}>{part}</motion.span>
      ) : part)}
    </span>
  );
}
