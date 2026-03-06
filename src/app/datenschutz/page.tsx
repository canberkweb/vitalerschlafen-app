import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung von ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/datenschutz` },
};

export default function DatenschutzPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">
          Datenschutzerklärung
        </h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-brand-neutral">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="mb-2 font-medium text-brand-dark">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick
              darüber, was mit Ihren personenbezogenen Daten passiert,
              wenn Sie diese Website besuchen. Personenbezogene Daten
              sind alle Daten, mit denen Sie persönlich identifiziert
              werden können.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              2. Verantwortliche Stelle
            </h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website
              ist:
            </p>
            <p className="mt-2">
              {COMPANY.owner}
              <br />
              {COMPANY.address}
              <br />
              E-Mail: info@vitalerschlafen.de
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              3. Datenerfassung auf dieser Website
            </h2>

            <h3 className="mb-2 mt-4 font-medium text-brand-dark">Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Das sind kleine
              Textdateien, die Ihr Webbrowser auf Ihrem Endgerät
              speichert. Wir verwenden technisch notwendige Cookies, die
              für den Betrieb der Seite erforderlich sind
              (Session-Cookies für den Warenkorb und die Anmeldung).
            </p>

            <h3 className="mb-2 mt-4 font-medium text-brand-dark">Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in sogenannten Server-Log-Dateien, die Ihr
              Browser automatisch an uns übermittelt. Dies sind:
              Browsertyp und -version, verwendetes Betriebssystem,
              Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit
              der Serveranfrage und IP-Adresse.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              4. Bestellung und Zahlungsabwicklung
            </h2>
            <p>
              Wenn Sie bei uns eine Bestellung aufgeben, erheben wir die
              für die Abwicklung erforderlichen Daten: Name,
              E-Mail-Adresse, Lieferadresse und Zahlungsinformationen.
              Die Zahlungsabwicklung erfolgt über Stripe (Stripe, Inc.,
              510 Townsend Street, San Francisco, CA 94103, USA). Die
              entsprechende Datenschutzerklärung von Stripe finden Sie
              unter:{" "}
              <a
                href="https://stripe.com/de/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold"
              >
                https://stripe.com/de/privacy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              5. Ihre Rechte
            </h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft
              über Ihre gespeicherten personenbezogenen Daten, deren
              Herkunft und Empfänger und den Zweck der Datenverarbeitung
              sowie ein Recht auf Berichtigung, Sperrung oder Löschung
              dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema
              Datenschutz können Sie sich jederzeit an uns wenden.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              6. Hosting
            </h2>
            <p>
              Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133,
              Walnut, CA 91789, USA) gehostet. Details zum Datenschutz
              finden Sie in der Datenschutzerklärung von Vercel:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold"
              >
                https://vercel.com/legal/privacy-policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              7. Änderungen
            </h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung
              anzupassen, damit sie stets den aktuellen rechtlichen
              Anforderungen entspricht oder um Änderungen unserer
              Leistungen in der Datenschutzerklärung umzusetzen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
