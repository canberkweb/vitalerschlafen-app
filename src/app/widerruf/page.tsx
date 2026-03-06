import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: `Widerrufsbelehrung und Widerrufsformular von ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/widerruf` },
};

export default function WiderrufPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">
          Widerrufsbelehrung
        </h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-brand-neutral">
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Widerrufsrecht
            </h2>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
              Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist
              beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von
              Ihnen benannter Dritter, der nicht der Beförderer ist, die
              Waren in Besitz genommen haben bzw. hat.
            </p>
            <p className="mt-3">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <p className="mt-2 rounded-lg border border-brand-neutral-light/10 bg-brand-bg p-4">
              {COMPANY.legalName}
              <br />
              {COMPANY.owner}
              <br />
              {COMPANY.address}
              <br />
              E-Mail: info@vitalerschlafen.de
            </p>
            <p className="mt-3">
              mittels einer eindeutigen Erklärung (z.&nbsp;B. ein mit der
              Post versandter Brief oder E-Mail) über Ihren Entschluss,
              diesen Vertrag zu widerrufen, informieren. Zur Wahrung der
              Widerrufsfrist reicht es aus, dass Sie die Mitteilung über
              die Ausübung des Widerrufsrechts vor Ablauf der
              Widerrufsfrist absenden.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Folgen des Widerrufs
            </h2>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
              Zahlungen, die wir von Ihnen erhalten haben, einschließlich
              der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die
              sich daraus ergeben, dass Sie eine andere Art der Lieferung
              als die von uns angebotene, günstigste Standardlieferung
              gewählt haben), unverzüglich und spätestens binnen
              vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die
              Mitteilung über Ihren Widerruf dieses Vertrags bei uns
              eingegangen ist.
            </p>
            <p className="mt-3">
              Für diese Rückzahlung verwenden wir dasselbe
              Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
              eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich
              etwas anderes vereinbart; in keinem Fall werden Ihnen wegen
              dieser Rückzahlung Entgelte berechnet.
            </p>
            <p className="mt-3">
              Wir können die Rückzahlung verweigern, bis wir die Waren
              wieder zurückerhalten haben oder bis Sie den Nachweis
              erbracht haben, dass Sie die Waren zurückgesandt haben, je
              nachdem, welches der frühere Zeitpunkt ist.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Rücksendung
            </h2>
            <p>
              Sie haben die Waren unverzüglich und in jedem Fall
              spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns
              über den Widerruf dieses Vertrags unterrichten, an uns
              zurückzusenden oder zu übergeben. Die Frist ist gewahrt,
              wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen
              absenden.
            </p>
            <p className="mt-3">
              Sie tragen die unmittelbaren Kosten der Rücksendung der
              Waren.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-brand-dark">
              Muster-Widerrufsformular
            </h2>
            <p className="mb-3">
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie
              bitte dieses Formular aus und senden Sie es zurück.)
            </p>
            <div className="rounded-lg border border-brand-neutral-light/10 bg-brand-bg p-5 text-sm">
              <p>An:</p>
              <p>
                {COMPANY.legalName}, {COMPANY.owner}, {COMPANY.address}
                <br />
                E-Mail: info@vitalerschlafen.de
              </p>
              <p className="mt-3">
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                abgeschlossenen Vertrag über den Kauf der folgenden Waren
                (*):
              </p>
              <p className="mt-2">
                Bestellt am (*) / erhalten am (*): _______________
              </p>
              <p>Name des/der Verbraucher(s): _______________</p>
              <p>Anschrift des/der Verbraucher(s): _______________</p>
              <p className="mt-3">Datum: _______________</p>
              <p className="mt-3 text-xs text-brand-neutral-light">
                (*) Unzutreffendes streichen.
              </p>
            </div>
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
