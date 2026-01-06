// src/app/connect/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { apiFetch } from "@/lib/api";
import { getToken, clearAuth } from "@/lib/auth";
import ConnectClient from "./ConnectClient";

type Profile = {
  username?: string;
  name?: string;
  email?: string;
  business_type?: string;
  connected_accounts?: number;
  scheduled_time?: string;
  posts_created?: number;
  created_at?: number;
  updated_at?: number;
  [k: string]: any;
};

type SocialStatus = {
  instagram: boolean;
  linkedin: boolean;
  facebook: boolean;
  [k: string]: any;
};

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function normalizeLambdaWrapped(raw: any) {
  // backend may wrap response like: { body: "..." }
  if (raw?.body && typeof raw.body === "string") {
    const parsed = safeJsonParse(raw.body);
    if (parsed) return parsed;
  }
  return raw;
}

function normalizeProfile(raw: any): Profile {
  const data = normalizeLambdaWrapped(raw);
  const p = data?.user || data?.profile || data || {};

  return {
    ...p,
    username: p.username ?? data?.username,
    name: p.name ?? data?.name,
    email: p.email ?? data?.email,
    business_type: p.business_type ?? data?.business_type,
    scheduled_time: p.scheduled_time ?? data?.scheduled_time,
    posts_created: p.posts_created ?? data?.posts_created ?? 0,
    connected_accounts: p.connected_accounts ?? data?.connected_accounts ?? 0,
  };
}

function normalizeSocialStatus(raw: any): SocialStatus {
  const data = normalizeLambdaWrapped(raw);

  // Possible shapes:
  // 1) { instagram: true, linkedin: true, facebook: false }
  // 2) { status: { instagram: true, linkedin: true, facebook: false } }
  // 3) { connected: { ... } }
  const s = data?.status || data?.connected || data || {};

  const pickBool = (v: any) => {
    if (typeof v === "boolean") return v;
    if (v && typeof v === "object") {
      if (typeof v.connected === "boolean") return v.connected;
      if (typeof v.is_connected === "boolean") return v.is_connected;
      if (typeof v.ok === "boolean") return v.ok;
    }
    return false;
  };

  return {
    instagram: pickBool(s.instagram),
    linkedin: pickBool(s.linkedin),
    facebook: pickBool(s.facebook),
  };
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

export default function ConnectPage() {
  const router = useRouter();
  const { ready } = useRequireAuth("/login");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [social, setSocial] = useState<SocialStatus>({
    instagram: false,
    linkedin: false,
    facebook: false,
  });
  const [loading, setLoading] = useState(true);

  const reloadAll = async () => {
    const token = getToken();
    if (!token) {
      clearAuth();
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      const [profileRaw, socialRaw] = await Promise.all([
        apiFetch("/user/profile", { method: "GET", token }),
        apiFetch("/social/status", { method: "GET", token }),
      ]);

      setProfile(normalizeProfile(profileRaw));
      setSocial(normalizeSocialStatus(socialRaw));
    } catch (e: any) {
      const msg = e?.message || "";

      if (isAuthErrorMessage(msg)) {
        clearAuth();
        router.replace("/login");
        return;
      }

      // fallback (still let user see connect page)
      setProfile({
        username: localStorage.getItem("username") || "User",
        email: "",
        business_type: "Not specified",
        scheduled_time: "Not set",
        posts_created: 0,
        connected_accounts: 0,
      });

      setSocial({ instagram: false, linkedin: false, facebook: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ready) return;
    reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // ✅ After OAuth callback redirect, status can update slightly later
  // This makes UI show connected without user refreshing.
  useEffect(() => {
    if (!ready) return;

    const hasOAuthParams =
      typeof window !== "undefined" &&
      (window.location.search.includes("code=") ||
        window.location.search.includes("state="));

    if (!hasOAuthParams) return;

    const t = setTimeout(() => reloadAll(), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const displayName = useMemo(() => {
    if (!profile) return "User";
    return profile.name || profile.username || "User";
  }, [profile]);

  // ✅ Real connected count from /social/status
  const connectedCount = useMemo(() => {
    return [social.instagram, social.linkedin, social.facebook].filter(Boolean)
      .length;
  }, [social]);

  if (!ready) return null;

  return (
    <>
      <SiteNavbar />

      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-6 py-14">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Connect</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Your workspace is ready.
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              One-time setup. After this, PostingExpert runs quietly in the
              background.
            </p>
          </div>

          {/* Top cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Workspace */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Workspace</p>
              <p className="mt-2 text-xl font-semibold">{displayName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.email || "—"}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">Business type</p>
                  <p className="mt-1 text-sm font-medium">
                    {profile?.business_type || "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">Auto schedule</p>
                  <p className="mt-1 text-sm font-medium">
                    {profile?.scheduled_time || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Status</p>

              <div className="mt-3 rounded-2xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Connected accounts</p>
                <p className="mt-1 text-2xl font-semibold">
                  {loading ? "—" : `${connectedCount}/3`}
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Posts created</p>
                <p className="mt-1 text-2xl font-semibold">
                  {loading ? "—" : profile?.posts_created ?? 0}
                </p>
              </div>
            </div>

            {/* Brand assets */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Brand assets</p>

              <div className="mt-3 rounded-2xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Logo</p>
                <p className="mt-1 text-sm font-medium">
                  Upload later (we’ll guide you).
                </p>
              </div>

              <button
                type="button"
                onClick={reloadAll}
                className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-muted"
              >
                Refresh status
              </button>
            </div>
          </div>

          {/* Connect buttons */}
          <ConnectClient profile={profile} social={social} />
        </div>

        <SiteFooter />
      </main>
    </>
  );
}