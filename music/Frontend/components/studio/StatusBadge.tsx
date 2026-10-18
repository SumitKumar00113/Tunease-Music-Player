import type { StudioTrackStatus } from "@/lib/mock";

export default function StatusBadge({ status }: { status: StudioTrackStatus }) {
  const className = status === "Live" ? "status-live" : status === "Processing" ? "status-processing" : status === "Scheduled" ? "status-scheduled" : "status-draft";
  return <span className={`studio-status ${className}`}>{status}</span>;
}
