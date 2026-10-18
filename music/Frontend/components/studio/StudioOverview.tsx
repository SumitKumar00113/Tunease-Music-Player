"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { studioActivity, studioStats, studioTracks } from "@/lib/mock";
import StudioCover from "./StudioCover";
import StatusBadge from "./StatusBadge";

function PlaysChart() {
  const [metric, setMetric] = useState<"plays" | "listeners">("plays");
  const values = studioActivity[metric];
  const points = values.map((value, index) => `${index * (100 / (values.length - 1))},${100 - value}`).join(" ");
  return <section className="studio-card studio-panel" aria-labelledby="plays-chart-title">
    <div className="studio-panel-heading"><h2 id="plays-chart-title">Plays over time</h2><div className="studio-toggle" aria-label="Chart metric">{(["plays", "listeners"] as const).map((value) => <button type="button" key={value} aria-pressed={metric === value} onClick={() => setMetric(value)}>{value === "plays" ? "Plays" : "Listeners"}</button>)}</div></div>
    <div className="studio-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`${metric === "plays" ? "Plays" : "Listeners"} across the last 30 days`}><defs><linearGradient id="studioChartGradient" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="var(--color-accent)"/><stop offset="100%" stopColor="var(--color-accent-2)"/></linearGradient><linearGradient id="studioChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-accent)" stopOpacity=".2"/><stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0"/></linearGradient></defs><g className="studio-chart-grid"><line x1="0" y1="20" x2="100" y2="20"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="0" y1="80" x2="100" y2="80"/></g><polygon points={`0,100 ${points} 100,100`} fill="url(#studioChartFill)"/><polyline className="studio-chart-path" points={points}/></svg></div><div className="studio-chart-labels"><span>Day 1</span><span>Day 10</span><span>Day 20</span><span>Day 30</span></div>
  </section>;
}

export default function StudioOverview() {
  const topTracks = [...studioTracks].filter((track) => track.status === "Live").sort((a, b) => b.plays - a.plays).slice(0, 5);
  return <div className="studio-content">
    <div className="studio-stats">{studioStats.map((stat) => <article key={stat.label} className="studio-card studio-stat"><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.change}</small></article>)}</div>
    <div className="studio-overview-grid">
      <PlaysChart />
      <section className="studio-card studio-panel" aria-labelledby="studio-top-tracks"><div className="studio-panel-heading"><h2 id="studio-top-tracks">Top tracks</h2><BarChart3 size={17} className="text-muted"/></div>{topTracks.map((track, index) => <div className="studio-top-track" key={track.id}><span className="studio-rank">{index + 1}</span><StudioCover label={track.title} imageUrl={track.coverUrl}/><span className="studio-track-copy"><strong>{track.title}</strong><small>{track.album}</small></span><span className="studio-track-plays">{track.plays.toLocaleString()}</span></div>)}</section>
    </div>
    <section className="studio-card studio-recent" aria-labelledby="studio-recent-title"><div className="studio-panel-heading"><h2 id="studio-recent-title">Recent uploads</h2><Link href="/studio/tracks" className="text-xs text-muted transition hover:text-foreground">View all tracks <ArrowRight className="ml-1 inline" size={13}/></Link></div>{studioTracks.slice(0, 4).map((track) => <div key={track.id} className="studio-recent-row"><div className="studio-row-track"><StudioCover label={track.title} imageUrl={track.coverUrl}/><span className="studio-track-copy"><strong>{track.title}</strong><small>{track.album}</small></span></div><StatusBadge status={track.status}/><span className="studio-track-plays text-right">{track.plays.toLocaleString()} plays</span></div>)}</section>
  </div>;
}
