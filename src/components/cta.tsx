import Link from "next/link";

export function CTA() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-sm md:p-14">
          <div className="max-w-3xl">
            <p className="text-sm text-muted-foreground">Ready to automate?</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
              Start automating your social media.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Let AI run it — while you build your business.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Start Free
              </Link>

              <Link
                href="/how-it-works"
                className="rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              No clutter. No micromanagement. Just consistent output.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
