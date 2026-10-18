"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BarChart3, Disc3, LayoutDashboard, ListMusic, Music2, Upload, UserRound } from "lucide-react";

const items = [
  { href: "/studio", label: "Overview", icon: LayoutDashboard },
  { href: "/studio/tracks", label: "My tracks", icon: ListMusic },
  { href: "/studio/upload", label: "Upload", icon: Upload },
  { href: "/studio/profile", label: "Profile", icon: UserRound },
];

const pageTitle = (pathname: string) => pathname === "/studio" ? "Overview" : pathname.startsWith("/studio/tracks") ? "My tracks" : pathname.startsWith("/studio/upload") ? "Upload track" : "Profile";

export default function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = pageTitle(pathname);
  return (
    <div className="studio-layout">
      <aside className="studio-sidebar">
        <Link className="studio-brand" href="/studio" aria-label="Tunease Studio home">
          <span className="grid size-9 place-items-center rounded-lg bg-brand text-white"><Music2 size={19}/></span>
          <span>Tunease <span className="studio-badge">Studio</span></span>
        </Link>
        <nav className="studio-nav" aria-label="Artist dashboard">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || href !== "/studio" && pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined}><Icon size={17}/><span>{label}</span>{label === "Upload" && <Upload className="ml-auto" size={14}/>}</Link>;
          })}
        </nav>
        <div className="studio-account">
          <span className="studio-account-avatar" aria-hidden="true">S</span>
          <span className="studio-account-copy"><strong>Sumit Mahaseth</strong><Link href="/">Switch to listener app <ArrowUpRight className="ml-1 inline" size={12}/></Link></span>
        </div>
      </aside>
      <div className="studio-main">
        <header className="studio-topbar"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-brand text-white md:hidden"><Disc3 size={17}/></span><h1>{title}</h1></div>
          <div className="studio-top-actions">{pathname === "/studio" && <select aria-label="Analytics date range" className="studio-period" defaultValue="30"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>}{!pathname.startsWith("/studio/upload") && pathname !== "/studio/profile" && <Link className="studio-button studio-button-brand" href="/studio/upload"><Upload size={15}/> Upload track</Link>}<span className="studio-avatar" aria-label="Sumit Mahaseth">S</span></div>
        </header>
        {children}
      </div>
    </div>
  );
}
