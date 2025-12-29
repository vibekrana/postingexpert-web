import Link from "next/link";
// import { SiteNavbar } from "@/components/site-navbar";
// import { SiteFooter } from "@/components/site-footer";


function BrandRow({
  name,
  platforms,
  status,
  href,
}: {
  name: string;
  platforms: string;
  status: "ON" | "OFF";
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:bg-muted"
    >
      <div>
        <p className="text-base font-semibold tracking-tight">{name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{platforms}</p>
      </div>

      <span
        className={[
          "rounded-full px-3 py-1 text-xs",
          status === "ON"
            ? "bg-primary/15 text-foreground"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        Auto Mode: {status}
      </span>
    </Link>
  );
}

export default function BrandsPage() {
  return (
    <>
{/*     
      <SiteNavbar /> */}
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-sm text-muted-foreground">Brands</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              All connected brands.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Each brand runs independently on Auto Mode.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="space-y-4">
              <BrandRow
                name="Crafting Brain"
                platforms="Instagram • LinkedIn • X • Facebook"
                status="ON"
                href="/app/brands/crafting-brain"
              />
              <BrandRow
                name="Inikola"
                platforms="LinkedIn • X"
                status="ON"
                href="/app/brands/inikola"
              />
            </div>
          </div>
        </section>
{/* 
        <SiteFooter /> */}
      </main>
    </>
  );
}
