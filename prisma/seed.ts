import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString =
  process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"]!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database …");

  // ── Admin User ──────────────────────────────────────────────────────────
  const adminEmail = process.env["ADMIN_EMAIL"] ?? "admin@vitalerschlafen.de";
  const adminPassword = "Admin123!"; // Change after first login!
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });
  console.log(`  ✔ Admin: ${admin.email} (${admin.role})`);

  // ── Categories ──────────────────────────────────────────────────────────
  const kissen = await prisma.category.upsert({
    where: { slug: "kissen" },
    update: {},
    create: { slug: "kissen", name: "Kissen" },
  });
  console.log(`  ✔ Category: ${kissen.name}`);

  const matratzen = await prisma.category.upsert({
    where: { slug: "matratzen" },
    update: {},
    create: { slug: "matratzen", name: "Matratzen" },
  });
  console.log(`  ✔ Category: ${matratzen.name}`);

  // ── Products ────────────────────────────────────────────────────────────

  interface ProductDef {
    slug: string;
    title: string;
    description: string;
    size: string;
    basePriceCents: number;
    skuPrefix: string;
    image: string;
  }

  const products: ProductDef[] = [
    {
      slug: "pharao-original",
      title: "Pharao Original",
      description:
        "Das Pharao Original Hirsekissen — 40 × 80 cm, gefüllt mit 100 % Bio Hirsenschalen für erholsamen, natürlichen Schlaf.",
      size: "40 × 80 cm",
      basePriceCents: 14900,
      skuPrefix: "PH-ORIG",
      image: "/images/pharao.png",
    },
    {
      slug: "pharao-2-merino-wolle",
      title: "Pharao 2.0 Merino Wolle",
      description:
        "Das Pharao 2.0 Merino Wolle Kissen — 40 × 80 cm, mit Bio Hirsenschalen und edler Merino-Wolle für maximalen Komfort.",
      size: "40 × 80 cm",
      basePriceCents: 19900,
      skuPrefix: "PH-MER",
      image: "/images/pharaomerino.png",
    },
    {
      slug: "kleopatra-original",
      title: "Kleopatra Original",
      description:
        "Das Kleopatra Original Hirsekissen — 40 × 60 cm, gefüllt mit 100 % Bio Hirsenschalen. Kompakt und komfortabel.",
      size: "40 × 60 cm",
      basePriceCents: 12900,
      skuPrefix: "KL-ORIG",
      image: "/images/kleopatra.png",
    },
    {
      slug: "kleopatra-2-merino-wolle",
      title: "Kleopatra 2.0 Merino Wolle",
      description:
        "Das Kleopatra 2.0 Merino Wolle Kissen — 40 × 60 cm, mit Bio Hirsenschalen und edler Merino-Wolle. Premium-Schlaf im kompakten Format.",
      size: "40 × 60 cm",
      basePriceCents: 17900,
      skuPrefix: "KL-MER",
      image: "/images/kleopatramerino.png",
    },
  ];

  const LAVENDER_SURCHARGE_CENTS = 1000; // +10 €

  for (const def of products) {
    const product = await prisma.product.upsert({
      where: { slug: def.slug },
      update: {
        title: def.title,
        description: def.description,
        categoryId: kissen.id,
      },
      create: {
        slug: def.slug,
        title: def.title,
        description: def.description,
        active: true,
        categoryId: kissen.id,
      },
    });
    console.log(`  ✔ Product: ${product.title} (${product.slug})`);

    // ── Variants: ohne / mit Lavendel ─────────────────────────────────
    const variantDefs = [
      {
        size: def.size,
        lavenderIncluded: false,
        priceCents: def.basePriceCents,
        sku: `${def.skuPrefix}-40`,
        stock: 50,
      },
      {
        size: def.size,
        lavenderIncluded: true,
        priceCents: def.basePriceCents + LAVENDER_SURCHARGE_CENTS,
        sku: `${def.skuPrefix}-40-LAV`,
        stock: 30,
      },
    ];

    for (const v of variantDefs) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: { priceCents: v.priceCents, lavenderIncluded: v.lavenderIncluded },
        create: {
          productId: product.id,
          size: v.size,
          lavenderIncluded: v.lavenderIncluded,
          priceCents: v.priceCents,
          stock: v.stock,
          sku: v.sku,
        },
      });
      const lav = variant.lavenderIncluded ? " + Lavendel" : "";
      console.log(`    ↳ ${variant.size}${lav}  ${variant.priceCents} ct  [${v.sku}]`);
    }

    // ── Product image (replace old placeholders) ──────────────────────
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: def.image,
        alt: `${def.title} — Produktbild`,
        sortOrder: 0,
      },
    });
    console.log(`    ↳ Image: ${def.image}`);
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
