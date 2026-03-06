import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/actions/logout";
import Link from "next/link";
import { Package, ShoppingCart, MessageSquare, ExternalLink, LogOut, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Admin-Bereich",
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  {
    href: "/admin/products",
    label: "Produkte & Bestand",
    description: "Varianten und Lagerbestand verwalten",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "Bestellungen",
    description: "Bestellstatus, Versand und Sendungsverfolgung",
    icon: ShoppingCart,
  },
  {
    href: "/admin/reviews",
    label: "Bewertungen",
    description: "Kundenbewertungen prüfen und freigeben",
    icon: MessageSquare,
  },
] as const;

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-brand-neutral-light/10 bg-brand-bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-gold" />
            <span className="font-heading text-lg font-semibold text-brand-dark">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-brand-neutral transition-colors hover:text-brand-dark"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Zur Seite</span>
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-1.5 text-xs text-brand-neutral transition-colors hover:text-brand-dark"
            >
              Konto
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-brand-error transition-colors hover:text-brand-error/80"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">Abmelden</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <h1 className="font-heading text-2xl font-semibold text-brand-dark md:text-3xl">
            Willkommen zurück
          </h1>
          <p className="mt-2 text-sm text-brand-neutral">
            Angemeldet als{" "}
            <span className="font-medium text-brand-dark">
              {user.name ?? user.email}
            </span>
          </p>
          <div className="mt-3 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-brand-neutral-light/10 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-gold/20 hover:shadow-md hover:shadow-brand-gold/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 transition-colors group-hover:bg-brand-gold/15">
                  <Icon className="h-5 w-5 text-brand-gold" strokeWidth={1.5} />
                </div>
                <h2 className="mt-4 font-heading text-base font-semibold text-brand-dark">
                  {item.label}
                </h2>
                <p className="mt-1 text-sm text-brand-neutral">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-gold-dark transition-colors group-hover:text-brand-gold">
                  Öffnen
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
