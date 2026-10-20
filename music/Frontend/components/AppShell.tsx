"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";
import PlayerBar from "./PlayerBar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import RateLimitToast from "./RateLimitToast";

const RightPanel = dynamic(() => import("./RightPanel"), { loading: () => <aside aria-hidden="true" className="hidden border-l border-line bg-surface xl:block" /> });

export default function AppShell({ children }: { children: ReactNode }) {
  const isStudio = usePathname().startsWith("/studio");
  return (
    <div className={`app-shell ${isStudio ? "studio-mode" : "listener-mode"}`}>
      <div className="app-grid">
        {!isStudio && <Sidebar />}
        <div className="listener-center">
          {!isStudio && <TopBar />}
          <main className={isStudio ? "studio-route" : "listener-route"}>{children}</main>
        </div>
        {!isStudio && <RightPanel />}
      </div>
      {!isStudio && <MobileNav />}
      <div className="persistent-player"><PlayerBar /></div>
      <RateLimitToast />
    </div>
  );
}
