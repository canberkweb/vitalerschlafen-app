import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Vitalerschlafen — Premium Hirsekissen aus Deutschland",
    template: "%s | Vitalerschlafen",
  },
  description:
    "Entdecken Sie unsere handgefertigten 100% Hirsekissen für erholsamen Schlaf. Premium Qualität, natürliche Materialien, EU-weiter Versand.",
  keywords: [
    "Hirsekissen",
    "Premium Kissen",
    "Naturkissen",
    "Schlafkomfort",
    "Vitalerschlafen",
  ],
  metadataBase: new URL("https://vitalerschlafen.de"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Vitalerschlafen",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
