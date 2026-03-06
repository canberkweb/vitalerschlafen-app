import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/actions/logout";

export const metadata = {
  title: "Mein Konto",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-lg">
        <h1 className="mb-2 font-heading text-3xl font-semibold text-brand-dark">
          Mein Konto
        </h1>
        <div className="mb-8 h-px w-16 bg-brand-gold" />

        <div className="rounded-lg border border-brand-neutral-light/20 bg-white p-6 shadow-sm">
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-brand-neutral">Name</dt>
              <dd className="text-brand-dark">{user.name ?? "–"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-brand-neutral">E-Mail</dt>
              <dd className="text-brand-dark">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-brand-neutral">Rolle</dt>
              <dd className="text-brand-dark">
                {user.role === "ADMIN" ? "Administrator" : "Kunde"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/account/orders"
            className="rounded-md bg-brand-dark px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark-soft"
          >
            Meine Bestellungen
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-brand-neutral-light/40 bg-white px-5 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-bg"
            >
              Abmelden
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
