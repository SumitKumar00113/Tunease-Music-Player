export default function Loading() {
  return (
    <div aria-label="Loading page" aria-busy="true" className="mx-auto w-full max-w-[1500px] space-y-8 motion-safe-rise">
      <div className="h-24 max-w-lg animate-pulse rounded-2xl bg-surface" />
      <section className="space-y-3"><div className="h-6 w-40 animate-pulse rounded bg-elevated" /><div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-elevated" />)}</div></section>
      <section className="space-y-3"><div className="h-6 w-48 animate-pulse rounded bg-elevated" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="animate-pulse rounded-xl bg-surface p-3"><div className="aspect-square rounded-lg bg-elevated"/><div className="mt-3 h-3 w-3/4 rounded bg-elevated"/></div>)}</div></section>
    </div>
  );
}
