import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getAllReviewsAdmin } from "@/server/repositories/reviews";
import { logoutAction } from "@/actions/logout";
import { AdminReviewCard } from "@/components/admin/AdminReviewCard";
import { ArrowLeft, LogOut, ExternalLink, MessageSquare } from "lucide-react";

export const metadata = { title: "Bewertungen verwalten" };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  const reviews = await getAllReviewsAdmin();

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-brand-neutral-light/10 bg-brand-bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-heading text-lg font-semibold text-brand-dark transition-colors hover:text-brand-gold-dark"
            >
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
            <span className="text-brand-neutral-light/50">/</span>
            <span className="flex items-center gap-1.5 text-sm text-brand-neutral">
              <MessageSquare className="h-3.5 w-3.5" /> Bewertungen
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-brand-neutral transition-colors hover:text-brand-dark"
            >
              <ExternalLink className="h-3 w-3" /> Zur Seite
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs text-brand-error transition-colors hover:text-brand-error/80"
              >
                <LogOut className="h-3 w-3" /> Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-heading text-2xl font-semibold text-brand-dark">Bewertungen</h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        {/* Pending reviews */}
        {pending.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-700">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold">
                {pending.length}
              </span>
              Ausstehende Prüfung
            </h2>
            <div className="space-y-4">
              {pending.map((review) => (
                <AdminReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

        {/* Approved reviews */}
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-neutral">
            Freigegebene Bewertungen ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <p className="text-sm text-brand-neutral">Noch keine freigegebenen Bewertungen.</p>
          ) : (
            <div className="space-y-4">
              {approved.map((review) => (
                <AdminReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
