# Vitalerschlafen — Premium Hirsekissen Online-Shop

E-Commerce-Plattform für handgefertigte Hirsekissen aus Deutschland. Gebaut mit Next.js 16, Prisma, Stripe und Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router, RSC)
- **Database:** PostgreSQL + Prisma ORM
- **Payments:** Stripe (Checkout via Payment Intents)
- **Auth:** Iron Session (cookie-based)
- **Styling:** Tailwind CSS v4
- **Email:** Resend
- **Hosting:** Vercel (recommended)

---

## Getting Started (Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run database migrations
npm run prisma:migrate

# 5. Seed the database
npm run prisma:seed

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `AUTH_SECRET` | 32+ char random string for session encryption | ✅ |
| `STRIPE_SECRET_KEY` | Stripe API secret key | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | ✅ |
| `RESEND_API_KEY` | Resend API key for transactional emails | ✅ |
| `RESEND_FROM_EMAIL` | Sender email (e.g. info@vitalerschlafen.de) | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Public URL (e.g. https://vitalerschlafen.de) | ✅ |

---

## Production Launch Checklist

### 1. Environment & Secrets
- [ ] Set all env vars in Vercel dashboard (see table above)
- [ ] Use **Stripe production keys** (not test keys)
- [ ] Generate a strong `AUTH_SECRET` (`openssl rand -hex 32`)
- [ ] Set `NEXT_PUBLIC_BASE_URL` to `https://vitalerschlafen.de`

### 2. Database
- [ ] Provision production PostgreSQL (e.g. Neon, Supabase, Railway)
- [ ] Run `npx prisma migrate deploy` against production DB
- [ ] Seed initial product data (`npm run prisma:seed`)
- [ ] Verify product + variants visible on storefront

### 3. Stripe
- [ ] Activate Stripe production mode
- [ ] Update `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to production
- [ ] Create webhook endpoint in Stripe Dashboard:
  - URL: `https://vitalerschlafen.de/api/stripe/webhook`
  - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Set `STRIPE_WEBHOOK_SECRET` to the new webhook signing secret
- [ ] Test a real payment end-to-end

### 4. Domain & DNS
- [ ] Add custom domain `vitalerschlafen.de` in Vercel
- [ ] Configure DNS (A record / CNAME) at your registrar
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Verify `www` redirect to apex domain

### 5. Email
- [ ] Verify sending domain `vitalerschlafen.de` in Resend
- [ ] Set `RESEND_FROM_EMAIL` to verified address
- [ ] Test order confirmation email flow

### 6. SEO & Legal
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
- [ ] Review all legal pages: Impressum, Datenschutz, AGB, Widerruf, Versand
- [ ] Add OG image at `public/images/og-default.jpg` (1200×630px)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics / Plausible (optional)

### 7. Final Verification
- [ ] Full purchase flow: browse → cart → checkout → payment → confirmation
- [ ] Admin: login → view orders → update status
- [ ] Mobile: test all pages on phone
- [ ] Legal footer links work from every page
- [ ] Image loading and fallbacks work

---

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect the GitHub repository to Vercel for automatic deployments.

**Build command:** `npm run build` (default)
**Output directory:** `.next` (default)
**Install command:** `npm install` (default)

### Important Vercel Settings
- **Node.js version:** 20.x
- **Framework preset:** Next.js (auto-detected)
- **Environment variables:** Add all vars from the table above
- **Regions:** `fra1` (Frankfurt) recommended for German audience

---

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin dashboard (protected)
│   ├── api/          # API routes (Stripe webhook, invoices)
│   ├── product/      # Product detail pages
│   ├── cart/         # Shopping cart
│   ├── checkout/     # Checkout flow
│   ├── account/      # Customer account & orders
│   ├── impressum/    # Legal: Impressum
│   ├── datenschutz/  # Legal: Privacy policy
│   ├── agb/          # Legal: Terms & conditions
│   ├── widerruf/     # Legal: Cancellation policy
│   └── versand/      # Legal: Shipping & payment info
├── components/       # React components
│   ├── layout/       # Navbar, Footer
│   ├── home/         # Homepage sections
│   ├── product/      # Product detail components
│   ├── cart/         # Cart components
│   ├── checkout/     # Checkout components
│   └── admin/        # Admin components
├── lib/              # Utilities (auth, cart, db, stripe, email)
├── server/           # Server-side repositories
├── actions/          # Server actions
├── config/           # Site configuration
└── types/            # TypeScript types
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations (dev) |
| `npm run prisma:seed` | Seed database |
| `npm run prisma:studio` | Open Prisma Studio |

---

## License

Proprietary — © 2026 Vitalerschlafen. All rights reserved.
