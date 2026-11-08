"use client";

import { useCallback } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

export default function useMagneticPull() {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.25 });
  const y = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.25 });

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 8);
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 6);
  }, [rawX, rawY, reduceMotion]);

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { style: { x, y }, onPointerMove, onPointerLeave };
}
