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

  // ── Product: Hirsekissen ────────────────────────────────────────────────
  const product = await prisma.product.upsert({
    where: { slug: "hirsekissen" },
    update: {},
    create: {
      slug: "hirsekissen",
      title: "Vitalerschlafen Hirsekissen",
      description:
        "Premium-Hirsekissen für erholsamen Schlaf – gefüllt mit 100 % biologischer Goldhirse.",
      active: true,
    },
  });

  console.log(`  ✔ Product: ${product.title} (${product.id})`);

  // ── Variants ────────────────────────────────────────────────────────────
  const variants = [
    { label: "35 × 50 cm", priceCents: 9900, stock: 50, sku: "HK-35x50" },
    { label: "40 × 60 cm", priceCents: 12900, stock: 50, sku: "HK-40x60" },
    { label: "40 × 80 cm", priceCents: 14900, stock: 50, sku: "HK-40x80" },
  ];

  for (const v of variants) {
    const variant = await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: {},
      create: {
        productId: product.id,
        label: v.label,
        priceCents: v.priceCents,
        stock: v.stock,
        sku: v.sku,
      },
    });
    console.log(`  ✔ Variant: ${variant.label} — ${variant.priceCents} ct`);
  }

  // ── Product Images (placeholders) ──────────────────────────────────────
  const existingImages = await prisma.productImage.count({
    where: { productId: product.id },
  });

  if (existingImages === 0) {
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: "/images/placeholder-1.jpg",
          alt: "Hirsekissen Ansicht 1",
          sortOrder: 0,
        },
        {
          productId: product.id,
          url: "/images/placeholder-2.jpg",
          alt: "Hirsekissen Ansicht 2",
          sortOrder: 1,
        },
        {
          productId: product.id,
          url: "/images/placeholder-3.jpg",
          alt: "Hirsekissen Ansicht 3",
          sortOrder: 2,
        },
      ],
    });
    console.log("  ✔ 3 placeholder images created");
  } else {
    console.log(`  ⏭ ${existingImages} images already exist — skipped`);
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
