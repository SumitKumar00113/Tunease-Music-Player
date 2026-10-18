export default function Cover({ id, coverUrl, className = "" }: { id: string; coverUrl?: string; className?: string }) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-accent/80 via-elevated to-bg ${className}`} aria-hidden="true">
      {coverUrl ? <img src={coverUrl} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" /> : (
        <span className="absolute inset-0 grid place-items-center font-display text-3xl font-semibold text-foreground/80">{id.slice(0, 1).toUpperCase()}</span>
      )}
    </div>
  );
}
