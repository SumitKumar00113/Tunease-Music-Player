export default function StudioCover({ label, imageUrl, className = "" }: { label: string; imageUrl?: string; className?: string }) {
  return <span className={`studio-cover-mini ${className}`} aria-hidden="true">{imageUrl ? <img src={imageUrl} alt=""/> : <span className="font-display text-sm font-semibold text-muted">{label.slice(0, 1).toUpperCase()}</span>}</span>;
}
