"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Aus welchem Material besteht das Kissen?",
    a: "Unsere Kissen sind mit 100\u00A0% Bio Hirsenschalen aus kontrolliertem Anbau gefüllt. Der Bezug besteht aus 100\u00A0% Bionassel — weich, atmungsaktiv und hautfreundlich.",
  },
  {
    q: "Wie reinige ich mein Hirsekissen?",
    a: "Den Bezug können Sie bei 40\u00A0°C in der Waschmaschine waschen. Die Hirsefüllung sollte regelmäßig an der frischen Luft aufgeschüttelt werden. Wir empfehlen, die Füllung alle 1–2 Jahre auszutauschen.",
  },
  {
    q: "Welche Größe ist die richtige für mich?",
    a: "Unsere Kissen gibt es in drei Größen: Klein (40×40\u00A0cm), Mittel (40×60\u00A0cm) und Groß (40×80\u00A0cm). Für die meisten Schläfer empfehlen wir die Größe Mittel. Bei Seitenschläfern kann die große Variante vorteilhaft sein.",
  },
  {
    q: "Wie lange dauert der Versand?",
    a: "Innerhalb Deutschlands beträgt die Lieferzeit in der Regel 2–4 Werktage. EU-weiter Versand dauert 5–8 Werktage. Ab einem Bestellwert von 50\u00A0€ ist der Versand innerhalb Deutschlands kostenlos.",
  },
  {
    q: "Kann ich das Kissen zurückgeben?",
    a: "Selbstverständlich. Sie haben ein 14-tägiges Widerrufsrecht ab Erhalt der Ware. Bitte beachten Sie unsere Widerrufsbelehrung für alle Details.",
  },
] as const;

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-brand-neutral-light/10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-brand-dark"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-medium text-brand-dark md:text-base">
          {q}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-brand-neutral transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-brand-neutral">{a}</p>
      </div>
    </motion.div>
  );
}

export function FAQSection() {
  return (
    <section className="bg-brand-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold-dark">
            Häufige Fragen
          </p>
          <h2 className="mx-auto mt-4 max-w-md font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-dark md:text-4xl">
            Gut zu wissen
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
        </motion.div>

        <div className="mt-14">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
