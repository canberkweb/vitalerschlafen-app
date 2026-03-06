import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Versand & Zahlung",
  description: `Informationen zu Versand und Zahlungsmethoden bei ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/versand` },
};

export default function VersandPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">
          Versand & Zahlung
        </h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-brand-neutral">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Versand innerhalb Deutschlands
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="font-medium text-brand-dark">Lieferzeit:</strong>{" "}
                2–4 Werktage
              </li>
              <li>
                <strong className="font-medium text-brand-dark">Versandkosten:</strong>{" "}
                4,90 € — <strong className="text-brand-dark">kostenlos</strong> ab 50 € Bestellwert
              </li>
              <li>
                <strong className="font-medium text-brand-dark">Versanddienstleister:</strong>{" "}
                DHL
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Versand innerhalb der EU
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="font-medium text-brand-dark">Lieferzeit:</strong>{" "}
                5–8 Werktage
              </li>
              <li>
                <strong className="font-medium text-brand-dark">Versandkosten:</strong>{" "}
                9,90 €
              </li>
              <li>
                <strong className="font-medium text-brand-dark">Versanddienstleister:</strong>{" "}
                DHL / DPD
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Sendungsverfolgung
            </h2>
            <p>
              Nach dem Versand Ihrer Bestellung erhalten Sie eine
              Versandbestätigung mit einer Sendungsverfolgungsnummer per
              E-Mail. Diese können Sie auch jederzeit in Ihrem
              Kundenkonto unter {"\u201EMeine Bestellungen\u201C"} einsehen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Zahlungsmethoden
            </h2>
            <p className="mb-3">
              Wir bieten Ihnen die folgenden sicheren Zahlungsmethoden
              an:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Kreditkarte (Visa, Mastercard, American Express)</li>
              <li>Debitkarte</li>
              <li>Apple Pay / Google Pay</li>
              <li>Weitere über Stripe verfügbare Zahlungsmethoden</li>
            </ul>
            <p className="mt-3">
              Die Zahlungsabwicklung erfolgt sicher über{" "}
              <a
                href="https://stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold"
              >
                Stripe
              </a>
              . Ihre Zahlungsdaten werden zu keinem Zeitpunkt auf
              unseren Servern gespeichert.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Rechnung
            </h2>
            <p>
              Bei jeder Bestellung wird automatisch eine Rechnung
              erstellt. Sie können diese jederzeit als PDF über Ihr
              Kundenkonto herunterladen.
            </p>
          </section>

          <p className="pt-4 text-xs text-brand-neutral-light">
            Alle Preise verstehen sich als Endpreise inkl. der
            gesetzlichen MwSt.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
