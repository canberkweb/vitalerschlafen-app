"use client";

import { motion } from "motion/react";

export function AboutSection() {
  return (
    <section className="bg-brand-bg-white py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold-dark">
            Über uns
          </p>
          <h2 className="mx-auto mt-4 max-w-md font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-dark md:text-4xl">
            Über Vitalerschlafen
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-12 max-w-2xl space-y-6 text-center text-base leading-relaxed text-brand-neutral"
        >
          <p>
            Vitalerschlafen wurde aus der Überzeugung gegründet, dass guter
            Schlaf den Unterschied macht — für Gesundheit, Wohlbefinden und
            Lebensqualität. Unser Ziel: Premium-Schlafprodukte, die mit
            natürlichen Materialien und traditioneller Handwerkskunst
            überzeugen.
          </p>
          <p>
            Unsere Hirsekissen werden in Deutschland von Hand gefertigt und
            mit sorgfältig ausgewählten Bio Hirsenschalen gefüllt. Hirse
            ist seit Jahrhunderten als Füllmaterial für Kissen bekannt — sie
            passt sich an Kopf und Nacken an, reguliert die Temperatur und
            sorgt für eine natürliche, ergonomische Schlafposition.
          </p>
          <p>
            Wir glauben an Transparenz, Nachhaltigkeit und kompromisslose
            Qualität. Jedes Produkt durchläuft strenge Kontrollen, bevor es
            zu Ihnen nach Hause kommt. Überzeugen Sie sich selbst.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-10 text-center"
        >
          {[
            { value: "100\u00A0%", label: "Natürliche Materialien" },
            { value: "DE", label: "Handarbeit aus Deutschland" },
            { value: "EU", label: "Europaweiter Versand" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="font-heading text-2xl font-bold text-brand-dark">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-brand-neutral">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
