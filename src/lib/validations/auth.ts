import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein.")
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z
    .string()
    .min(1, "Bitte geben Sie Ihr Passwort ein."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Der Name muss mindestens 2 Zeichen lang sein.")
      .max(100, "Der Name darf maximal 100 Zeichen lang sein."),
    email: z
      .string()
      .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein.")
      .email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
    password: z
      .string()
      .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
      .max(128, "Das Passwort darf maximal 128 Zeichen lang sein.")
      .regex(
        /[A-Z]/,
        "Das Passwort muss mindestens einen Großbuchstaben enthalten."
      )
      .regex(
        /[a-z]/,
        "Das Passwort muss mindestens einen Kleinbuchstaben enthalten."
      )
      .regex(
        /[0-9]/,
        "Das Passwort muss mindestens eine Zahl enthalten."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
