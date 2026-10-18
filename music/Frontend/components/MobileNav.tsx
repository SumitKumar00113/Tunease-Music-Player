"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Mobile navigation" className="grid h-[54px] grid-cols-3 border-t border-line bg-surface md:hidden">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || href !== "/" && pathname.startsWith(`${href}/`);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${active ? "text-accent-soft" : "text-muted"}`}><Icon size={18} /><span>{label}</span></Link>;
      })}
    </nav>
  );
}
