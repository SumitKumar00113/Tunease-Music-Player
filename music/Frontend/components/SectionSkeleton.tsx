export default function SectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading music" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse rounded-xl bg-surface p-3">
          <div className="aspect-square rounded-lg bg-elevated" />
          <div className="mt-3 h-3 w-3/4 rounded bg-elevated" />
          <div className="mt-2 h-3 w-1/2 rounded bg-elevated" />
        </div>
      ))}
    </div>
  );
}
