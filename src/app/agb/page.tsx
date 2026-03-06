import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description: `AGB von ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/agb` },
};

export default function AGBPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">
          Allgemeine Geschäftsbedingungen
        </h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-brand-neutral">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 1 Geltungsbereich
            </h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für
              alle Bestellungen, die Verbraucher und Unternehmer über
              den Online-Shop von {COMPANY.legalName} ({COMPANY.owner},{" "}
              {COMPANY.address}) abschließen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 2 Vertragsschluss
            </h2>
            <p>
              Die Darstellung der Produkte im Online-Shop stellt kein
              rechtlich bindendes Angebot dar, sondern eine Aufforderung
              zur Abgabe einer Bestellung. Durch Anklicken des Buttons
              {" \u201EZahlungspflichtig bestellen\u201C "} geben Sie eine
              verbindliche Bestellung ab. Die Bestätigung des Eingangs
              der Bestellung erfolgt unmittelbar nach dem Absenden per
              E-Mail. Der Kaufvertrag kommt zustande, wenn die
              Bestellung durch eine Auftragsbestätigung angenommen wird.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 3 Preise und Versandkosten
            </h2>
            <p>
              Alle Preise verstehen sich als Endpreise inklusive der
              gesetzlichen Mehrwertsteuer. Die Versandkosten werden vor
              Abschluss des Bestellvorgangs angezeigt. Innerhalb
              Deutschlands ist der Versand ab einem Bestellwert von
              50,00 € kostenlos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 4 Zahlungsbedingungen
            </h2>
            <p>
              Die Zahlung erfolgt über den Zahlungsdienstleister Stripe.
              Es stehen die folgenden Zahlungsarten zur Verfügung:
              Kreditkarte, Debitkarte und weitere über Stripe verfügbare
              Zahlungsmethoden. Die Belastung erfolgt mit Abschluss der
              Bestellung.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 5 Lieferung
            </h2>
            <p>
              Die Lieferung erfolgt an die vom Kunden angegebene
              Lieferadresse. Die Lieferzeit beträgt innerhalb
              Deutschlands in der Regel 2–4 Werktage, innerhalb der EU
              5–8 Werktage. Wir behalten uns das Recht auf
              Teillieferungen vor, sofern dies für den Kunden zumutbar
              ist.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 6 Eigentumsvorbehalt
            </h2>
            <p>
              Die Ware bleibt bis zur vollständigen Bezahlung unser
              Eigentum.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 7 Gewährleistung und Haftung
            </h2>
            <p>
              Es gelten die gesetzlichen Gewährleistungsrechte. Ein
              Umtausch oder eine Rücksendung wird gemäß dem
              Widerrufsrecht (siehe Widerrufsbelehrung) ermöglicht.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              § 8 Schlussbestimmungen
            </h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Sollten
              einzelne Bestimmungen dieser AGB unwirksam sein oder
              werden, bleibt die Wirksamkeit der übrigen Bestimmungen
              unberührt.
            </p>
          </section>

          <p className="pt-4 text-xs text-brand-neutral-light">
            Stand: März 2026
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
