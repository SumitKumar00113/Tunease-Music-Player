import Image from "next/image";

export default function StudioCover({ label, imageUrl, className = "" }: { label: string; imageUrl?: string; className?: string }) {
  return <span className={`studio-cover-mini ${className}`} aria-hidden="true">{imageUrl ? <Image src={imageUrl} alt="" fill unoptimized sizes="38px" loading="lazy" className="object-cover"/> : <span className="font-display text-sm font-semibold text-muted">{label.slice(0, 1).toUpperCase()}</span>}</span>;
}
