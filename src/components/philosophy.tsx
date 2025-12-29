"use client";

import { motion } from "framer-motion";

export function Philosophy() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-4xl">
          <p className="text-sm text-muted-foreground">Product philosophy</p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            Marketing should run in the background —
            <span className="relative ml-2 inline-block">
              not consume your day.
              <span className="absolute -bottom-2 left-0 h-[6px] w-full rounded-full bg-primary/25" />
            </span>
          </motion.h2>

          <p className="mt-6 max-w-2xl text-muted-foreground">
            PostingExpert is built for calm confidence. You set direction once,
            and the system handles consistency, publishing, and improvement —
            quietly and reliably.
          </p>
        </div>
      </div>
    </section>
  );
}
