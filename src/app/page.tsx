import Link from "next/link";
import { getActiveProducts } from "@/server/repositories/products";
import { formatPriceShort } from "@/lib/utils/format";
import { TrustBadges } from "@/components/product";
import { SITE } from "@/config/site";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductTeaser } from "@/components/home/ProductTeaser";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const products = await getActiveProducts();
  const product = products[0]; // single-product store
  const lowestPrice = product?.variants[0]?.priceCents;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection lowestPrice={lowestPrice} />
      {product && (
        <ProductTeaser product={product} lowestPrice={lowestPrice} />
      )}
      <TrustBadges />
      <Footer />
    </div>
  );
}
