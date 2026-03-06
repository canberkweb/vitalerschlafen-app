"use client";

import { motion } from "motion/react";
import { Wheat, Hand, Moon, Shield, Leaf, Heart } from "lucide-react";

const BENEFITS = [
  {
    icon: Wheat,
    title: "100\u00A0% Hirsefüllung",
    description:
      "Bio Hirsenschalen aus kontrolliertem Anbau — natürlich temperaturregulierend und stützend für Ihren Nacken.",
  },
  {
    icon: Hand,
    title: "Handarbeit aus Deutschland",
    description:
      "Jedes Kissen wird sorgfältig von Hand in Deutschland gefertigt. Qualität, die man spürt.",
  },
  {
    icon: Moon,
    title: "Premium Schlafkomfort",
    description:
      "Ergonomische Anpassung an Kopf und Nacken für einen erholsamen, tiefen Schlaf — Nacht für Nacht.",
  },
  {
    icon: Leaf,
    title: "Natürliche Materialien",
    description:
      "100\u00A0% Bionassel-Bezug und reine Bio Hirsenschalen — frei von Chemie, gut für Sie und die Umwelt.",
  },
  {
    icon: Shield,
    title: "Geprüfte Qualität",
    description:
      "Jedes Produkt durchläuft strenge Qualitätskontrollen. Wir stehen für Langlebigkeit und Sorgfalt.",
  },
  {
    icon: Heart,
    title: "Gesunder Schlaf",
    description:
      "Hirse passt sich Ihrer Schlafposition an, stützt die Wirbelsäule und fördert eine natürliche Schlafhaltung.",
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="bg-brand-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold-dark">
            Warum Vitalerschlafen
          </p>
          <h2 className="mx-auto mt-4 max-w-lg font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-dark md:text-4xl">
            Natürlich besser schlafen
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-brand-neutral-light/10 bg-brand-bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-brand-gold/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/10 transition-colors duration-300 group-hover:bg-brand-gold/15">
                  <Icon
                    className="h-5 w-5 text-brand-gold"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-brand-dark">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-neutral">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
