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
    "Hirsekissen kaufen",
    "Bio Hirsenschalen Kissen",
    "ergonomisches Kissen",
    "handgefertigt Deutschland",
  ],
  metadataBase: new URL("https://vitalerschlafen.de"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Vitalerschlafen",
    title: "Vitalerschlafen — Premium Hirsekissen aus Deutschland",
    description:
      "Handgefertigte Hirsekissen aus 100% Bio Hirsenschalen. Natürlich besser schlafen.",
    url: "https://vitalerschlafen.de",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Vitalerschlafen Premium Hirsekissen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitalerschlafen — Premium Hirsekissen aus Deutschland",
    description:
      "Handgefertigte Hirsekissen aus 100% Bio Hirsenschalen.",
  },
  robots: {
    index: true,
    follow: true,
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
