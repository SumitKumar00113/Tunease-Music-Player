import type { CSSProperties, HTMLAttributes } from "react";

type SquircleAvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  ringColor?: string;
  imageSrc?: string;
};

export default function SquircleAvatar({ name, ringColor = "var(--color-lime)", imageSrc, className = "", style, ...props }: SquircleAvatarProps) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const avatarStyle = {
    ...style,
    borderColor: ringColor,
    ...(imageSrc ? { backgroundImage: `url("${imageSrc}")` } : {}),
  } as CSSProperties;

  return (
    <div
      role="img"
      aria-label={name}
      className={`grid size-16 shrink-0 place-items-center rounded-[24px] border-2 bg-elevated bg-cover bg-center font-display text-xl font-extrabold text-foreground ${className}`}
      style={avatarStyle}
      {...props}
    >
      {!imageSrc && initials}
    </div>
  );
}
