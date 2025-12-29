import Link from "next/link";
import { EngagementChart } from "@/components/engagement-chart";
import { Skeleton } from "@/components/skeleton";

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {note && <p className="mt-2 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}

function BrandCard({
  name,
  platforms,
  autoMode,
  lastPost,
  trend,
  href,
}: {
  name: string;
  platforms: string;
  autoMode: "ON" | "OFF";
  lastPost: string;
  trend: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:bg-muted"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold tracking-tight">{name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{platforms}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs ${
            autoMode === "ON"
              ? "bg-primary/15 text-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Auto Mode: {autoMode}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Last post</p>
          <p className="mt-2 text-sm font-medium">{lastPost}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Engagement</p>
          <p className="mt-2 text-sm font-medium">{trend}</p>
        </div>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Open analytics → (no content editor)
      </p>
    </Link>
  );
}

export default function AppDashboardHome() {
  const isLoading = false;

  const brands = [
    {
      name: "Crafting Brain",
      platforms: "Instagram • LinkedIn • X • Facebook",
      autoMode: "ON" as const,
      lastPost: "2 hours ago",
      trend: "↑ 22%",
      href: "/app/brands/crafting-brain",
    },
    {
      name: "Inikola",
      platforms: "LinkedIn • X",
      autoMode: "ON" as const,
      lastPost: "Yesterday",
      trend: "↑ 12%",
      href: "/app/brands/inikola",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            System status at a glance.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            PostingExpert runs quietly. You only check health, output, and trends.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Auto Mode" value="ON ✅" note="Running normally" />
              <StatCard
                label="Platforms connected"
                value="4"
                note="All healthy"
              />
              <StatCard
                label="Posts this week"
                value="12"
                note="On schedule"
              />
              <StatCard
                label="Engagement trend"
                value="↑ 18%"
                note="Last 7 days"
              />
            </div>
          )}
        </div>
      </section>

      {/* Chart */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <EngagementChart />
        </div>
      </section>

      {/* Brands */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Brands</p>
            <h2 className="mt-2 text-2xl font-semibold">
              Visibility per brand.
            </h2>
          </div>

          {brands.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm font-medium">
                No brands connected yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Connect your first brand to start automated posting.
              </p>

              <Link
                href="/app/settings"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Connect brand
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {brands.map((b) => (
                <BrandCard key={b.name} {...b} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
