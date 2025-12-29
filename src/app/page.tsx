import { SiteNavbar } from "@/components/site-navbar";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Different } from "@/components/different";
import { CoreFeatures } from "@/components/core-features";
import { WhoItsFor } from "@/components/who-its-for";
import { Philosophy } from "@/components/philosophy";
import { CTA } from "@/components/cta";
import { SiteFooter } from "@/components/site-footer";


export default function Home() {
  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-background text-foreground">
        <Hero />
        <HowItWorks />
        <Different />
        <CoreFeatures />
        <WhoItsFor />
        <Philosophy />
        <CTA />
        <SiteFooter />
      </main>
    </>
  );
}
