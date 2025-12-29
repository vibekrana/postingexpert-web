import { Link2, Sparkles, PlayCircle, LineChart } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Connect your accounts",
    desc: "Link Instagram, LinkedIn, X, Facebook — securely.",
  },
  {
    icon: PlayCircle,
    title: "Enable Auto Mode",
    desc: "One switch. No daily planning or approvals.",
  },
  {
    icon: Sparkles,
    title: "AI creates & posts",
    desc: "Platform-native content, tone, and hashtags — automatically.",
  },
  {
    icon: LineChart,
    title: "Learns & improves",
    desc: "Tracks engagement and adapts continuously in the background.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground">How it works</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              A self-running system, not a tool you babysit.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              PostingExpert runs quietly in the background — creating, publishing,
              and learning without constant input.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {steps.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:bg-muted"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/15 p-3">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-px w-full bg-border/60" />

              <p className="mt-4 text-xs text-muted-foreground">
                Minimal setup. Maximum consistency.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
