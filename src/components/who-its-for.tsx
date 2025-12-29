import { Building2, Briefcase, Rocket, Users, Video } from "lucide-react";

const audience = [
  { icon: Rocket, title: "Startups", desc: "Consistent presence without a marketing team." },
  { icon: Briefcase, title: "Founders", desc: "Stay visible while you build the business." },
  { icon: Users, title: "Agencies", desc: "Run multiple brands with minimal overhead." },
  { icon: Video, title: "Creators", desc: "Post regularly without burnout." },
  { icon: Building2, title: "SaaS & D2C", desc: "Reliable content cadence that compounds." },
];

export function WhoItsFor() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm text-muted-foreground">Who it’s for</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Built for teams that value focus.
          </h2>
          <p className="mt-4 text-muted-foreground">
            PostingExpert is designed for people who want outcomes — not another workflow.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audience.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/15 p-3">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {a.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
