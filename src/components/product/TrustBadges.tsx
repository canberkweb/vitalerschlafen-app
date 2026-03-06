"use client";

import { motion } from "motion/react";
import { Wheat, Award, Globe, RotateCcw } from "lucide-react";

const BADGES = [
  {
    icon: Wheat,
    title: "100% Hirsefüllung",
    text: "Bio Hirsenschalen aus kontrolliertem Anbau",
  },
  {
    icon: Award,
    title: "Premium Qualität",
    text: "Handgefertigt mit Liebe zum Detail",
  },
  {
    icon: Globe,
    title: "EU-weiter Versand",
    text: "Schnell & zuverlässig in die gesamte EU",
  },
  {
    icon: RotateCcw,
    title: "14 Tage Rückgabe",
    text: "Kostenlose Rücksendung innerhalb Deutschlands",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

export function TrustBadges() {
  return (
    <section className="border-t border-brand-neutral-light/15 bg-gradient-to-b from-brand-bg-white to-brand-bg py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={itemVariants}
                className="group relative rounded-2xl border border-brand-neutral-light/10 bg-white/60 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-brand-gold/20 hover:shadow-md hover:shadow-brand-gold/5"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold transition-colors duration-300 group-hover:bg-brand-gold/15">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-wide text-brand-dark">
                  {b.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-brand-neutral">
                  {b.text}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
