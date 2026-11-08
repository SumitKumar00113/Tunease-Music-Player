"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import useMagneticPull from "./useMagneticPull";

type ButtonVariant = "lime" | "lavender" | "ghost";
type ButtonProps = Omit<ComponentPropsWithoutRef<typeof motion.button>, "color"> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  lime: "border-lime bg-lime text-bg hover:brightness-105",
  lavender: "border-lav bg-lav text-bg hover:brightness-105",
  ghost: "border-line bg-transparent text-foreground hover:bg-elevated",
};

export default function Button({ variant = "lime", className = "", children, ...props }: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const magnetic = useMagneticPull();
  const { style, onPointerMove, onPointerLeave, ...buttonProps } = props;

  return (
    <motion.button
      type="button"
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      style={{ ...magnetic.style, ...style }}
      onPointerMove={(event: PointerEvent<HTMLButtonElement>) => { magnetic.onPointerMove(event); onPointerMove?.(event); }}
      onPointerLeave={(event: PointerEvent<HTMLButtonElement>) => { magnetic.onPointerLeave(); onPointerLeave?.(event); }}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
