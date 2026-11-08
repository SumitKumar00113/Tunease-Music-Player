"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Search, Library } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
];

export default function MobileNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  return (
    <nav aria-label="Mobile navigation" className="grid h-[64px] grid-cols-3 items-center gap-1 border-t border-line bg-bg px-2 md:hidden">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || href !== "/" && pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`relative isolate flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-semibold ${active ? "text-bg" : "text-muted"}`}>
            {active && <motion.span layoutId="mobile-active-pill" aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-lime" transition={{ type: "spring", bounce: 0.18, duration: reduceMotion ? 0 : 0.35 }} />}
            <Icon size={18} /><span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
