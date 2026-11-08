import Image from "next/image";

const blurPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='black'/%3E%3C/svg%3E";

export default function StudioCover({ label, imageUrl, className = "", priority = false }: { label: string; imageUrl?: string; className?: string; priority?: boolean }) {
  return <span className={`studio-cover-mini ${className}`} aria-hidden="true">{imageUrl ? <Image src={imageUrl} alt="" width={128} height={128} unoptimized sizes="38px" placeholder="blur" blurDataURL={blurPlaceholder} priority={priority} className="absolute inset-0 size-full object-cover"/> : <span className="font-display text-sm font-semibold text-muted">{label.slice(0, 1).toUpperCase()}</span>}</span>;
}
