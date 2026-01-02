"use client";

import React, { useEffect, useState } from "react";

type ConnectionDetail = {
  posting_method?: string;
  organization_count?: number;
  has_org_access?: boolean;
  user_urn?: string;
  org_urn?: string;
};

type ConnectionDetailsProp = {
  detail?: ConnectionDetail | null;
};

type LinkedInCallbackMessage = {
  type: "linkedin_callback";
  success: boolean;
  posting_method?: string;
  organization_count?: number;
  has_org_access?: boolean;
  person_urn?: string;
  org_urn?: string;
  message?: string;
  error?: string;
};

type Props = {
  appUser: string;
  onConnected: () => void;
  connected: boolean;
  connectionDetails?: ConnectionDetailsProp | null;

  // UI options for your card button
  fullWidth?: boolean; // default true
  connectLabel?: string; // default "Connect"
  disconnectLabel?: string; // default "Disconnect"
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://13.233.45.167:5000"
).replace(/\/$/, "");

const LINKEDIN_CLIENT_ID =
  process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "86geycovoa141y";

const LINKEDIN_REDIRECT_URI =
  process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
  `${API_BASE}/social/linkedin/callback`;

export default function LinkedInConnectClient({
  appUser,
  onConnected,
  connected,
  connectionDetails = null,
  fullWidth = true,
  connectLabel = "Connect",
  disconnectLabel = "Disconnect",
}: Props) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | {
    success: boolean;
    posting_method?: string;
    organization_count?: number;
    has_org_access?: boolean;
    person_urn?: string;
    org_urn?: string;
    message?: string;
    error?: string;
  }>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as LinkedInCallbackMessage;
      if (!data || data.type !== "linkedin_callback") return;

      setIsConnecting(false);

      if (data.success) {
        const {
          posting_method,
          organization_count,
          has_org_access,
          person_urn,
          org_urn,
          message,
        } = data;

        setConnectionStatus({
          success: true,
          posting_method,
          organization_count: organization_count || 0,
          has_org_access: has_org_access || false,
          person_urn,
          org_urn,
          message: message || "Connected successfully",
        });

        alert(message || "LinkedIn connected successfully!");
        onConnected();
      } else {
        setConnectionStatus({
          success: false,
          error: data.error || "Unknown error",
        });
        alert(`LinkedIn connection failed: ${data.error || "Unknown error"}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onConnected]);

  const handleConnect = () => {
    if (!appUser) {
      alert("User not found. Please login again.");
      window.location.href = "/login";
      return;
    }

    setIsConnecting(true);
    setConnectionStatus(null);

    const redirectUri = encodeURIComponent(LINKEDIN_REDIRECT_URI);

    const scopes = [
      "r_basicprofile",
      "w_member_social",
      "r_organization_social",
      "w_organization_social",
      "rw_organization_admin",
      "r_organization_followers",
      "r_organization_social_feed",
      "w_organization_social_feed",
      "r_member_profileAnalytics",
      "r_member_postAnalytics",
    ].join(" ");

    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(
      LINKEDIN_CLIENT_ID
    )}&redirect_uri=${redirectUri}&state=${encodeURIComponent(
      appUser
    )}&scope=${encodeURIComponent(scopes)}`;

    const popup = window.open(
      url,
      "linkedin-auth",
      "width=600,height=700,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      alert("Popup blocked. Please allow popups for this site and try again.");
      setIsConnecting(false);
      return;
    }

    const checkClosed = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(checkClosed);
        setIsConnecting(false);
        setTimeout(() => onConnected(), 800);
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect LinkedIn?")) return;

    try {
      setIsConnecting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again to disconnect LinkedIn.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_BASE}/social/linkedin/disconnect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_user: appUser,
          platform: "linkedin",
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (res.status === 401 && (result as any)?.token_expired) {
        localStorage.removeItem("token");
        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      if (res.ok && (result as any)?.success) {
        setConnectionStatus(null);
        alert("LinkedIn disconnected successfully!");
        onConnected();
      } else {
        const errorMessage =
          (result as any)?.error ||
          (result as any)?.message ||
          "Unknown error occurred";
        alert(`Failed to disconnect LinkedIn: ${errorMessage}`);
      }
    } catch (err: any) {
      alert(`Error disconnecting LinkedIn: ${err?.message || "Unknown error"}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const btnLabel = isConnecting
    ? connected
      ? "Disconnecting..."
      : "Connecting..."
    : connected
    ? disconnectLabel
    : connectLabel;

  // Optional info (kept minimal)
  const info = (() => {
    const d = connectionDetails?.detail;
    if (!connected || !d) return null;
    return (
      <div className="mt-2 text-xs text-muted-foreground">
        {d.posting_method ? (
          <div>
            <span className="font-semibold">Mode:</span> {d.posting_method}
          </div>
        ) : null}
      </div>
    );
  })();

  return (
    <div>
      <button
        onClick={connected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        className={
          fullWidth
            ? "mt-5 w-full rounded-full px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-70"
            : "rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
        }
        style={{
          backgroundColor: connected ? "#dc3545" : "#8b7bff",
          cursor: isConnecting ? "not-allowed" : "pointer",
          border: "none",
        }}
      >
        {btnLabel}
      </button>

      {info}

      {connectionStatus && !connectionStatus.success && (
        <div
          className="mt-2 rounded p-2 text-xs"
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
          }}
        >
          <strong>Failed:</strong> {connectionStatus.error}
        </div>
      )}
    </div>
  );
}