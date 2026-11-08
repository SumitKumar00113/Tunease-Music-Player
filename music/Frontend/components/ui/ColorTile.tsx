import type { CSSProperties, HTMLAttributes } from "react";
import Image from "next/image";

const blurPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='black'/%3E%3C/svg%3E";

type ColorTileProps = HTMLAttributes<HTMLDivElement> & {
  color: string;
  coverSrc?: string;
  label?: string;
  priority?: boolean;
};

export default function ColorTile({ color, coverSrc, label, priority = false, className = "", style, ...props }: ColorTileProps) {
  return (
    <div
      aria-label={label}
      className={`relative isolate aspect-square w-full max-w-48 overflow-hidden rounded-[28px] ${className}`}
      style={{ ...style, backgroundColor: color } as CSSProperties}
      {...props}
    >
      {coverSrc && (
        <div aria-hidden="true" className="absolute -right-3 -top-3 h-[68%] w-[68%] rotate-6 overflow-hidden rounded-[20px] shadow-2xl transition-transform duration-300 hover:rotate-0">
          <Image src={coverSrc} alt="" width={500} height={500} unoptimized sizes="(max-width: 768px) 36vw, 180px" placeholder="blur" blurDataURL={blurPlaceholder} priority={priority} className="size-full object-cover" />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}


