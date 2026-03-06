"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/login";
import Link from "next/link";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl font-semibold text-brand-dark">
            Vitalerschlafen
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-brand-dark">
            Anmelden
          </h1>
          <p className="mt-2 text-sm text-brand-neutral">
            Melden Sie sich in Ihrem Konto an.
          </p>
        </div>

        {/* Error banner */}
        {state.error && (
          <div className="mb-4 rounded-md border border-brand-error/20 bg-brand-error/5 px-4 py-3 text-sm text-brand-error">
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-dark">
              E-Mail-Adresse
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              placeholder="max@beispiel.de"
            />
            {state.fieldErrors?.email && (
              <p className="mt-1 text-xs text-brand-error">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-brand-dark">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              placeholder="Ihr Passwort"
            />
            {state.fieldErrors?.password && (
              <p className="mt-1 text-xs text-brand-error">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-brand-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Wird angemeldet …" : "Anmelden"}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-brand-neutral">
          Noch kein Konto?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold"
          >
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
