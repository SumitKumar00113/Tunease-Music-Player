"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";
import PlayerBar from "./PlayerBar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

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
    </div>
  );
}
