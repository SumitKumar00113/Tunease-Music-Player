import type { CSSProperties, HTMLAttributes } from "react";
import Image from "next/image";

const blurPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='black'/%3E%3C/svg%3E";

type SquircleAvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  ringColor?: string;
  imageSrc?: string;
  priority?: boolean;
};

export default function SquircleAvatar({ name, ringColor = "var(--color-lime)", imageSrc, priority = false, className = "", style, ...props }: SquircleAvatarProps) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const avatarStyle = {
    ...style,
    borderColor: ringColor,
  } as CSSProperties;

  return (
    <div
      role="img"
      aria-label={name}
      className={`relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-[24px] border-2 bg-elevated bg-cover bg-center font-display text-xl font-extrabold text-foreground ${className}`}
      style={avatarStyle}
      {...props}
    >
      {imageSrc ? <Image src={imageSrc} alt="" width={160} height={160} unoptimized sizes="80px" placeholder="blur" blurDataURL={blurPlaceholder} priority={priority} className="absolute inset-0 size-full rounded-[inherit] object-cover" /> : initials}
    </div>
  );
}
