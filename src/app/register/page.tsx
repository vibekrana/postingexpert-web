"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

const INDUSTRIES = [
  "EdTech",
  "SaaS",
  "Agency",
  "D2C / E-commerce",
  "Real Estate",
  "Healthcare",
  "Finance",
  "Restaurant / Cafe",
  "Fitness",
  "Other",
] as const;

const TONES = [
  { value: "premium", label: "Minimal / Premium" },
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "bold", label: "Bold" },
  { value: "fun", label: "Fun / Trendy" },
] as const;

const GOALS = [
  "Product updates",
  "Educational posts",
  "Testimonials / case studies",
  "Offers / promotions",
  "Hiring / culture",
  "Behind-the-scenes",
  "Industry insights",
] as const;

const FREQUENCY = [
  { value: "3wk", label: "3 posts / week" },
  { value: "5wk", label: "5 posts / week" },
  { value: "daily", label: "Daily" },
] as const;

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",

    // single brand per user
    brandName: "",
    industry: "EdTech",
    tone: "premium",
    goals: [] as string[],
    aiImages: true,
    frequency: "5wk",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const goalsCount = form.goals.length;

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length > 1 &&
      form.email.trim().length > 3 &&
      form.password.trim().length > 5 &&
      form.brandName.trim().length > 1 &&
      goalsCount > 0
    );
  }, [form.fullName, form.email, form.password, form.brandName, goalsCount]);

  const toggleGoal = (goal: string) => {
    setForm((prev) => {
      const exists = prev.goals.includes(goal);
      const next = exists
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal].slice(0, 3); // limit to 3
      return { ...prev, goals: next };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setMsg("");
    setLoading(true);

    try {
      // Map your UI -> backend payload (keeps "single brand per user")
      const payload = {
        username: form.fullName.trim(), // if backend needs username; else it can ignore
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,

        brand_name: form.brandName.trim(),
        business_type: form.industry, // or map it differently if your backend wants "technology" etc.
        tone: form.tone,
        goals: form.goals,
        ai_images: form.aiImages,
        frequency: form.frequency,
      };

      const data: any = await apiFetch("/register", {
        method: "POST",
        body: payload,
      });

      // Store brand locally too (useful for UI right away)
      localStorage.setItem("brand_name", form.brandName.trim());
      localStorage.setItem("business_type", form.industry);

      // If backend returns token on register, store it and go /connect.
      const token =
        data?.token || data?.access_token || data?.jwt || data?.data?.token;

      if (token) {
        saveAuth({
          token,
          username: data?.username || form.fullName.trim(),
          user_id: data?.user_id,
          expires_in: data?.expires_in,
        });
        router.push("/connect");
      } else {
        // If no token, go login
        router.push("/login");
      }
    } catch (err: any) {
      setMsg(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
            {/* Left */}
            <div className="max-w-xl">
              <p className="text-sm text-muted-foreground">Get started</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Create your PostingExpert workspace.
              </h1>
              <p className="mt-5 text-muted-foreground">
                A few details help the AI automate content and visuals correctly —
                so you don’t have to micromanage later.
              </p>

              <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-medium text-foreground">
                  What happens after signup
                </p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    Your brand profile sets tone + content mix automatically
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    Connect platforms once (secure)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    Auto Mode runs in the background
                  </li>
                </ul>
              </div>
            </div>

            {/* Right (form) */}
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border bg-card p-8 shadow-sm"
            >
              <p className="text-sm font-medium text-foreground">Create account</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Keep it minimal — enough for the AI to automate well.
              </p>

              {/* Account */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Full name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Work email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div className="my-8 h-px w-full bg-border/70" />

              {/* Brand Setup */}
              <p className="text-sm font-medium text-foreground">Brand setup</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This powers captions + AI image style + content themes.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Brand name</label>
                  <input
                    value={form.brandName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, brandName: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                    placeholder="e.g., Crafting Brain"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Industry</label>
                  <select
                    value={form.industry}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, industry: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    {INDUSTRIES.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Brand tone</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {TONES.map((t) => {
                      const active = form.tone === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, tone: t.value }))}
                          className={[
                            "rounded-2xl border px-4 py-3 text-left text-sm transition",
                            active
                              ? "border-primary/40 bg-primary/10"
                              : "border-border bg-background hover:bg-muted",
                          ].join(" ")}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">
                    Content goals (choose up to 3)
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {GOALS.map((g) => {
                      const active = form.goals.includes(g);
                      const disabled = !active && form.goals.length >= 3;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGoal(g)}
                          disabled={disabled}
                          className={[
                            "rounded-2xl border px-4 py-3 text-left text-sm transition",
                            active
                              ? "border-primary/40 bg-primary/10"
                              : "border-border bg-background hover:bg-muted",
                            disabled ? "cursor-not-allowed opacity-50" : "",
                          ].join(" ")}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selected: {goalsCount}/3
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        AI-generated images
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        If enabled, PostingExpert generates on-brand visuals automatically.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, aiImages: !p.aiImages }))}
                      className={[
                        "rounded-full px-4 py-2 text-sm font-medium transition",
                        form.aiImages
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "border border-border bg-card text-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      {form.aiImages ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">
                    Posting frequency
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {FREQUENCY.map((f) => {
                      const active = form.frequency === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, frequency: f.value }))}
                          className={[
                            "rounded-2xl border px-3 py-3 text-center text-sm transition",
                            active
                              ? "border-primary/40 bg-primary/10"
                              : "border-border bg-background hover:bg-muted",
                          ].join(" ")}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {msg ? (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {msg}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className={[
                    "mt-2 w-full rounded-full px-6 py-3 text-sm font-medium shadow-sm transition",
                    !canSubmit || loading
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90",
                  ].join(" ")}
                >
                  {loading ? "Creating..." : "Create account"}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <SiteFooter />
      </main>
    </>
  );
}
