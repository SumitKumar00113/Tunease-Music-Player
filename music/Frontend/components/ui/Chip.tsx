import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { motion } from "framer-motion";
import useMagneticPull from "./useMagneticPull";

type ChipProps = Omit<ComponentPropsWithoutRef<typeof motion.button>, "aria-pressed"> & {
  active?: boolean;
};

export default function Chip({ active = false, className = "", children, ...props }: ChipProps) {
  const magnetic = useMagneticPull();
  const { style, onPointerMove, onPointerLeave, ...buttonProps } = props;
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${active ? "border-lime bg-lime text-bg" : "border-line bg-surface text-foreground hover:bg-elevated"} ${className}`}
      style={{ ...magnetic.style, ...style }}
      onPointerMove={(event: PointerEvent<HTMLButtonElement>) => { magnetic.onPointerMove(event); onPointerMove?.(event); }}
      onPointerLeave={(event: PointerEvent<HTMLButtonElement>) => { magnetic.onPointerLeave(); onPointerLeave?.(event); }}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
