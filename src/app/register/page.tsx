"use client";

import { useActionState } from "react";
import { registerAction, type RegisterState } from "@/actions/register";
import { googleSignInAction } from "@/actions/google-signin";
import Link from "next/link";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl font-semibold text-brand-dark">
            Vitalerschlafen
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-brand-dark">
            Konto erstellen
          </h1>
          <p className="mt-2 text-sm text-brand-neutral">
            Erstellen Sie Ihr persönliches Konto.
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
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-brand-dark">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full rounded-md border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              placeholder="Max Mustermann"
            />
            {state.fieldErrors?.name && (
              <p className="mt-1 text-xs text-brand-error">{state.fieldErrors.name[0]}</p>
            )}
          </div>

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
              autoComplete="new-password"
              required
              className="w-full rounded-md border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              placeholder="Mindestens 8 Zeichen"
            />
            {state.fieldErrors?.password && (
              <p className="mt-1 text-xs text-brand-error">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-brand-dark">
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-md border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              placeholder="Passwort wiederholen"
            />
            {state.fieldErrors?.confirmPassword && (
              <p className="mt-1 text-xs text-brand-error">{state.fieldErrors.confirmPassword[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-brand-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Wird erstellt …" : "Konto erstellen"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-neutral-light/30" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-brand-bg px-3 text-brand-neutral">oder</span>
          </div>
        </div>

        {/* Google Sign In */}
        <form action={googleSignInAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-md border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-brand-bg"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Mit Google registrieren
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-brand-neutral">
          Bereits ein Konto?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold"
          >
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
