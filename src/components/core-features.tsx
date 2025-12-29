import { Sparkles, Bot, Layers, LineChart } from "lucide-react";

const blocks = [
  {
    icon: Sparkles,
    title: "AI Content Engine",
    bullets: [
      "Platform-specific writing",
      "Hashtags & tone control",
      "Brand-aligned messaging",
    ],
  },
  {
    icon: Bot,
    title: "Automation & Autopilot",
    bullets: ["Smart Auto Mode", "Zero approvals", "Continuous posting"],
  },
  {
    icon: Layers,
    title: "Multi-Platform Scale",
    bullets: ["Instagram, LinkedIn, X, Facebook", "Multi-brand support", "Unified control"],
  },
  {
    icon: LineChart,
    title: "Analytics & Learning",
    bullets: ["Engagement tracking", "AI feedback loop", "Performance insights"],
  },
];

export function CoreFeatures() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm text-muted-foreground">Core features</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Everything needed for a self-running social presence.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Four capabilities, intentionally focused. No cluttered dashboards. No
            “click to generate” workflows.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {blocks.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/15 p-3">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">
                    {b.title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {b.bullets.map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        <span className="leading-relaxed">{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-border/60" />

              <p className="mt-4 text-xs text-muted-foreground">
                Built for quiet reliability.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
