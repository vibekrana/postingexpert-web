import { Check, X } from "lucide-react";

const rows = [
  { left: "Manual writing", right: "AI generated" },
  { left: "Approvals & micromanagement", right: "Fully automated flow" },
  { left: "Schedulers (set & forget?)", right: "Self-running engine" },
  { left: "Human dependent", right: "Runs 24×7 in background" },
  { left: "Static templates", right: "Learns & improves continuously" },
];

export function Different() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm text-muted-foreground">What’s different</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Built for automation-first teams.
          </h2>
          <p className="mt-4 text-muted-foreground">
            PostingExpert isn’t another tool you manage. It’s an autopilot that
            runs quietly — creating, posting, and optimizing without constant input.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Traditional */}
          <div className="rounded-2xl border border-border bg-card p-6 opacity-75">
            <p className="text-sm font-medium text-muted-foreground">
              Traditional tools
            </p>

            <div className="mt-5 space-y-3">
              {rows.map((r) => (
                <div
                  key={r.left}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.left}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Requires constant effort.
                    </p>
                  </div>
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PostingExpert */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">PostingExpert</p>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-foreground">
                Automation-first
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {rows.map((r) => (
                <div
                  key={r.right}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {r.right}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Runs in the background.
                    </p>
                  </div>
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-4 w-4 text-primary" />
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-muted p-4">
              <p className="text-sm font-medium text-foreground">
                Set once. Then stop thinking about posting.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Visibility without busywork.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
