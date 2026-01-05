import { EngagementChart } from "@/components/engagement-chart";

export async function generateStaticParams() {
  return [
    { slug: "postingexpert" },
    { slug: "craftingbrain" },
    { slug: "inikola" },
    { slug: "eyeslahes" },
    { slug: "padmavathi-bhojnalay" },
  ];
}

export default function BrandAnalyticsPage({
  params,
}: {
  params?: { slug?: string };
}) {
  const brandSlug = params?.slug ?? "brand";
  const brand = brandSlug.replace(/-/g, " ");

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm text-muted-foreground">Brand analytics</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl capitalize">
            {brand}
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Performance, engagement trends, and content themes — no editing tools.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Posts this week</p>
            <p className="mt-2 text-2xl font-semibold">12</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="mt-2 text-2xl font-semibold">↑ 18%</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Auto Mode</p>
            <p className="mt-2 text-2xl font-semibold">ON</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <EngagementChart />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm text-muted-foreground">Insights</p>
          <h2 className="mt-3 text-2xl font-semibold">
            Top performing themes
          </h2>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              Educational posts
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              Product updates
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              Industry insights
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
