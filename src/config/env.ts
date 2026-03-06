import { z } from "zod";

/**
 * Environment variable schema — validates all required env vars at build/start time.
 * Add new variables here as the project grows.
 */
const envSchema = z.object({
  // ─── App ───────────────────────────────────────────────
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),

  // ─── Database (Supabase PostgreSQL) ────────────────────
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // ─── Supabase ──────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // ─── Stripe ────────────────────────────────────────────
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // ─── Email (SMTP or provider) ──────────────────────────
  EMAIL_FROM: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // ─── Auth ──────────────────────────────────────────────
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables.
 * Throws a descriptive error at startup if any required var is missing.
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  ✗ ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${formatted}\n\n` +
        `Please check your .env.local file.`
    );
  }

  return parsed.data;
}

/**
 * Typed, validated environment config — import this everywhere instead of
 * accessing process.env directly.
 *
 * Usage:
 *   import { env } from "@/config/env";
 *   const dbUrl = env.DATABASE_URL;
 */
export const env = validateEnv();
