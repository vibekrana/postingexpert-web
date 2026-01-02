"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LinkedInConnectClient from "./linkedin/LinkedInConnectClient";

type SocialDetail = Record<string, any> | null;

type SocialStatusResponse = {
  instagram?: { connected?: boolean; detail?: SocialDetail };
  linkedin?: { connected?: boolean; detail?: SocialDetail };
  facebook?: { connected?: boolean; detail?: SocialDetail };
};

type ProfileLite = {
  username?: string;
  email?: string;
  business_type?: string;
  connected_accounts?: number;
  posts_created?: number;
  scheduled_time?: string;
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://13.233.45.167:5000").replace(
    /\/$/,
    ""
  );

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getAppUser(profile?: ProfileLite | null) {
  // use the same identifier your backend expects
  return (
    profile?.username ||
    localStorage.getItem("username") ||
    localStorage.getItem("registeredUserId") ||
    ""
  );
}

export default function ConnectClient({ profile }: { profile: ProfileLite | null }) {
  const router = useRouter();

  const [social, setSocial] = useState({
    instagram: { connected: false, detail: null as SocialDetail },
    linkedin: { connected: false, detail: null as SocialDetail },
    facebook: { connected: false, detail: null as SocialDetail },
  });

  const appUser = useMemo(() => getAppUser(profile), [profile?.username]);

  const connectedCount = useMemo(
    () => Object.values(social).filter((x) => x.connected).length,
    [social]
  );

  const fetchSocialStatus = async () => {
    const token = getToken();
    if (!token) return;
    if (!appUser) return;

    try {
      const res = await fetch(
        `${API_BASE}/social/status?app_user=${encodeURIComponent(appUser)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!res.ok) return;
      const data = (await res.json()) as SocialStatusResponse;

      setSocial({
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
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchSocialStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appUser]);

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
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
        </div>
      </div>

      {/* Platforms */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* LinkedIn uses popup directly (NO route) */}
        <div className="rounded-3xl border border-border bg-background p-6">
          <p className="text-lg font-semibold">LinkedIn</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Company page or profile posting
          </p>

          <LinkedInConnectClient
            appUser={appUser}
            connected={social.linkedin.connected}
            connectionDetails={{ detail: social.linkedin.detail }}
            onConnected={() => fetchSocialStatus()}
            fullWidth
            connectLabel="Connect"
            disconnectLabel="Disconnect"
          />
        </div>

        {/* Instagram (keep route if you have a page) */}
        <PlatformCard
          title="Instagram"
          desc="Auto post images + captions"
          onClick={() => router.push("/connect/instagram")}
        />

        {/* Facebook (keep route if you have a page) */}
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