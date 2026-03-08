import type { NextAuthConfig } from "next-auth";

// ─── Edge-compatible auth config (no Prisma / Node.js imports) ──────────────
// Used by middleware. The full config in auth.ts extends this with PrismaAdapter.

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // Providers are added in auth.ts (they need DB access)
  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, persist id + role into the JWT
      if (user) {
        token.id = user.id!;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      // Expose id + role on the client-accessible session object
      session.user.id = token.id as string;
      (session.user as { role: string }).role = token.role as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
