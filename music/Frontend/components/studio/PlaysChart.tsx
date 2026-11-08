"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { studioActivity } from "@/lib/mock";

export default function PlaysChart() {
  const [metric, setMetric] = useState<"plays" | "listeners">("plays");
  const reduceMotion = useReducedMotion();
  const values = studioActivity[metric];
  const points = values.map((value, index) => `${index * (100 / (values.length - 1))},${100 - value}`).join(" ");
  return <motion.section initial={reduceMotion ? false : { y: 10 }} whileInView={reduceMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.3 }} className="studio-card studio-panel" aria-labelledby="plays-chart-title">
    <div className="studio-panel-heading"><h2 id="plays-chart-title">Plays over time</h2><div className="studio-toggle" aria-label="Chart metric">{(["plays", "listeners"] as const).map((value) => <button type="button" key={value} aria-pressed={metric === value} onClick={() => setMetric(value)}>{value === "plays" ? "Plays" : "Listeners"}</button>)}</div></div>
    <div className="studio-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`${metric === "plays" ? "Plays" : "Listeners"} across the last 30 days`}><defs><linearGradient id="studioChartGradient" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="var(--color-lime)"/><stop offset="100%" stopColor="var(--color-lav)"/></linearGradient><linearGradient id="studioChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-lime)" stopOpacity=".2"/><stop offset="100%" stopColor="var(--color-lime)" stopOpacity="0"/></linearGradient></defs><g className="studio-chart-grid"><line x1="0" y1="20" x2="100" y2="20"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="0" y1="80" x2="100" y2="80"/></g><polygon points={`0,100 ${points} 100,100`} fill="url(#studioChartFill)"/><polyline className="studio-chart-path" points={points} opacity=".28"/><motion.polyline initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 1.15, ease: "easeInOut" }} className="studio-chart-path" points={points}/></svg></div><div className="studio-chart-labels"><span>Day 1</span><span>Day 10</span><span>Day 20</span><span>Day 30</span></div>
  </motion.section>;
}
