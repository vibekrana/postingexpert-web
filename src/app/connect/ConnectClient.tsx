// src/app/connect/ConnectClient.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LinkedInConnectClient from "./linkedin/LinkedInConnectClient";
import { apiFetch } from "@/lib/api";
import { getToken, clearAuth } from "@/lib/auth";

type SocialDetail = Record<string, any> | null;

type SocialStatus = {
  instagram: boolean;
  linkedin: boolean;
  facebook: boolean;
  instagram_detail?: SocialDetail;
  linkedin_detail?: SocialDetail;
  facebook_detail?: SocialDetail;
  [k: string]: any;
};

type ProfileLite = {
  username?: string;
  email?: string;
  business_type?: string;
  connected_accounts?: number;
  posts_created?: number;
  scheduled_time?: string;
};

function getAppUser(profile?: ProfileLite | null) {
  return (
    profile?.username ||
    (typeof window !== "undefined" ? localStorage.getItem("username") : "") ||
    (typeof window !== "undefined" ? localStorage.getItem("registeredUserId") : "") ||
    ""
  );
}

/** Build Meta OAuth URL for Instagram Graph API (via Facebook OAuth dialog) */
function buildInstagramAuthUrl(appUser: string) {
  const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || "";
  const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || "";
  if (!clientId || !redirectUri) return null;

  const scopes = [
    "pages_show_list",
    "pages_read_engagement",
    "instagram_basic",
    "instagram_content_publish",
    "business_management",
  ];

  const url =
    "https://www.facebook.com/v21.0/dialog/oauth" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(appUser)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes.join(","))}`;

  return url;
}

function openCenteredPopup(url: string, title: string) {
  const w = 520;
  const h = 720;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top = window.screenY + (window.outerHeight - h) / 2;

  return window.open(
    url,
    title,
    `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,status=1`
  );
}

function isAuthErrorMessage(msg: string) {
  const m = (msg || "").toLowerCase();
  return (
    m.includes("401") ||
    m.includes("403") ||
    m.includes("unauthorized") ||
    m.includes("forbidden") ||
    m.includes("token") ||
    m.includes("authorization")
  );
}

export default function ConnectClient({
  profile,
  social,
}: {
  profile: ProfileLite | null;
  social: SocialStatus; // ✅ receives normalized social status from page.tsx
}) {
  const router = useRouter();

  // ✅ local copy so UI updates instantly
  const [localSocial, setLocalSocial] = useState<SocialStatus>(social);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLocalSocial(social);
  }, [social]);

  const appUser = useMemo(() => getAppUser(profile), [profile?.username]);

  const connectedCount = useMemo(() => {
    return [localSocial.instagram, localSocial.linkedin, localSocial.facebook].filter(Boolean)
      .length;
  }, [localSocial]);

  // ✅ re-fetch status using apiFetch (same gateway logic + no CORS mess)
  const refreshSocial = async () => {
    const token = getToken();
    if (!token) {
      setToast("❌ Missing token. Please login again.");
      clearAuth();
      router.replace("/login");
      return;
    }

    try {
      const res = await apiFetch("/social/status", {
        method: "GET",
        token,
      });

      // allow boolean shape or {status:{}} shape or {linkedin:{connected:true}}
      const s = res?.status || res?.connected || res || {};
      const pickBool = (v: any) => {
        if (typeof v === "boolean") return v;
        if (v && typeof v === "object") {
          if (typeof v.connected === "boolean") return v.connected;
          if (typeof v.is_connected === "boolean") return v.is_connected;
          if (typeof v.ok === "boolean") return v.ok;
        }
        return false;
      };

      const next: SocialStatus = {
        instagram: pickBool(s.instagram),
        linkedin: pickBool(s.linkedin),
        facebook: pickBool(s.facebook),

        // optional detail shapes if backend provides
        instagram_detail: s.instagram?.detail || s.instagram_detail || null,
        linkedin_detail: s.linkedin?.detail || s.linkedin_detail || null,
        facebook_detail: s.facebook?.detail || s.facebook_detail || null,
      };

      setLocalSocial(next);
    } catch (e: any) {
      const msg = e?.message || "Failed to refresh social status.";
      if (isAuthErrorMessage(msg)) {
        clearAuth();
        router.replace("/login");
        return;
      }
      setToast(`❌ ${msg}`);
    }
  };

  // Listen for popup callback messages (if your callback page posts message)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || typeof msg !== "object" || !msg.type) return;

      if (msg.type === "instagram_callback") {
        if (msg.success) setToast("✅ Instagram connected!");
        else setToast(`❌ Instagram: ${msg.error || "Connection failed"}`);
        refreshSocial();
      }

      if (msg.type === "linkedin_callback") {
        if (msg.success) setToast("✅ LinkedIn connected!");
        else setToast(`❌ LinkedIn: ${msg.error || "Connection failed"}`);
        refreshSocial();
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInstagramConnect = () => {
    if (!appUser) {
      setToast("❌ appUser missing (username). Login again.");
      return;
    }
    const authUrl = buildInstagramAuthUrl(appUser);
    if (!authUrl) {
      setToast("❌ Missing NEXT_PUBLIC_INSTAGRAM_CLIENT_ID or REDIRECT_URI");
      return;
    }
    const pop = openCenteredPopup(authUrl, "instagram_oauth");
    if (!pop) setToast("❌ Popup blocked. Allow popups and try again.");
  };

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
      {toast && (
        <div className="mb-4 rounded-2xl border border-border bg-background p-3 text-sm">
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Next steps</p>
          <h2 className="mt-2 text-xl font-semibold">What you can do next</h2>

          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60" />
              Connect your platforms once (secure)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60" />
              Generate content & visuals in AI Studio
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60" />
              Auto Mode publishes while you focus on business
            </li>
          </ul>

          <p className="mt-4 text-xs text-muted-foreground">
            Connected: <span className="font-semibold">{connectedCount}/3</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/studio")}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Open AI Studio
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition hover:bg-muted"
          >
            Go to Dashboard
          </button>

          <button
            onClick={refreshSocial}
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:bg-muted"
          >
            Refresh status
          </button>
        </div>
      </div>

      {/* Platforms */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* ✅ LinkedIn */}
        <div className="rounded-3xl border border-border bg-background p-6">
          <p className="text-lg font-semibold">LinkedIn</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Company page or profile posting
          </p>

          <LinkedInConnectClient
            appUser={appUser}
            connected={!!localSocial.linkedin}
            connectionDetails={{ detail: localSocial.linkedin_detail || null }}
            onConnected={() => refreshSocial()}
            fullWidth
            connectLabel="Connect"
            disconnectLabel="Disconnect"
          />
        </div>

        {/* ✅ Instagram */}
        <div className="rounded-3xl border border-border bg-background p-6">
          <p className="text-lg font-semibold">Instagram</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Auto post images + captions
          </p>

          <button
            onClick={onInstagramConnect}
            className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            {localSocial.instagram ? "Connected" : "Connect"}
          </button>

          {!!localSocial.instagram_detail?.username && (
            <div className="mt-2 text-xs text-muted-foreground">
              @{localSocial.instagram_detail.username}
            </div>
          )}
        </div>

        {/* Facebook */}
        <PlatformCard
          title="Facebook"
          desc="Pages + scheduled posting"
          onClick={() => router.push("/connect/facebook")}
        />
      </div>

      <div className="mt-8 text-xs text-muted-foreground">
        Logged in securely. Token stored locally.
      </div>
    </div>
  );
}

function PlatformCard({
  title,
  desc,
  onClick,
}: {
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-3xl border border-border bg-background p-6">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>

      <button
        onClick={onClick}
        className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
      >
        Connect
      </button>
    </div>
  );
}