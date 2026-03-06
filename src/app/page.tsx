import { getActiveProducts } from "@/server/repositories/products";
import { TrustBadges } from "@/components/product";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FAQSection } from "@/components/home/FAQSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const products = await getActiveProducts();
  const lowestPrice = products
    .flatMap((p) => p.variants)
    .reduce((min, v) => Math.min(min, v.priceCents), Infinity);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection lowestPrice={lowestPrice === Infinity ? undefined : lowestPrice} />
      <ProductGridSection products={products} />
      <BenefitsSection />
      <TrustBadges />
      <AboutSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
