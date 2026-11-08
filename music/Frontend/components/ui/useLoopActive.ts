"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function useLoopActive<T extends Element>(ref: RefObject<T | null>) {
  const inView = useInView(ref, { amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const [tabVisible, setTabVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setTabVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return inView && tabVisible && !reduceMotion;
}
