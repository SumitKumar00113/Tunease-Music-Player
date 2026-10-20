"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export default function RateLimitToast() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const onLimit = (event: Event) => {
      const custom = event as CustomEvent<{ retryAfter?: number }>;
      const waitSeconds = Math.max(1, custom.detail?.retryAfter || 1);
      setSeconds(waitSeconds);
      const controls = Array.from(document.querySelectorAll<HTMLButtonElement>("button[data-rate-limited-action]"));
      const wasDisabled = controls.map((button) => button.disabled);
      controls.forEach((button) => { button.disabled = true; });
      window.setTimeout(() => controls.forEach((button, index) => { button.disabled = wasDisabled[index]; }), waitSeconds * 1000);
    };
    window.addEventListener("tunease:rate-limit", onLimit);
    return () => window.removeEventListener("tunease:rate-limit", onLimit);
  }, []);
  useEffect(() => {
    if (!seconds) return;
    const timer = window.setTimeout(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);
  if (!seconds) return null;
  return <div role="status" aria-live="polite" className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-elevated px-4 py-2 text-xs text-foreground shadow-xl md:bottom-24"><Clock3 size={14} className="text-accent-2"/><span>Too many requests. Retrying in {seconds}s</span></div>;
}
