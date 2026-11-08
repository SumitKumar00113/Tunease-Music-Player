"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";
import PlayerBar from "./PlayerBar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import RateLimitToast from "./RateLimitToast";

const RightPanel = dynamic(() => import("./RightPanel"), { loading: () => <aside aria-hidden="true" className="hidden border-l border-line bg-surface xl:block" /> });

const authApi = (process.env.NEXT_PUBLIC_AUTH_API_URL || "https://tunease-auth-service-latest.onrender.com/api/auth").replace(/\/$/, "");
const authLoginUrl = process.env.NEXT_PUBLIC_AUTH_LOGIN_URL || "https://tunease-auth-service-latest.onrender.com/login";

export default function AppShell({ children }: { children: ReactNode }) {
  const isStudio = usePathname().startsWith("/studio");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const handoffToken = hashParams.get("access_token");
      if (handoffToken) {
        window.localStorage.setItem("accessToken", handoffToken);
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }

      const token = handoffToken || window.localStorage.getItem("accessToken") || window.localStorage.getItem("token");
      const login = () => {
        const destination = new URL(authLoginUrl);
        destination.searchParams.set("returnTo", window.location.origin);
        window.location.replace(destination.toString());
      };
      const checkSession = (accessToken?: string | null) => fetch(`${authApi}/me`, {
        credentials: "include",
        cache: "no-store",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });

      try {
        let response = await checkSession(token);
        if (!response.ok && token) {
          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("token");
          response = await checkSession();
        }
        const payload: unknown = await response.json();
        if (!response.ok || typeof payload !== "object" || payload === null || !("user" in payload) || !payload.user) {
          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("token");
          if (active) login();
          return;
        }
        if (active) setAuthorized(true);
      } catch {
        if (active) login();
      }
    };

    void verifySession();
    return () => { active = false; };
  }, []);

  if (!authorized) {
    return <main role="status" className="grid h-dvh place-items-center bg-bg text-sm text-muted">Checking your Tunease session…</main>;
  }

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
