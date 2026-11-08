"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { studioStats, studioTracks } from "@/lib/mock";
import StudioCover from "./StudioCover";
import StatusBadge from "./StatusBadge";

const PlaysChart = dynamic(() => import("./PlaysChart"), { ssr: false, loading: () => <div aria-hidden="true" className="studio-card studio-panel min-h-[280px]"><div className="h-5 w-36 animate-pulse rounded bg-elevated"/><div className="mt-6 h-[190px] animate-pulse rounded bg-elevated"/></div> });

function CountUp({ value }: { value: string }) {
  const reduceMotion = useReducedMotion();
  const target = Number(value.replace(/,/g, ""));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(target);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(count, target, { from: Math.round(target * 0.68), duration: 0.9, ease: "easeOut" });
    return controls.stop;
  }, [count, inView, reduceMotion, target]);
  return <motion.span ref={ref} className="tabular-nums">{rounded}</motion.span>;
}

export default function StudioOverview() {
  const reduceMotion = useReducedMotion();
  const topTracks = [...studioTracks].filter((track) => track.status === "Live").sort((a, b) => b.plays - a.plays).slice(0, 5);
  return <div className="studio-content">
    <div className="studio-stats">{studioStats.map((stat, index) => <motion.article key={stat.label} initial={reduceMotion ? false : { y: 10 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.15 }} whileHover={reduceMotion ? undefined : { y: -4, rotate: index % 2 ? 1 : -1 }} transition={{ duration: 0.3, delay: reduceMotion ? 0 : index * 0.07 }} className="studio-card studio-stat"><p>{stat.label}</p><strong><CountUp value={stat.value}/></strong><small>{stat.change}</small></motion.article>)}</div>
    <div className="studio-overview-grid">
      <PlaysChart />
      <section className="studio-card studio-panel" aria-labelledby="studio-top-tracks"><div className="studio-panel-heading"><h2 id="studio-top-tracks">Top tracks</h2><BarChart3 size={17} className="text-muted"/></div>{topTracks.map((track, index) => <div className="studio-top-track" key={track.id}><span className="studio-rank">{index + 1}</span><StudioCover label={track.title} imageUrl={track.coverUrl} priority={index === 0}/><span className="studio-track-copy"><strong>{track.title}</strong><small>{track.album}</small></span><span className="studio-track-plays">{track.plays.toLocaleString()}</span></div>)}</section>
    </div>
    <section className="studio-card studio-recent" aria-labelledby="studio-recent-title">
      <div className="studio-panel-heading"><h2 id="studio-recent-title">Recent uploads</h2><Link href="/studio/tracks" className="text-xs text-muted transition hover:text-foreground">View all tracks <ArrowRight className="ml-1 inline" size={13}/></Link></div>
      <div className="studio-recent-row studio-recent-head" aria-hidden="true"><span>TRACK</span><span>STATUS</span><span className="text-right">PLAYS</span></div>
      {studioTracks.slice(0, 4).map((track, index) => <div key={track.id} className="studio-recent-row"><div className="studio-row-track"><StudioCover label={track.title} imageUrl={track.coverUrl} priority={index === 0}/><span className="studio-track-copy"><strong>{track.title}</strong><small>{track.album}</small></span></div><StatusBadge status={track.status}/><span className="studio-track-plays text-right">{track.plays.toLocaleString()} plays</span></div>)}
    </section>
  </div>;
}
