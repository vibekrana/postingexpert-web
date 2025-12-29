"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SocialDetail = Record<string, any> | null;

type SocialStatusResponse = {
  instagram?: { connected?: boolean; detail?: SocialDetail };
  linkedin?: { connected?: boolean; detail?: SocialDetail };
  twitter?: { connected?: boolean; detail?: SocialDetail };
  facebook?: { connected?: boolean; detail?: SocialDetail };
};

type UserProfileResponse = {
  username?: string;
  email?: string;
  business_type?: string;
  created_at?: number; // epoch seconds
  posts_created?: number;
  connected_accounts?: number;
  // optionally your backend might return brand fields in future:
  brand_name?: string;
};

type UserUI = {
  username: string;
  email: string;
  businessType: string;
  joinDate: string;
  postsCreated: number;
  connectedAccounts: number;
  brandName: string; // SINGLE BRAND PER USER
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://13.233.45.167:5000";

function safeDateFromEpochSeconds(epoch?: number) {
  try {
    if (!epoch) return "Recently";
    return new Date(epoch * 1000).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getUsernameFromStorage() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("username") || "";
}

function getBrandFromStorage() {
  if (typeof window === "undefined") return "";
  // you can set this during survey/onboarding after user submits brand info
  return localStorage.getItem("brand_name") || "";
}

export default function ConnectClient() {
  const router = useRouter();

  const [user, setUser] = useState<UserUI | null>(null);
  const [loading, setLoading] = useState(true);

  const [socialConnections, setSocialConnections] = useState({
    instagram: { connected: false, detail: null as SocialDetail },
    linkedin: { connected: false, detail: null as SocialDetail },
    facebook: { connected: false, detail: null as SocialDetail },
    twitter: { connected: false, detail: null as SocialDetail }, // kept for future
  });

  const connectedCount = useMemo(
    () => Object.values(socialConnections).filter((s) => s.connected).length,
    [socialConnections]
  );

  // SINGLE BRAND PER USER (UI-level enforcement)
  const brandLabel = useMemo(() => {
    if (!user?.brandName) return "Your Brand";
    return user.brandName;
  }, [user?.brandName]);

  useEffect(() => {
    const token = getAuthToken();
    const username = getUsernameFromStorage();

    if (!token) {
      router.replace("/login");
      return;
    }

    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUserProfile(), fetchSocialStatus()]);
      setLoading(false);
    };

    init().catch(() => setLoading(false));

    async function fetchUserProfile() {
      const token = getAuthToken();
      const usernameLS = getUsernameFromStorage();
      const brandLS = getBrandFromStorage();

      try {
        const res = await fetch(`${API_BASE}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const data = (await res.json()) as UserProfileResponse;

          // SINGLE BRAND: prefer backend brand_name if exists, else localStorage, else username-based default
          const inferredBrand =
            (data.brand_name && String(data.brand_name).trim()) ||
            (brandLS && String(brandLS).trim()) ||
            `${(data.username || usernameLS || "User").toString()} Brand`;

          setUser({
            username: (data.username || usernameLS || "User").toString(),
            email: (data.email || "user@example.com").toString(),
            businessType: (data.business_type || "Not specified").toString(),
            joinDate: safeDateFromEpochSeconds(data.created_at),
            postsCreated: Number(data.posts_created || 0),
            connectedAccounts: Number(data.connected_accounts || 0),
            brandName: inferredBrand,
          });

          // store brand for future screens (optional)
          localStorage.setItem("brand_name", inferredBrand);
          return;
        }
      } catch {
        // ignore, fallback below
      }

      // fallback user
      const fallbackBrand = brandLS || `${(username || "User").toString()} Brand`;
      setUser({
        username: (username || "User").toString(),
        email: "user@example.com",
        businessType: "Not specified",
        joinDate: "Recently",
        postsCreated: 0,
        connectedAccounts: 0,
        brandName: fallbackBrand,
      });
    }

    async function fetchSocialStatus() {
      const token = getAuthToken();
      const appUser = getUsernameFromStorage();

      try {
        const res = await fetch(`${API_BASE}/social/status?app_user=${encodeURIComponent(appUser)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = (await res.json()) as SocialStatusResponse;

        setSocialConnections({
          instagram: {
            connected: Boolean(data.instagram?.connected),
            detail: data.instagram?.detail || null,
          },
          linkedin: {
            connected: Boolean(data.linkedin?.connected),
            detail: data.linkedin?.detail || null,
          },
          facebook: {
            connected: Boolean(data.facebook?.connected),
            detail: data.facebook?.detail || null,
          },
          twitter: {
            connected: Boolean(data.twitter?.connected),
            detail: data.twitter?.detail || null,
          },
        });
      } catch {
        // ignore
      }
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("username");
      localStorage.removeItem("user_id");
      // keep brand_name if you want, or remove it:
      // localStorage.removeItem("brand_name");
    } finally {
      router.replace("/login");
    }
  };

  const go = (path: string) => router.push(path);

  // Simple “Connect” buttons: we keep these as route navigations to your existing connect flows.
  // If your connect widgets are separate pages/components, wire them here.
  const openConnectFlow = (platform: "instagram" | "linkedin" | "facebook") => {
    // You already have flows that open popups. In Next.js, easiest is:
    // - build /connect/instagram, /connect/linkedin, /connect/facebook client pages
    // - those pages run your existing popup logic
    // For now we route to placeholder pages (you’ll create next).
    go(`/connect/${platform}`);
  };

  const AccountCard = ({
    name,
    color,
    icon,
    connected,
    detail,
    onClick,
  }: {
    name: string;
    color: string;
    icon: string;
    connected: boolean;
    detail: SocialDetail;
    onClick: () => void;
  }) => {
    const subLine = (() => {
      if (!connected) return "Not connected";
      if (name === "Facebook" && detail?.page_name) return `Page: ${detail.page_name}`;
      if (name === "Instagram" && (detail?.username || detail?.instagram_username))
        return `@${detail.username || detail.instagram_username}`;
      if (name === "LinkedIn" && detail?.posting_method) return `Mode: ${detail.posting_method}`;
      return "Connected";
    })();

    return (
      <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ background: color }}
            >
              <span className="text-lg">{icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">{name}</h3>
                {connected ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Connected
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    Not connected
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{subLine}</p>
            </div>
          </div>

          <button
            onClick={onClick}
            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${
              connected
                ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
            type="button"
          >
            {connected ? "Manage" : "Connect"}
          </button>
        </div>

        {/* Optional: show extra LinkedIn org info */}
        {connected && name === "LinkedIn" && detail && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <span className="font-semibold">Posting:</span>{" "}
                {detail.posting_method || "Personal Profile"}
              </div>
              <div>
                <span className="font-semibold">Org Access:</span>{" "}
                {detail.has_org_access ? "Yes" : "No"}
              </div>
              {typeof detail.organization_count !== "undefined" && (
                <div>
                  <span className="font-semibold">Organizations:</span> {detail.organization_count}
                </div>
              )}
              {detail.org_urn && (
                <div className="truncate">
                  <span className="font-semibold">Org URN:</span> {detail.org_urn}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f6ff] via-white to-[#f7fff9]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              ⚡
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">PostingExpert</p>
              <p className="text-xs text-slate-500">AI Marketing Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go("/content-creation")}
              className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:inline-flex"
              type="button"
            >
              Create Content →
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-black/5 transition hover:bg-slate-50"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header / Welcome */}
        <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                👋 Welcome Back
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                Connect your social accounts
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Single brand per user • Your posts will be generated and published under{" "}
                <span className="font-semibold text-slate-900">{brandLabel}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <p className="text-xs text-slate-500">Total Posts</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {loading ? "—" : user?.postsCreated ?? 0}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <p className="text-xs text-slate-500">Connected</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {loading ? "—" : `${connectedCount}/3`}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">Active</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <p className="text-xs text-slate-500">Member Since</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {loading ? "—" : user?.joinDate ?? "Recently"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              <p className="text-sm text-slate-600">Jump into your workflow</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Create Content", icon: "✨", path: "/content-creation", desc: "Generate AI posts" },
              { title: "Schedule Posts", icon: "📅", path: "/schedule", desc: "Plan your calendar" },
              { title: "Analytics", icon: "📊", path: "/analytics", desc: "Track performance" },
              { title: "My Posts", icon: "📝", path: "/my-posts", desc: "See all content" },
            ].map((a) => (
              <button
                key={a.title}
                onClick={() => go(a.path)}
                className="group rounded-2xl border border-black/5 bg-white/70 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    {a.icon}
                  </div>
                  <span className="text-slate-400 transition group-hover:text-slate-700">→</span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{a.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Social Connect */}
        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Connect Social Media</h2>
              <p className="text-sm text-slate-600">
                Link accounts to start auto-posting for <span className="font-semibold">{brandLabel}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AccountCard
              name="Instagram"
              icon="📷"
              color="#E1306C"
              connected={socialConnections.instagram.connected}
              detail={socialConnections.instagram.detail}
              onClick={() => openConnectFlow("instagram")}
            />
            <AccountCard
              name="LinkedIn"
              icon="💼"
              color="#0077B5"
              connected={socialConnections.linkedin.connected}
              detail={socialConnections.linkedin.detail}
              onClick={() => openConnectFlow("linkedin")}
            />
            <AccountCard
              name="Facebook"
              icon="👥"
              color="#1877F2"
              connected={socialConnections.facebook.connected}
              detail={socialConnections.facebook.detail}
              onClick={() => openConnectFlow("facebook")}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-black/5 bg-white/60 p-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Note:</span> Twitter/X is paused for now (coming soon).
          </div>
        </div>

        {/* Profile */}
        <div className="mt-10 rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
                {(user?.username || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">{user?.username || "User"}</p>
                <p className="text-sm text-slate-600">{user?.email || "user@example.com"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Active Member
                  </span>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    Pro User
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Brand: {brandLabel}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => go("/profile")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              type="button"
            >
              Edit Profile →
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-xs text-slate-500">Business Type</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{user?.businessType || "Not specified"}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-xs text-slate-500">Member Since</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{user?.joinDate || "Recently"}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-xs text-slate-500">Posts Created</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{user?.postsCreated ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-xs text-slate-500">Accounts Connected</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{connectedCount}/3</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pb-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} PostingExpert • Single brand per user • Built for automation
        </div>
      </div>
    </div>
  );
}
