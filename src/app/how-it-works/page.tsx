import { SiteNavbar } from "@/components/site-navbar";
import { HowItWorks } from "@/components/how-it-works";
import { Different } from "@/components/different";
import { CTA } from "@/components/cta";

export default function HowItWorksPage() {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="text-sm text-muted-foreground">How it works</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Quiet automation, end-to-end.
            </h1>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              Connect platforms once. Enable Auto Mode. PostingExpert handles content
              creation, posting, and improvement — without daily intervention.
            </p>
          </div>
        </section>

        <HowItWorks />
        <Different />
        <CTA />
      </main>
    </>
  );
}
