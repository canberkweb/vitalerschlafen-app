import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/actions/logout";
import Link from "next/link";

export const metadata = {
  title: "Admin-Bereich",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-lg">
        <h1 className="mb-2 font-heading text-3xl font-semibold text-brand-dark">
          Admin-Bereich
        </h1>
        <div className="mb-8 h-px w-16 bg-brand-gold" />

        <div className="rounded-lg border border-brand-neutral-light/20 bg-white p-6 shadow-sm">
          <p className="text-sm text-brand-neutral">
            Willkommen, <span className="font-medium text-brand-dark">{user.name ?? user.email}</span>.
            Sie sind als Administrator angemeldet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="rounded-md bg-brand-dark px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark-soft"
            >
              Produkte & Bestand
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-md bg-brand-dark px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark-soft"
            >
              Bestellungen
            </Link>
            <Link
              href="/admin/reviews"
              className="rounded-md bg-brand-dark px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark-soft"
            >
              Bewertungen
            </Link>
            <Link
              href="/account"
              className="rounded-md border border-brand-neutral-light/40 bg-white px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-bg"
            >
              Mein Konto
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-brand-error/30 bg-white px-4 py-2 text-sm font-medium text-brand-error transition hover:bg-brand-error/5"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
