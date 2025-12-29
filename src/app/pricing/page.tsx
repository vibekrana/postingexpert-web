import { SiteNavbar } from "@/components/site-navbar";
import { CTA } from "@/components/cta";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "For trying PostingExpert quietly.",
    features: ["1 brand", "2 platforms", "Auto Mode preview", "Basic analytics"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "₹— / month",
    desc: "For founders and growing teams.",
    features: [
      "Up to 3 brands",
      "4 platforms",
      "Full Auto Mode",
      "Brand tone + hashtags",
      "Analytics & learning",
    ],
    featured: true,
    cta: "Get Started",
  },
  {
    name: "Business",
    price: "Talk to us",
    desc: "For agencies & multi-brand ops.",
    features: [
      "Unlimited brands",
      "Team access",
      "Advanced analytics",
      "Priority support",
      "Custom workflows",
    ],
    cta: "Contact Sales",
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="text-sm text-muted-foreground">Pricing</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Simple plans. Quiet output.
            </h1>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              Choose a plan based on how many brands you run. No clutter, no
              complexity — just consistent presence.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={[
                    "rounded-3xl border border-border bg-card p-8 shadow-sm",
                    p.featured ? "ring-1 ring-primary/30" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{p.name}</p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight">
                        {p.price}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                    </div>

                    {p.featured ? (
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-foreground">
                        Recommended
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 h-px w-full bg-border/60" />

                  <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={[
                      "mt-8 w-full rounded-full px-5 py-2.5 text-sm font-medium transition",
                      p.featured
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border bg-background text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {p.cta}
                  </button>

                  <p className="mt-4 text-xs text-muted-foreground">
                    No noisy dashboards. Just calm automation.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
    </>
  );
}
