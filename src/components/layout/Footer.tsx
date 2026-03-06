import { SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-brand-neutral-light/10 bg-brand-bg py-10">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="font-heading text-sm font-semibold tracking-tight text-brand-dark/30">
          {SITE.name}
        </p>
        <p className="mt-2 text-xs text-brand-neutral-light">
          © {new Date().getFullYear()} {SITE.name}. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
