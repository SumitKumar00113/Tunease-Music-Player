import dynamic from "next/dynamic";

const StudioUpload = dynamic(() => import("@/components/studio/StudioUpload"), {
  loading: () => <div aria-label="Loading upload form" aria-busy="true" className="studio-content"><div className="h-10 animate-pulse rounded-lg bg-elevated"/><div className="grid gap-4 lg:grid-cols-[480px_1fr]"><div className="h-[420px] animate-pulse rounded-xl bg-surface"/><div className="h-[620px] animate-pulse rounded-xl bg-surface"/></div></div>,
});

export default function StudioUploadPage() {
  return <StudioUpload/>;
}
