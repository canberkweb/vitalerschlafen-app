import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung von ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/impressum` },
};

export default function ImpressumPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">
          Impressum
        </h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-brand-neutral">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              {COMPANY.legalName}
              <br />
              {COMPANY.owner}
              <br />
              {COMPANY.address}
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Kontakt
            </h2>
            <p>
              E-Mail: info@vitalerschlafen.de
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a
              Umsatzsteuergesetz:
              <br />
              {COMPANY.vatId}
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              EU-Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .
            </p>
            <p className="mt-2">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für
              eigene Inhalte auf diesen Seiten nach den allgemeinen
              Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte
              oder gespeicherte fremde Informationen zu überwachen oder
              nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Haftung für Links
            </h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter,
              auf deren Inhalte wir keinen Einfluss haben. Deshalb
              können wir für diese fremden Inhalte auch keine Gewähr
              übernehmen. Für die Inhalte der verlinkten Seiten ist
              stets der jeweilige Anbieter oder Betreiber der Seiten
              verantwortlich.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
