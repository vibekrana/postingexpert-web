"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center md:pt-24">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-sm text-muted-foreground">
            Silent automation for social media
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Your Social Media, Fully Automated.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            PostingExpert creates, posts, and improves — in the background.
            No micromanagement. No daily posting effort.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              Runs 24×7
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              Zero approvals
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              Learns & improves
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="relative"
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Automation Status
              </p>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                Live
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Stat label="Auto Mode" value="ON" />
              <Stat label="Platforms" value="4" />
              <Stat label="Posts this week" value="12" />
              <Stat label="Engagement" value="↑ 18%" />
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">
                Next action (simulated)
              </p>
              <p className="mt-2 text-sm text-foreground">
                Scheduling LinkedIn post • “Product update” theme
              </p>

              <div className="mt-4 space-y-2">
                <Bar />
                <Bar delay />
                <Bar />
              </div>
            </div>
          </div>

          {/* soft ambient glow - NOT neon */}
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-3xl bg-primary/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Bar({ delay }: { delay?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0.4, width: "60%" }}
      animate={{ opacity: 1, width: ["55%", "82%", "65%"] }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay ? 0.6 : 0,
      }}
      className="h-2 rounded-full bg-muted"
    />
  );
}
