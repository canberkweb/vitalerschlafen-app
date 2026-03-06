import Link from "next/link";
import { SITE, COMPANY } from "@/config/site";

const LEGAL_LINKS = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/widerruf", label: "Widerrufsbelehrung" },
  { href: "/versand", label: "Versand & Zahlung" },
] as const;

const SHOP_LINKS = [
  { href: "/category/kissen", label: "Kissen" },
  { href: "/category/matratzen", label: "Matratzen" },
  { href: "/cart", label: "Warenkorb" },
  { href: "/account", label: "Mein Konto" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-brand-neutral-light/10 bg-brand-dark">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-heading text-lg font-semibold text-white">
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Premium Hirsekissen aus 100&nbsp;% Bio Hirsenschalen —
              handgefertigt in Deutschland.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Rechtliches
            </h3>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Kontakt
            </h3>
            <div className="mt-4 space-y-2.5 text-sm text-white/60">
              <p>{COMPANY.owner}</p>
              <p>{COMPANY.address}</p>
              <p>USt-IdNr.: {COMPANY.vatId}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {SITE.name}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/30 transition-colors hover:text-white/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
