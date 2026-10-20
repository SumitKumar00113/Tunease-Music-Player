"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Disc3, LayoutDashboard, ListMusic, Music2, Upload, UserRound } from "lucide-react";

const items = [
  { href: "/studio", label: "Overview", icon: LayoutDashboard },
  { href: "/studio/tracks", label: "My tracks", icon: ListMusic },
  { href: "/studio/upload", label: "Upload", icon: Upload },
  { href: "/studio/profile", label: "Profile", icon: UserRound },
];

const pageTitle = (pathname: string) => pathname === "/studio" ? "Overview" : pathname.startsWith("/studio/tracks") ? "My tracks" : pathname.startsWith("/studio/upload") ? "Upload track" : "Profile";

export default function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [artist, setArtist] = useState<{ name: string; photo?: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const title = pageTitle(pathname);
  useEffect(() => {
    let active = true;
    const verifyArtist = async () => {
      const token = window.localStorage.getItem("accessToken") || window.localStorage.getItem("token");
      const authApi = (process.env.NEXT_PUBLIC_AUTH_API_URL || "https://tunease-auth-service-latest.onrender.com/api/auth").replace(/\/$/, "");
      try {
        const response = await fetch(`${authApi}/me`, { credentials: "include", headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const payload: unknown = await response.json();
        if (!response.ok || typeof payload !== "object" || payload === null || !("user" in payload)) {
          router.replace("/");
          return;
        }
        const user = (payload as { user?: { role?: string; email?: string; profilePhoto?: string; fullName?: string | { firstName?: string; lastName?: string } } }).user;
        if (user?.role !== "artist") { router.replace("/"); return; }
        const displayName = typeof user.fullName === "string" ? user.fullName : [user.fullName?.firstName, user.fullName?.lastName].filter(Boolean).join(" ");
        if (active) setArtist({ name: displayName || user.email?.split("@")[0] || "Artist", photo: user.profilePhoto });
      } catch {
        router.replace("/");
      } finally {
        if (active) setChecking(false);
      }
    };
    void verifyArtist();
    return () => { active = false; };
  }, [router]);
  if (checking) return <div role="status" className="grid min-h-full place-items-center text-sm text-muted">Checking artist access…</div>;
  if (!artist) return null;
  return (
    <div className="studio-layout">
      <aside className="studio-sidebar">
        <Link className="studio-brand" href="/studio" aria-label="Tunease Studio home">
          <span className="grid size-9 place-items-center rounded-lg bg-studio text-white"><Music2 size={19}/></span>
          <span>Tunease <span className="studio-badge">Studio</span></span>
        </Link>
        <nav className="studio-nav" aria-label="Artist dashboard">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || href !== "/studio" && pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined}><Icon size={17}/><span>{label}</span>{label === "Upload" && <Upload className="ml-auto" size={14}/>}</Link>;
          })}
        </nav>
        <div className="studio-account">
          <span className="studio-account-avatar relative overflow-hidden" aria-hidden="true">{artist.photo ? <Image src={artist.photo} alt="" fill sizes="35px" unoptimized className="rounded-full object-cover"/> : artist.name.charAt(0).toUpperCase()}</span>
          <span className="studio-account-copy"><strong>{artist.name}</strong><Link href="/">Switch to listener app <ArrowUpRight className="ml-1 inline" size={12}/></Link></span>
        </div>
      </aside>
      <div className="studio-main">
        <header className="studio-topbar"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-studio text-white md:hidden"><Disc3 size={17}/></span><h1>{title}</h1></div>
          <div className="studio-top-actions">{pathname === "/studio" && <select aria-label="Analytics date range" className="studio-period" defaultValue="30"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>}{!pathname.startsWith("/studio/upload") && pathname !== "/studio/profile" && <Link className="studio-button studio-button-brand" href="/studio/upload"><Upload size={15}/> Upload track</Link>}<span className="studio-avatar" aria-label="Sumit Mahaseth">S</span></div>
        </header>
        {children}
      </div>
    </div>
  );
}
