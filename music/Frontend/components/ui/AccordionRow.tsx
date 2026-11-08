"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";

type AccordionRowProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  accent?: "lime" | "lavender";
  onOpenChange?: (open: boolean) => void;
};

export default function AccordionRow({ title, children, defaultOpen = false, open, accent = "lime", onOpenChange }: AccordionRowProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();
  const contentId = useId();
  const isOpen = open ?? internalOpen;
  const accentClasses = accent === "lavender" ? "border-lav bg-lav" : "border-lime bg-lime";

  const toggle = () => {
    const nextOpen = !isOpen;
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <div className={`overflow-hidden rounded-[20px] border transition-colors ${isOpen ? `${accentClasses} text-bg` : "border-line bg-surface text-foreground"}`}>
      <div className="flex min-h-16 items-center justify-between gap-4 px-5 py-3">
        <h3 className="m-0 text-lg font-extrabold leading-tight">{title}</h3>
        <button
          type="button"
          aria-label={`${isOpen ? "Close" : "Open"} ${title}`}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={toggle}
          className={`grid size-9 shrink-0 place-items-center rounded-full border text-2xl leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${isOpen ? "border-bg/20 text-bg hover:bg-bg/10" : `border-line ${accent === "lavender" ? "text-lav" : "text-lime"} hover:bg-elevated`}`}
        >
          <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
